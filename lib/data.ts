import { cache } from "react";
import { getPayload } from "payload";
import config from "@payload-config";
import { getProjectPostSlugs } from "./blog";

import {
  profile as seedProfile,
  stats as seedStats,
  skills as seedSkills,
  marqueeSkills as seedMarquee,
  projects as seedProjects,
  services as seedServices,
  education as seedEducation,
  aboutImage as seedAboutImage,
  type SkillGroup,
  type Project,
  type Service,
  type Education as EducationItem,
} from "./content";

export type Accent = "cyan" | "magenta" | "yellow";

export type ProfileData = {
  name: string;
  firstName: string;
  lastName: string;
  role: string;
  tagline: string;
  location: string;
  email: string;
  available: boolean;
  blurb: string;
  socials: { label: string; href: string }[];
};

export type SiteData = {
  profile: ProfileData;
  stats: { value: string; label: string }[];
  skills: SkillGroup[];
  marqueeSkills: string[];
  projects: Project[];
  services: Service[];
  education: EducationItem[];
  aboutImage: string;
};

/** The static seed shape, used as the fallback when no DB is configured. */
function seedData(): SiteData {
  return {
    profile: seedProfile,
    stats: seedStats,
    skills: seedSkills,
    marqueeSkills: seedMarquee,
    projects: seedProjects,
    services: seedServices,
    education: seedEducation,
    aboutImage: seedAboutImage,
  };
}

// Narrow a Payload upload field (id | Media object | null) down to a URL.
function mediaUrl(value: unknown, fallback: string): string {
  if (value && typeof value === "object" && "url" in value) {
    const url = (value as { url?: string }).url;
    if (url) return url;
  }
  return fallback;
}

function asAccent(value: unknown, fallback: Accent = "cyan"): Accent {
  return value === "cyan" || value === "magenta" || value === "yellow"
    ? value
    : fallback;
}

/**
 * Fetch all site content from Payload, falling back to the static seed
 * (lib/content.ts) whenever the database isn't reachable/configured.
 * Cached per-request so every section shares a single fetch.
 */
export const getSiteData = cache(async (): Promise<SiteData> => {
  try {
    const payload = await getPayload({ config });

    const [profileDoc, projectsRes, educationRes, servicesRes, skillsRes, postSlugs] =
      await Promise.all([
        payload.findGlobal({ slug: "profile", depth: 1 }),
        payload.find({ collection: "projects", sort: "order", limit: 100, depth: 1 }),
        payload.find({ collection: "education", sort: "order", limit: 100 }),
        payload.find({ collection: "services", sort: "order", limit: 100 }),
        payload.find({ collection: "skill-groups", sort: "order", limit: 100 }),
        getProjectPostSlugs(),
      ]);

    const seed = seedData();

    // If the DB is empty (not seeded yet), use the seed so the site still renders.
    if (!profileDoc?.firstName && projectsRes.docs.length === 0) {
      return seed;
    }

    const p = profileDoc as Record<string, unknown> & {
      socials?: { label?: string; href?: string }[];
      stats?: { value?: string; label?: string }[];
      marquee?: { skill?: string }[];
      portrait?: unknown;
    };

    const profile: ProfileData = {
      name: (p.name as string) || `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim(),
      firstName: (p.firstName as string) || seed.profile.firstName,
      lastName: (p.lastName as string) || seed.profile.lastName,
      role: (p.role as string) || seed.profile.role,
      tagline: (p.tagline as string) || seed.profile.tagline,
      location: (p.location as string) || seed.profile.location,
      email: (p.email as string) || seed.profile.email,
      available: p.available !== false,
      blurb: (p.blurb as string) || seed.profile.blurb,
      socials:
        p.socials?.map((s) => ({
          label: s.label ?? "",
          href: s.href ?? "#",
        })) ?? seed.profile.socials,
    };

    const projects: Project[] = projectsRes.docs.map((d) => {
      const doc = d as Record<string, unknown> & {
        tags?: { tag?: string }[];
      };
      // If a published post links to this project, the card deep-links to the
      // write-up; otherwise it falls back to the live URL or configured href.
      const postSlug = postSlugs[String(doc.id ?? "")];
      const liveUrl = (doc.liveUrl as string) || "";
      const primary = postSlug
        ? `/blog/${postSlug}`
        : liveUrl || (doc.href as string) || "#";
      return {
        title: (doc.title as string) ?? "",
        category: (doc.category as string) ?? "",
        year: (doc.year as string) ?? "",
        description: (doc.description as string) ?? "",
        tags: doc.tags?.map((t) => t.tag ?? "").filter(Boolean) ?? [],
        // Empty string → the card renders a gradient placeholder.
        image: mediaUrl(doc.image, ""),
        accent: asAccent(doc.accent),
        href: primary,
        github: (doc.github as string) || undefined,
        liveUrl: liveUrl || undefined,
        adminUrl: (doc.adminUrl as string) || undefined,
        postSlug,
        featured: Boolean(doc.featured),
      };
    });

    const education: EducationItem[] = educationRes.docs.map((d) => {
      const doc = d as Record<string, unknown>;
      return {
        period: (doc.period as string) ?? "",
        title: (doc.title as string) ?? "",
        org: (doc.org as string) ?? "",
        description: (doc.description as string) ?? "",
        accent: asAccent(doc.accent),
      };
    });

    const services: Service[] = servicesRes.docs.map((d) => {
      const doc = d as Record<string, unknown> & {
        deliverables?: { item?: string }[];
      };
      return {
        index: (doc.index as string) ?? "",
        title: (doc.title as string) ?? "",
        description: (doc.description as string) ?? "",
        deliverables: doc.deliverables?.map((x) => x.item ?? "").filter(Boolean) ?? [],
        accent: asAccent(doc.accent),
      };
    });

    const skills: SkillGroup[] = skillsRes.docs.map((d) => {
      const doc = d as Record<string, unknown> & {
        items?: { name?: string; level?: number }[];
      };
      return {
        title: (doc.title as string) ?? "",
        accent: asAccent(doc.accent),
        items: doc.items?.map((i) => ({ name: i.name ?? "", level: i.level ?? 0 })) ?? [],
      };
    });

    return {
      profile,
      stats:
        p.stats?.map((s) => ({ value: s.value ?? "", label: s.label ?? "" })) ??
        seed.stats,
      skills: skills.length ? skills : seed.skills,
      marqueeSkills:
        p.marquee?.map((m) => m.skill ?? "").filter(Boolean) ?? seed.marqueeSkills,
      projects: projects.length ? projects : seed.projects,
      services: services.length ? services : seed.services,
      education: education.length ? education : seed.education,
      aboutImage: mediaUrl(p.portrait, seed.aboutImage),
    };
  } catch {
    // No database / not configured yet — render from the static seed.
    return seedData();
  }
});
