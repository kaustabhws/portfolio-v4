import { SITE_URL } from "@/lib/seo";
import type { SiteData } from "@/lib/data";

/**
 * Structured data (schema.org) for rich results. Emits a Person graph
 * (the developer) joined to a WebSite, plus the skill list as knowsAbout.
 * Server-rendered into <head>-adjacent markup; crawlers read it directly.
 */
export default function JsonLd({ data }: { data: SiteData }) {
  const { profile, skills } = data;
  const name = profile.name || `${profile.firstName} ${profile.lastName}`;
  const knowsAbout = skills.flatMap((g) => g.items.map((i) => i.name));
  const sameAs = profile.socials.map((s) => s.href).filter((h) => h && h !== "#");

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${SITE_URL}/#person`,
        name,
        jobTitle: profile.role,
        description: profile.blurb,
        email: profile.email ? `mailto:${profile.email}` : undefined,
        url: SITE_URL,
        image: `${SITE_URL}/opengraph-image`,
        homeLocation: profile.location
          ? { "@type": "Place", name: profile.location }
          : undefined,
        knowsAbout,
        sameAs: sameAs.length ? sameAs : undefined,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: `${name} — Portfolio`,
        description: profile.tagline || profile.blurb,
        inLanguage: "en",
        publisher: { "@id": `${SITE_URL}/#person` },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  );
}
