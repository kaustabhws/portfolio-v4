import { getPayload } from "payload";
import config from "@payload-config";

import {
  profile,
  stats,
  skills,
  marqueeSkills,
  projects,
  services,
  education,
} from "./content";

export const ADMIN_EMAIL = "admin@example.com";
export const ADMIN_PASSWORD = "changeme123";

/**
 * Populate Payload with the placeholder content from lib/content.ts.
 * Safe to re-run: collections are only filled when empty.
 * Returns log lines describing what happened.
 */
export async function seedPayload(): Promise<string[]> {
  const payload = await getPayload({ config });
  const log: string[] = [];

  // 1. Admin user
  const users = await payload.find({ collection: "users", limit: 1 });
  if (users.totalDocs === 0) {
    await payload.create({
      collection: "users",
      data: { name: profile.name, email: ADMIN_EMAIL, password: ADMIN_PASSWORD },
    });
    log.push(`Created admin user → ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  } else {
    log.push("Admin user already exists — skipped.");
  }

  // 2. Profile global
  await payload.updateGlobal({
    slug: "profile",
    data: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      name: profile.name,
      role: profile.role,
      tagline: profile.tagline,
      location: profile.location,
      email: profile.email,
      available: profile.available,
      blurb: profile.blurb,
      socials: profile.socials.map((s) => ({
        label: s.label,
        handle: s.handle,
        href: s.href,
      })),
      stats: stats.map((s) => ({ value: s.value, label: s.label })),
      marquee: marqueeSkills.map((skill) => ({ skill })),
    },
  });
  log.push("Profile global updated.");

  // 3. Collections (only when empty)
  const projectsCount = await payload.count({ collection: "projects" });
  if (projectsCount.totalDocs === 0) {
    for (let i = 0; i < projects.length; i++) {
      const p = projects[i];
      await payload.create({
        collection: "projects",
        data: {
          title: p.title,
          category: p.category,
          year: p.year,
          description: p.description,
          tags: p.tags.map((tag) => ({ tag })),
          accent: p.accent,
          href: p.href,
          featured: p.featured ?? false,
          order: i,
        },
      });
    }
    log.push(`Seeded ${projects.length} projects.`);
  } else {
    log.push("Projects already populated — skipped.");
  }

  const eduCount = await payload.count({ collection: "education" });
  if (eduCount.totalDocs === 0) {
    for (let i = 0; i < education.length; i++) {
      const e = education[i];
      await payload.create({
        collection: "education",
        data: {
          period: e.period,
          title: e.title,
          org: e.org,
          description: e.description,
          accent: e.accent,
          order: i,
        },
      });
    }
    log.push(`Seeded ${education.length} education entries.`);
  } else {
    log.push("Education already populated — skipped.");
  }

  const svcCount = await payload.count({ collection: "services" });
  if (svcCount.totalDocs === 0) {
    for (let i = 0; i < services.length; i++) {
      const s = services[i];
      await payload.create({
        collection: "services",
        data: {
          index: s.index,
          title: s.title,
          description: s.description,
          deliverables: s.deliverables.map((item) => ({ item })),
          accent: s.accent,
          order: i,
        },
      });
    }
    log.push(`Seeded ${services.length} services.`);
  } else {
    log.push("Services already populated — skipped.");
  }

  const skillCount = await payload.count({ collection: "skill-groups" });
  if (skillCount.totalDocs === 0) {
    for (let i = 0; i < skills.length; i++) {
      const g = skills[i];
      await payload.create({
        collection: "skill-groups",
        data: {
          title: g.title,
          accent: g.accent,
          items: g.items.map((it) => ({ name: it.name, level: it.level })),
          order: i,
        },
      });
    }
    log.push(`Seeded ${skills.length} skill groups.`);
  } else {
    log.push("Skill groups already populated — skipped.");
  }

  log.push("✅ Seed complete.");
  return log;
}
