export default function Marquee({ items }: { items: string[] }) {
  const loop = [...items, ...items];
  return (
    <div className="relative overflow-hidden border-y border-white/10 py-6">
      <div className="marquee-track">
        {loop.map((item, i) => (
          <span
            key={i}
            className="mx-6 inline-flex items-center gap-6 font-display text-3xl font-bold uppercase tracking-tight text-zinc-600 sm:text-4xl"
          >
            {item}
            <span className="text-cyan">✳</span>
          </span>
        ))}
      </div>
    </div>
  );
}
