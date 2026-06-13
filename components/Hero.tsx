"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "@phosphor-icons/react";
import type { ProfileData } from "@/lib/data";

const lineUp = {
  hidden: { y: "110%" },
  show: (i: number) => ({
    y: "0%",
    transition: {
      type: "spring" as const,
      damping: 18,
      stiffness: 90,
      delay: 0.15 + i * 0.12,
    },
  }),
};

export default function Hero({ profile }: { profile: ProfileData }) {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 pt-28 lg:px-10"
    >
      {/* Glow orbs */}
      <div className="orb left-[-10%] top-[10%] h-[42vw] w-[42vw] bg-magenta/40" />
      <div className="orb bottom-[-5%] right-[-8%] h-[36vw] w-[36vw] bg-cyan/30" />

      {/* Headline */}
      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-7xl">
        <motion.div
          initial="hidden"
          animate="show"
          className="space-y-2"
        >
          <div className="overflow-hidden">
            <motion.p
              custom={0}
              variants={lineUp}
              className="label mb-6 !text-zinc-400"
            >
              {profile.role} — {profile.location}
            </motion.p>
          </div>

          <div className="overflow-hidden">
            <motion.h1
              custom={1}
              variants={lineUp}
              className="font-display text-[18vw] font-extrabold uppercase leading-[0.82] tracking-tighter sm:text-[16vw] lg:text-[13vw]"
            >
              {profile.firstName}
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              custom={2}
              variants={lineUp}
              className="text-stroke font-display text-[18vw] font-extrabold uppercase leading-[0.82] tracking-tighter sm:text-[16vw] lg:text-[13vw]"
            >
              {profile.lastName}
            </motion.h1>
          </div>
        </motion.div>

        {/* Sub row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="pointer-events-auto mt-10 flex max-w-2xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <p className="max-w-md text-base leading-relaxed text-zinc-400">
            {profile.tagline} — fusing engineering precision with motion, depth
            and bold typography.
          </p>
          <Link
            href="/#work"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold transition-colors hover:bg-white/10"
            data-testid="hero-view-work"
          >
            View work
            <ArrowUpRight
              weight="bold"
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="relative z-10 mx-auto mt-16 flex w-full max-w-7xl items-center gap-3 text-zinc-500"
      >
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.8 }}
        >
          <ArrowDown />
        </motion.span>
        <span className="label">Scroll to explore</span>
      </motion.div>
    </section>
  );
}
