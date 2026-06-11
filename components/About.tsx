import Image from "next/image";
import Reveal from "./Reveal";
import SectionLabel from "./SectionLabel";
import type { ProfileData } from "@/lib/data";

export default function About({
  profile,
  stats,
  aboutImage,
}: {
  profile: ProfileData;
  stats: { value: string; label: string }[];
  aboutImage: string;
}) {
  return (
    <section id="about" className="relative mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-40">
      <SectionLabel index="01">About</SectionLabel>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Big statement */}
        <Reveal className="md:col-span-7">
          <div className="glass h-full rounded-3xl p-8 lg:p-12">
            <h2 className="font-display text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-5xl">
              I design and build{" "}
              <span className="text-gradient">interfaces that feel alive</span>{" "}
              — where engineering meets motion and depth.
            </h2>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-zinc-400">
              {profile.blurb}
            </p>
          </div>
        </Reveal>

        {/* Portrait */}
        <Reveal delay={0.1} className="md:col-span-5">
          <div className="glass glass-hover group relative h-full min-h-[320px] overflow-hidden rounded-3xl">
            <Image
              src={aboutImage}
              alt={`${profile.name}, creative developer`}
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover opacity-80 grayscale transition-all duration-700 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <p className="label !text-cyan">Based in</p>
              <p className="mt-1 font-display text-xl font-bold">
                {profile.location}
              </p>
            </div>
          </div>
        </Reveal>

        {/* Stats row */}
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.06} className="md:col-span-3">
            <div className="glass glass-hover flex h-full flex-col justify-between rounded-3xl p-6">
              <span className="font-display text-4xl font-extrabold tracking-tight lg:text-5xl">
                {s.value}
              </span>
              <span className="mt-4 text-sm text-zinc-500">{s.label}</span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
