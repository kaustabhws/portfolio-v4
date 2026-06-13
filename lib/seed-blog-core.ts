/**
 * Create a sample blog post ("Aurora Dashboard") in Payload — uploads a
 * cover + inline image (→ R2), builds Lexical content, links the post to the
 * Aurora Dashboard project, and publishes it. Returns log lines.
 *
 * Run via the CLI (mac/Linux):   npx payload run lib/seed-blog.ts
 * Or, on Windows, the route:      GET /seed-blog?secret=PAYLOAD_SECRET
 *
 * Re-runnable: an existing post with the same slug is deleted first.
 */
import { getPayload } from "payload";
import config from "@payload-config";

const SLUG = "aurora-dashboard";
const COVER_URL =
  "https://images.pexels.com/photos/29579755/pexels-photo-29579755.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940";
const INLINE_URL =
  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=srgb&fm=jpg&q=85&w=1400";

// ---- Lexical node builders -------------------------------------------------
const BOLD = 1;
const CODE = 16;

type Node = Record<string, unknown>;

const text = (t: string, format = 0): Node => ({
  type: "text",
  text: t,
  format,
  style: "",
  mode: "normal",
  detail: 0,
  version: 1,
});

const para = (...children: Node[]): Node => ({
  type: "paragraph",
  format: "",
  indent: 0,
  version: 1,
  direction: "ltr",
  textFormat: 0,
  children,
});

const heading = (tag: "h2" | "h3", t: string): Node => ({
  type: "heading",
  tag,
  format: "",
  indent: 0,
  version: 1,
  direction: "ltr",
  children: [text(t)],
});

const bullets = (items: Node[][]): Node => ({
  type: "list",
  listType: "bullet",
  tag: "ul",
  start: 1,
  format: "",
  indent: 0,
  version: 1,
  direction: "ltr",
  children: items.map((children, i) => ({
    type: "listitem",
    value: i + 1,
    format: "",
    indent: 0,
    version: 1,
    direction: "ltr",
    children,
  })),
});

const image = (mediaId: string | number): Node => ({
  type: "upload",
  relationTo: "media",
  value: mediaId,
  fields: null,
  format: "",
  version: 3,
});

async function uploadImage(
  payload: Awaited<ReturnType<typeof getPayload>>,
  url: string,
  name: string,
  alt: string,
) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const data = Buffer.from(await res.arrayBuffer());
  return payload.create({
    collection: "media",
    data: { alt },
    file: { data, mimetype: "image/jpeg", name, size: data.length },
  });
}

export async function seedBlog(): Promise<string[]> {
  const payload = await getPayload({ config });
  const log: string[] = [];

  // 1. Remove any previous copy so this is idempotent.
  const existing = await payload.find({
    collection: "posts",
    where: { slug: { equals: SLUG } },
    limit: 10,
  });
  for (const doc of existing.docs) {
    await payload.delete({ collection: "posts", id: doc.id });
    log.push(`Deleted existing post ${doc.id}`);
  }

  // 2. Upload images to R2.
  const cover = await uploadImage(
    payload,
    COVER_URL,
    "aurora-cover.jpg",
    "Aurora Dashboard — glassmorphic analytics interface",
  );
  log.push(`Uploaded cover → media ${cover.id}`);
  const inline = await uploadImage(
    payload,
    INLINE_URL,
    "aurora-inline.jpg",
    "Live charts rendered on a WebGL layer",
  );
  log.push(`Uploaded inline image → media ${inline.id}`);

  // 3. Link to the Aurora Dashboard project if it exists.
  const projectRes = await payload.find({
    collection: "projects",
    where: { title: { equals: "Aurora Dashboard" } },
    limit: 1,
  });
  const relatedProject = projectRes.docs[0]?.id;
  log.push(
    relatedProject
      ? `Linked to project ${relatedProject}`
      : "No 'Aurora Dashboard' project found — leaving relatedProject empty",
  );

  // 4. Build the Lexical document.
  const content = {
    root: {
      type: "root",
      format: "",
      indent: 0,
      version: 1,
      direction: "ltr",
      children: [
        para(
          text(
            "Aurora started with a contradiction. The brief asked for two things that usually fight each other: a ",
          ),
          text("dense, real-time analytics surface", BOLD),
          text(
            " — thousands of points, constantly updating — and a glassmorphic interface that feels weightless at 120fps. Frosted glass is expensive. Live data is expensive. Doing both, smoothly, meant being deliberate about where every millisecond went.",
          ),
        ),
        heading("h2", "The DOM is not a chart engine"),
        para(
          text(
            "The first version bound D3 straight to SVG. It looked great with a few hundred points and fell apart at a few thousand — every update touched the DOM and the frame budget (about ",
          ),
          text("8.3ms at 120fps", CODE),
          text(") was gone before any painting happened."),
        ),
        para(
          text(
            "The fix was to split D3's two jobs. D3 is brilliant at the math — scales, layouts, interpolation. It's a liability when it owns the rendering at scale. So D3 kept the math and all drawing moved to a WebGL layer: points became vertices in a buffer, not nodes in a tree.",
          ),
        ),
        image(inline.id),
        heading("h2", "Making updates cheap"),
        para(
          text(
            "Live data means the worst-case path runs constantly, so it has to be the cheapest path. Two decisions did most of the work:",
          ),
        ),
        bullets([
          [
            text("Pre-allocated typed arrays. ", BOLD),
            text(
              "Incoming ticks wrote into a reused Float32Array instead of allocating per frame. No per-frame garbage means no surprise GC pauses.",
            ),
          ],
          [
            text("One render loop, not many. ", BOLD),
            text(
              "Every animated component subscribed to a single requestAnimationFrame loop. State changes set flags; the loop read them once per frame and drew.",
            ),
          ],
        ]),
        heading("h2", "Glassmorphism, without the tax"),
        para(
          text("The single most expensive property in a glass UI is "),
          text("backdrop-filter: blur()", CODE),
          text(
            ". The trick is to make the browser not re-blur things that didn't change: promote glass panels onto their own layer, never animate the blur itself (animate transform and opacity instead), and keep the blur radius modest and constant.",
          ),
        ),
        heading("h2", "The lesson"),
        para(
          text(
            "Performance here wasn't one clever hack — it was a series of refusals: refusing to render data in the DOM, refusing to allocate in the hot path, refusing to let the compositor redo work it had already done. Let D3 think, let WebGL draw, and keep glass on its own layer.",
          ),
        ),
      ],
    },
  };

  // 5. Create the published post.
  const post = await payload.create({
    collection: "posts",
    data: {
      title: "Building Aurora: a glassmorphic dashboard that holds 120fps",
      slug: SLUG,
      status: "published",
      publishedAt: new Date().toISOString(),
      excerpt:
        "How I pushed a data-heavy analytics UI to a steady 120fps — moving charts off the DOM, taming backdrop-filter, and letting D3 do the math while WebGL does the drawing.",
      coverImage: cover.id,
      accent: "magenta",
      tags: [
        { tag: "TypeScript" },
        { tag: "D3" },
        { tag: "WebGL" },
        { tag: "Performance" },
        { tag: "Data Viz" },
      ],
      relatedProject,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      content: content as any,
      seo: {
        metaTitle: "Building Aurora — a 120fps glassmorphic dashboard",
        metaDescription:
          "A build write-up on Aurora Dashboard: rendering thousands of live data points at 120fps with D3 + WebGL, and keeping glassmorphism cheap.",
      },
    },
  });
  log.push(`Created post ${post.id} → /blog/${SLUG}`);

  return log;
}
