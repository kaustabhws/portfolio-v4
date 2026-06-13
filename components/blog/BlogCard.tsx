import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import Reveal from "../Reveal";
import { type BlogPost, formatPostDate } from "@/lib/blog";

const accentColor: Record<string, string> = {
  cyan: "#00f0ff",
  magenta: "#ff003c",
  yellow: "#ffb800",
};

export default function BlogCard({ post, delay = 0 }: { post: BlogPost; delay?: number }) {
  return (
    <Reveal delay={delay} className="h-full">
      <Link
        href={`/blog/${post.slug}`}
        className="glass glass-hover group flex h-full flex-col overflow-hidden rounded-3xl"
        data-testid={`blog-card-${post.slug}`}
      >
        {/* cover */}
        <div className="relative h-52 w-full overflow-hidden">
          {post.coverImage ? (
            <Image
              src={post.coverImage}
              alt={post.coverAlt}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover opacity-75 transition-all duration-700 group-hover:scale-105 group-hover:opacity-100"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(120% 120% at 0% 0%, ${accentColor[post.accent]}22, transparent 60%), #0a0a0c`,
              }}
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />
          <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md transition-all duration-300 group-hover:bg-white group-hover:text-black">
            <ArrowUpRight weight="bold" />
          </div>
        </div>

        {/* body */}
        <div className="flex flex-1 flex-col p-6">
          <div className="mb-3 flex items-center gap-3 font-mono text-xs text-zinc-500">
            <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
            <span className="h-px w-5 bg-white/20" />
            <span>{post.readingTime} min read</span>
          </div>

          <h3 className="font-display text-xl font-bold leading-snug tracking-tight transition-colors group-hover:text-white">
            {post.title}
          </h3>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-400">
            {post.excerpt}
          </p>

          {post.tags.length > 0 && (
            <div className="mt-auto flex flex-wrap gap-2 pt-5">
              {post.tags.slice(0, 3).map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[0.7rem] text-zinc-400"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
      </Link>
    </Reveal>
  );
}
