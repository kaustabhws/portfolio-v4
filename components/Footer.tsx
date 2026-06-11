import type { ProfileData } from "@/lib/data";

export default function Footer({ profile }: { profile: ProfileData }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-white/10 px-6 py-12 lg:px-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 sm:flex-row">
        <a
          href="#top"
          className="font-display text-2xl font-extrabold tracking-tight"
        >
          {profile.firstName}
          <span className="text-cyan">.</span>
        </a>

        <p className="text-center font-mono text-xs text-zinc-500">
          © {year} {profile.name} — Built with Next.js &amp; Payload.
        </p>

        <div className="flex gap-5">
          {profile.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-zinc-500 transition-colors hover:text-white"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
