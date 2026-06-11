import Reveal from "./Reveal";

export default function SectionLabel({
  index,
  children,
}: {
  index: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal>
      <div className="mb-8 flex items-center gap-4">
        <span className="label !text-cyan">{index}</span>
        <span className="h-px w-10 bg-white/20" />
        <span className="label">{children}</span>
      </div>
    </Reveal>
  );
}
