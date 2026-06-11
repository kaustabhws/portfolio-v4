import { ArrowUpRight, Check } from "@phosphor-icons/react/dist/ssr";
import Reveal from "./Reveal";
import SectionLabel from "./SectionLabel";
import type { Service } from "@/lib/content";

const accentColor: Record<string, string> = {
  cyan: "#00f0ff",
  magenta: "#ff003c",
  yellow: "#ffb800",
};

export default function Services({ services }: { services: Service[] }) {
  return (
    <section id="services" className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-40">
      <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <SectionLabel index="05">Freelance Services</SectionLabel>
          <Reveal>
            <h2 className="max-w-xl font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Available for select freelance collaborations.
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <p className="max-w-xs text-sm leading-relaxed text-zinc-400">
            From standalone 3D experiences to full product builds — I plug into
            your team or run the show end-to-end.
          </p>
        </Reveal>
      </div>

      <div className="space-y-5">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.08}>
            <div className="glass glass-hover group grid grid-cols-1 gap-6 rounded-3xl p-8 lg:grid-cols-12 lg:items-center lg:p-10">
              {/* index + title */}
              <div className="flex items-start gap-5 lg:col-span-5">
                <span
                  className="font-mono text-sm"
                  style={{ color: accentColor[s.accent] }}
                >
                  {s.index}
                </span>
                <h3 className="font-display text-2xl font-bold tracking-tight lg:text-3xl">
                  {s.title}
                </h3>
              </div>

              {/* description */}
              <p className="text-sm leading-relaxed text-zinc-400 lg:col-span-4">
                {s.description}
              </p>

              {/* deliverables */}
              <ul className="flex flex-col gap-2 lg:col-span-3">
                {s.deliverables.map((d) => (
                  <li key={d} className="flex items-center gap-2 text-sm text-zinc-300">
                    <Check
                      weight="bold"
                      className="shrink-0"
                      style={{ color: accentColor[s.accent] }}
                    />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>

      {/* CTA banner */}
      <Reveal delay={0.1}>
        <a
          href="#contact"
          className="glass glass-hover mt-6 flex flex-col items-center justify-between gap-6 rounded-3xl p-10 text-center sm:flex-row sm:text-left"
          data-testid="services-cta"
        >
          <div>
            <p className="label !text-yellow">Now booking — Q3 2026</p>
            <h3 className="mt-3 font-display text-2xl font-bold tracking-tight lg:text-3xl">
              Have something ambitious in mind?
            </h3>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-black">
            Get in touch <ArrowUpRight weight="bold" />
          </span>
        </a>
      </Reveal>
    </section>
  );
}
