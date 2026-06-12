/* ============================================================
   SEO helpers — shared site URL + keyword bank.
   Set NEXT_PUBLIC_SITE_URL in .env to your production origin
   (e.g. https://kaustabh.dev). Everything else derives from it.
   ============================================================ */

/** Production origin, no trailing slash. Falls back to a sane default. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"
).replace(/\/+$/, "");

/**
 * Keyword bank for search engines. Generic role/skill terms are blended
 * with the owner's specifics (name, role, location, top skills) at call time.
 */
export const BASE_KEYWORDS = [
  "software developer",
  "software engineer",
  "full stack developer",
  "full-stack engineer",
  "frontend developer",
  "front-end engineer",
  "web developer",
  "web designer",
  "UI engineer",
  "UI/UX developer",
  "React developer",
  "Next.js developer",
  "TypeScript developer",
  "JavaScript engineer",
  "Node.js developer",
  "web application developer",
  "creative developer",
  "freelance developer",
  "freelance software engineer",
  "portfolio",
  "developer portfolio",
  "hire developer",
  "remote developer",
];

/** De-dupe + trim a keyword list, dropping empties. */
export function buildKeywords(...extra: (string | undefined | null)[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const k of [...extra, ...BASE_KEYWORDS]) {
    const v = k?.trim();
    if (!v) continue;
    const key = v.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(v);
  }
  return out;
}
