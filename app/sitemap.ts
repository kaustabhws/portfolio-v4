import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Single-page portfolio: the homepage is the canonical entry. Section
  // anchors (#about, #projects, …) live on the same document, so they don't
  // each warrant their own <url> entry.
  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
