import type { CollectionConfig, FieldHook } from "payload";
import { accentField } from "../fields";

/** kebab-case a string for use as a URL slug. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Fill the slug, in priority order:
 *  1. a slug the author typed (respected, just normalised),
 *  2. the linked project's title (→ "Nebula Commerce" becomes "nebula-commerce"),
 *  3. the post title.
 */
const formatSlug: FieldHook = async ({ value, data, req }) => {
  if (typeof value === "string" && value.length) return slugify(value);

  const projectId = data?.relatedProject;
  if (projectId && req?.payload) {
    try {
      const project = await req.payload.findByID({
        collection: "projects",
        id: projectId as string | number,
        depth: 0,
      });
      if (project?.title) return slugify(project.title as string);
    } catch {
      /* project lookup failed — fall through to the title */
    }
  }

  if (data?.title) return slugify(data.title as string);
  return value;
};

export const Posts: CollectionConfig = {
  slug: "posts",
  access: { read: () => true },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "status", "publishedAt"],
    description: "Long-form posts — project build write-ups, notes, tutorials.",
  },
  defaultSort: "-publishedAt",
  fields: [
    { name: "title", type: "text", required: true },
    {
      name: "slug",
      type: "text",
      unique: true,
      index: true,
      admin: {
        position: "sidebar",
        description: "URL path. Auto-filled from the title — edit if you like.",
      },
      hooks: { beforeValidate: [formatSlug] },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
      admin: {
        position: "sidebar",
        description: "Only Published posts appear on the site.",
      },
    },
    {
      name: "publishedAt",
      type: "date",
      defaultValue: () => new Date().toISOString(),
      admin: {
        position: "sidebar",
        description: "Used for ordering and the displayed date.",
        date: { pickerAppearance: "dayAndTime" },
      },
    },
    {
      name: "relatedProject",
      type: "relationship",
      relationTo: "projects",
      admin: {
        position: "sidebar",
        description:
          "Optional. Link this post to a project — its card will then point here, and a blank slug auto-fills from the project name.",
      },
    },
    {
      name: "excerpt",
      type: "textarea",
      required: true,
      admin: {
        description: "1–2 sentence summary — shown on cards and used for SEO.",
      },
    },
    {
      name: "coverImage",
      type: "upload",
      relationTo: "media",
      admin: { description: "Hero image for the post and social cards." },
    },
    accentField,
    {
      name: "tags",
      type: "array",
      labels: { singular: "Tag", plural: "Tags" },
      fields: [{ name: "tag", type: "text" }],
    },
    { name: "content", type: "richText", required: true },
    {
      name: "seo",
      type: "group",
      label: "SEO overrides",
      admin: { description: "Optional. Falls back to the title/excerpt above." },
      fields: [
        { name: "metaTitle", type: "text" },
        { name: "metaDescription", type: "textarea" },
      ],
    },
  ],
};
