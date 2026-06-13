import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PostBody from "@/components/blog/PostBody";
import ArticleJsonLd from "@/components/blog/ArticleJsonLd";
import { getSiteData } from "@/lib/data";
import { getPostBySlug, formatPostDate } from "@/lib/blog";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found", robots: { index: false, follow: false } };

  const { profile } = await getSiteData();
  const name = profile.name || `${profile.firstName} ${profile.lastName}`;
  const title = post.seo.title || post.title;
  const description = post.seo.description || post.excerpt;
  const url = `/blog/${post.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      publishedTime: post.publishedAt || undefined,
      authors: [name],
      tags: post.tags,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function PostPage({ params }: Params) {
  const { slug } = await params;
  const [post, { profile }] = await Promise.all([
    getPostBySlug(slug),
    getSiteData(),
  ]);
  if (!post) notFound();

  const name = profile.name || `${profile.firstName} ${profile.lastName}`;

  return (
    <>
      <ArticleJsonLd post={post} authorName={name} />
      <CustomCursor />
      <Navbar firstName={profile.firstName} location={profile.location} />

      <main className="px-6 pb-28 pt-36 lg:pb-40 lg:pt-44">
        <article className="mx-auto max-w-3xl">
          <Link
            href="/blog"
            className="mb-10 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-zinc-500 transition-colors hover:text-white"
          >
            <ArrowLeft weight="bold" /> All writing
          </Link>

          {/* meta */}
          <div className="flex items-center gap-3 font-mono text-xs text-zinc-500">
            <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
            <span className="h-px w-5 bg-white/20" />
            <span>{post.readingTime} min read</span>
          </div>

          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
            {post.title}
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-zinc-400">{post.excerpt}</p>

          {post.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs text-zinc-400"
                >
                  {t}
                </span>
              ))}
            </div>
          )}

          {post.coverImage && (
            <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-3xl border border-white/10">
              <Image
                src={post.coverImage}
                alt={post.coverAlt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          )}

          <div className="mt-12">
            <PostBody content={post.content} />
          </div>

          <div className="mt-16 border-t border-white/10 pt-10">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold transition-colors hover:bg-white/10"
            >
              <ArrowLeft weight="bold" /> Back to all writing
            </Link>
          </div>
        </article>
      </main>

      <Footer profile={profile} />
    </>
  );
}
