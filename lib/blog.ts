import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import type { Accent } from "./data";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string | null;
  coverAlt: string;
  content: unknown; // Lexical SerializedEditorState
  tags: string[];
  accent: Accent;
  publishedAt: string;
  readingTime: number;
  relatedProjectId: string | null;
  seo: { title?: string; description?: string };
};

function asAccent(value: unknown): Accent {
  return value === "cyan" || value === "magenta" || value === "yellow"
    ? value
    : "cyan";
}

// Relationship values arrive as an id (depth 0) or a populated doc (depth ≥1).
function relationId(value: unknown): string | null {
  if (!value) return null;
  if (typeof value === "object" && "id" in value) {
    return String((value as { id: unknown }).id);
  }
  return String(value);
}

function mediaUrl(value: unknown): string | null {
  if (value && typeof value === "object" && "url" in value) {
    const url = (value as { url?: string }).url;
    if (url) return url;
  }
  return null;
}

function mediaAlt(value: unknown, fallback: string): string {
  if (value && typeof value === "object" && "alt" in value) {
    const alt = (value as { alt?: string }).alt;
    if (alt) return alt;
  }
  return fallback;
}

// Walk a Lexical tree collecting text, so we can estimate reading time.
function lexicalText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as Record<string, unknown>;
  if (typeof n.text === "string") return n.text;
  const children = (n.children ?? (n.root as Record<string, unknown>)?.children) as
    | unknown[]
    | undefined;
  if (Array.isArray(children)) return children.map(lexicalText).join(" ");
  if (n.root) return lexicalText(n.root);
  return "";
}

function readingTime(content: unknown): number {
  const words = lexicalText(content).trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function mapPost(doc: Record<string, unknown>): BlogPost {
  const title = (doc.title as string) ?? "";
  return {
    id: String(doc.id ?? ""),
    title,
    slug: (doc.slug as string) ?? "",
    excerpt: (doc.excerpt as string) ?? "",
    coverImage: mediaUrl(doc.coverImage),
    coverAlt: mediaAlt(doc.coverImage, title),
    content: doc.content,
    tags:
      (doc.tags as { tag?: string }[] | undefined)
        ?.map((t) => t.tag ?? "")
        .filter(Boolean) ?? [],
    accent: asAccent(doc.accent),
    publishedAt: (doc.publishedAt as string) ?? (doc.createdAt as string) ?? "",
    readingTime: readingTime(doc.content),
    relatedProjectId: relationId(doc.relatedProject),
    seo: {
      title: (doc.seo as { metaTitle?: string } | undefined)?.metaTitle,
      description: (doc.seo as { metaDescription?: string } | undefined)
        ?.metaDescription,
    },
  };
}

/** All published posts, newest first. Returns [] if the DB is unreachable. */
export const getPublishedPosts = cache(async (): Promise<BlogPost[]> => {
  try {
    const payload = await getPayload({ config });
    const res = await payload.find({
      collection: "posts",
      where: { status: { equals: "published" } },
      sort: "-publishedAt",
      limit: 200,
      depth: 1,
    });
    return res.docs.map((d) => mapPost(d as Record<string, unknown>));
  } catch {
    return [];
  }
});

/** A single published post by slug, or null if not found / DB unreachable. */
export const getPostBySlug = cache(
  async (slug: string): Promise<BlogPost | null> => {
    try {
      const payload = await getPayload({ config });
      const res = await payload.find({
        collection: "posts",
        where: {
          and: [{ slug: { equals: slug } }, { status: { equals: "published" } }],
        },
        limit: 1,
        // depth 2 so images embedded inside the rich-text body populate.
        depth: 2,
      });
      const doc = res.docs[0];
      return doc ? mapPost(doc as Record<string, unknown>) : null;
    } catch {
      return null;
    }
  },
);

/**
 * Map of project id → slug of the newest published post linked to it.
 * Lets project cards deep-link to their write-up when one exists.
 */
export const getProjectPostSlugs = cache(
  async (): Promise<Record<string, string>> => {
    const posts = await getPublishedPosts();
    const map: Record<string, string> = {};
    for (const post of posts) {
      // posts are newest-first, so the first match per project wins.
      if (post.relatedProjectId && !map[post.relatedProjectId]) {
        map[post.relatedProjectId] = post.slug;
      }
    }
    return map;
  },
);

/** Format an ISO date as e.g. "June 13, 2026". */
export function formatPostDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}
