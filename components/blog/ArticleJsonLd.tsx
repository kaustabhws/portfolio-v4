import { SITE_URL } from "@/lib/seo";
import type { BlogPost } from "@/lib/blog";

/**
 * BlogPosting structured data for a single post — enables rich results
 * (article cards, author, dates). Author links to the Person node emitted
 * on the homepage so search engines connect posts to the developer.
 */
export default function ArticleJsonLd({
  post,
  authorName,
}: {
  post: BlogPost;
  authorName: string;
}) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  const image = post.coverImage
    ? post.coverImage.startsWith("http")
      ? post.coverImage
      : `${SITE_URL}${post.coverImage}`
    : `${SITE_URL}/blog/${post.slug}/opengraph-image`;

  const data = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.seo.description || post.excerpt,
    image,
    datePublished: post.publishedAt || undefined,
    dateModified: post.publishedAt || undefined,
    inLanguage: "en",
    keywords: post.tags.length ? post.tags.join(", ") : undefined,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Person", "@id": `${SITE_URL}/#person`, name: authorName },
    publisher: { "@id": `${SITE_URL}/#person` },
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
