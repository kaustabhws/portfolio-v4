import Reveal from "./Reveal";
import SectionLabel from "./SectionLabel";
import type { Education as EducationItem } from "@/lib/content";

const accentColor: Record<string, string> = {
  cyan: "#00f0ff",
  magenta: "#ff003c",
  yellow: "#ffb800",
};

export default function Education({
  education,
}: {
  education: EducationItem[];
}) {
  return (
    <section id="path" className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-40">
      <SectionLabel index="04">Experience &amp; Education</SectionLabel>

      <Reveal>
        <h2 className="mb-16 max-w-2xl font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
          The path so far — a timeline of craft, study and recognition.
        </h2>
      </Reveal>

      <div className="relative">
        {/* vertical line */}
        <div className="absolute left-[7px] top-2 h-full w-px bg-linear-to-b from-white/30 via-white/10 to-transparent md:left-1/2" />

        <div className="space-y-12">
          {education.map((item, i) => {
            const left = i % 2 === 0;
            return (
              <Reveal key={item.title} delay={0.05}>
                <div
                  className={`relative flex flex-col gap-4 pl-10 md:grid md:grid-cols-2 md:gap-12 md:pl-0 ${
                    left ? "" : ""
                  }`}
                >
                  {/* glowing dot — sits on the timeline (left on mobile, center on desktop) */}
                  <span
                    className="absolute left-[7px] top-2 z-10 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-black md:left-1/2"
                    style={{
                      background: accentColor[item.accent],
                      boxShadow: `0 0 18px 2px ${accentColor[item.accent]}`,
                    }}
                  />

                  {/* content — alternate sides on desktop */}
                  <div
                    className={
                      left
                        ? "md:col-start-1 md:pr-12 md:text-right"
                        : "md:col-start-2 md:pl-12"
                    }
                  >
                    <div className="glass glass-hover rounded-3xl p-6 lg:p-8">
                      <span
                        className="label"
                        style={{ color: accentColor[item.accent] }}
                      >
                        {item.period}
                      </span>
                      <h3 className="mt-3 font-display text-xl font-bold lg:text-2xl">
                        {item.title}
                      </h3>
                      <p className="mt-1 text-sm font-medium text-zinc-300">
                        {item.org}
                      </p>
                      <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
