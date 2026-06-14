"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowUpRight,
  GithubLogo,
  Storefront,
  Gauge,
  Copy,
  Check,
  Key,
} from "@phosphor-icons/react";
import Reveal from "./Reveal";
import SectionLabel from "./SectionLabel";
import { type Project } from "@/lib/content";

const accentColor: Record<string, string> = {
  cyan: "#00f0ff",
  magenta: "#ff003c",
  yellow: "#ffb800",
};

function CopyField({
  value,
  label,
  accent,
}: {
  value: string;
  label: string;
  accent: string;
}) {
  const [copied, setCopied] = useState(false);
  const copy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    });
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="group/copy flex w-full items-center justify-between gap-2 rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-left transition-colors hover:border-white/25"
      title={`Copy ${label.toLowerCase()}`}
    >
      <div className="flex min-w-0 flex-col">
        <span
          className="font-mono text-[0.62rem] uppercase tracking-[0.2em]"
          style={{ color: accent }}
        >
          {label}
        </span>
        <span className="truncate font-mono text-xs text-zinc-300">{value}</span>
      </div>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-white/10 text-zinc-400 transition-colors group-hover/copy:border-white/30 group-hover/copy:text-white">
        {copied ? <Check weight="bold" /> : <Copy />}
      </span>
    </button>
  );
}

function DemoCreds({
  email,
  password,
  accent,
}: {
  email: string;
  password: string;
  accent: string;
}) {
  return (
    <div className="relative z-20 mx-7 mt-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-3 flex items-center gap-2">
        <Key
          weight="bold"
          className="h-3.5 w-3.5"
          style={{ color: accent }}
        />
        <span
          className="font-mono text-[0.62rem] uppercase tracking-[0.22em]"
          style={{ color: accent }}
        >
          Demo login
        </span>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <CopyField value={email} label="Email" accent={accent} />
        <CopyField value={password} label="Password" accent={accent} />
      </div>
    </div>
  );
}

function LinkButton({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300 transition-all hover:border-white/40 hover:bg-white/10 hover:text-white"
    >
      <Icon weight="bold" />
      {label}
    </Link>
  );
}

function TiltCard({ project, featured }: { project: Project; featured?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rx = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), {
    stiffness: 200,
    damping: 20,
  });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), {
    stiffness: 200,
    damping: 20,
  });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const accent = accentColor[project.accent];
  const hasLinks = Boolean(project.github || project.liveUrl || project.adminUrl);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      className="glass group relative flex h-full flex-col overflow-hidden rounded-3xl"
      data-testid={`project-card-${project.title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      {/* Primary clickable region — image + text. The stretched link makes the
          whole area navigate, while footer link buttons stay independent. */}
      <div className="relative flex flex-1 flex-col">
        <Link
          href={project.href}
          aria-label={project.title}
          className="absolute inset-0 z-10"
          data-testid={`project-link-${project.title.toLowerCase().replace(/\s+/g, "-")}`}
        />

        {/* image / placeholder */}
        <div
          className={`relative w-full overflow-hidden ${featured ? "h-72 lg:h-96" : "h-56"}`}
        >
          {project.image ? (
            <Image
              src={project.image}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover opacity-70 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(130% 130% at 0% 0%, ${accent}26, transparent 55%), radial-gradient(120% 120% at 100% 100%, ${accent}14, transparent 60%), #0a0a0c`,
              }}
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/20 to-transparent" />
          <div className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-all duration-300 group-hover:bg-white group-hover:text-black">
            <ArrowUpRight weight="bold" />
          </div>
        </div>

        {/* body */}
        <div className="flex flex-1 flex-col px-7 pt-7">
          <div className="mb-3 flex items-center gap-3">
            <span className="label" style={{ color: accent }}>
              {project.category}
            </span>
            <span className="h-px w-6 bg-white/20" />
            <span className="font-mono text-xs text-zinc-500">{project.year}</span>
          </div>

          <h3 className="font-display text-2xl font-bold tracking-tight lg:text-3xl">
            {project.title}
          </h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-400">
            {project.description}
          </p>

          {project.postSlug && (
            <span
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold"
              style={{ color: accent }}
            >
              Read the build <ArrowUpRight weight="bold" />
            </span>
          )}

          {project.tags.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {project.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-zinc-400"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Demo credentials block — interactive copy buttons sit above the
          stretched link via z-index so clicks don't trigger navigation. */}
      {project.demoEmail && project.demoPassword && (
        <DemoCreds
          email={project.demoEmail}
          password={project.demoPassword}
          accent={accent}
        />
      )}

      {/* Footer link buttons — sit above the stretched link (own anchors). */}
      {hasLinks && (
        <div className="relative z-20 flex flex-wrap gap-2 px-7 pb-7 pt-5">
          {project.github && (
            <LinkButton href={project.github} icon={GithubLogo} label="Code" />
          )}
          {project.liveUrl && (
            <LinkButton href={project.liveUrl} icon={Storefront} label="Live" />
          )}
          {project.adminUrl && (
            <LinkButton href={project.adminUrl} icon={Gauge} label="Admin" />
          )}
        </div>
      )}
    </motion.div>
  );
}

export default function Projects({ projects }: { projects: Project[] }) {
  return (
    <section id="work" className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-40">
      <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <SectionLabel index="03">Selected Work</SectionLabel>
          <Reveal>
            <h2 className="max-w-xl font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Projects built to be felt, not just used.
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold transition-colors hover:bg-white/10"
          >
            Start a project <ArrowUpRight weight="bold" />
          </Link>
        </Reveal>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {projects.map((p, i) => (
          <Reveal
            key={p.title}
            delay={(i % 2) * 0.08}
            className={p.featured ? "md:col-span-8" : "md:col-span-4"}
          >
            <TiltCard project={p} featured={p.featured} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
