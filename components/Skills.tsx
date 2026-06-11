"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "./Reveal";
import SectionLabel from "./SectionLabel";
import type { SkillGroup } from "@/lib/content";

const accentColor: Record<string, string> = {
  cyan: "#00f0ff",
  magenta: "#ff003c",
  yellow: "#ffb800",
};

function levelLabel(level: number): string {
  if (level >= 90) return "Expert";
  if (level >= 80) return "Advanced";
  if (level >= 70) return "Proficient";
  return "Skilled";
}

type FlatSkill = {
  name: string;
  level: number;
  accent: string;
  category: string;
};

export default function Skills({ skills }: { skills: SkillGroup[] }) {
  const all: FlatSkill[] = skills.flatMap((g) =>
    g.items.map((i) => ({
      name: i.name,
      level: i.level,
      accent: g.accent,
      category: g.title,
    })),
  );

  const categories = ["All", ...skills.map((g) => g.title)];
  const [active, setActive] = useState("All");
  const items = active === "All" ? all : all.filter((s) => s.category === active);

  return (
    <section id="skills" className="relative overflow-hidden py-28 lg:py-40">
      {/* Ambient glow (replaces the old 3D cluster) */}
      <div className="orb left-[8%] top-[20%] h-[26vw] w-[26vw] bg-cyan/20" />
      <div className="orb bottom-[10%] right-[6%] h-[24vw] w-[24vw] bg-magenta/20" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
        <SectionLabel index="02">Capabilities</SectionLabel>

        <Reveal>
          <h2 className="mb-10 max-w-2xl font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            A full-stack creative toolkit, sharpened over years of shipping.
          </h2>
        </Reveal>

        {/* Category filter */}
        <Reveal>
          <div className="mb-12 flex flex-wrap gap-2.5">
            {categories.map((cat) => {
              const isActive = active === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActive(cat)}
                  className={`relative rounded-full px-5 py-2.5 text-sm font-semibold transition-colors duration-300 ${
                    isActive
                      ? "text-black"
                      : "text-zinc-400 hover:text-white"
                  }`}
                  data-testid={`skills-filter-${cat.toLowerCase().replace(/[^a-z]/g, "")}`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="skill-chip"
                      transition={{ type: "spring", damping: 24, stiffness: 320 }}
                      className="absolute inset-0 rounded-full bg-white"
                    />
                  )}
                  {!isActive && (
                    <span className="absolute inset-0 rounded-full border border-white/15" />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Skill cloud */}
        <motion.div layout className="flex flex-wrap gap-3">
          <AnimatePresence mode="popLayout">
            {items.map((skill) => (
              <motion.div
                key={skill.name}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ type: "spring", damping: 22, stiffness: 240 }}
                style={{ ["--accent" as string]: accentColor[skill.accent] }}
                className="group glass flex cursor-default items-center gap-3 rounded-2xl px-5 py-3.5 transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-[0_0_30px_-6px_var(--accent)]"
                data-testid={`skill-${skill.name.toLowerCase().replace(/[^a-z0-9]/g, "")}`}
              >
                <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--accent)] transition-transform duration-300 group-hover:scale-150" />
                <span className="font-display text-base font-bold sm:text-lg">
                  {skill.name}
                </span>
                <span className="ml-0.5 max-w-0 overflow-hidden font-mono text-[0.62rem] uppercase tracking-[0.18em] text-[var(--accent)] opacity-0 transition-all duration-300 group-hover:ml-0 group-hover:max-w-[90px] group-hover:opacity-100">
                  {levelLabel(skill.level)}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
