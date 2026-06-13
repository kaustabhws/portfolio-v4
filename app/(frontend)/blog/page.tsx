import type { Metadata } from "next";
import CustomCursor from "@/components/CustomCursor";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import SectionLabel from "@/components/SectionLabel";
import BlogCard from "@/components/blog/BlogCard";
import { getSiteData } from "@/lib/data";
import { getPublishedPosts } from "@/lib/blog";

// Render per-request so newly published posts show up immediately.
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getSiteData();
  const name = profile.name || `${profile.firstName} ${profile.lastName}`;
  const title = "Writing";
  const description = `Build write-ups, engineering notes and tutorials by ${name} — ${profile.role}.`;

  return {
    title,
    description,
    alternates: { canonical: "/blog" },
    openGraph: {
      type: "website",
      url: "/blog",
      title: `${title} — ${name}`,
      description,
    },
    twitter: { card: "summary_large_image", title: `${title} — ${name}`, description },
  };
}

export default async function BlogIndex() {
  const [{ profile }, posts] = await Promise.all([
    getSiteData(),
    getPublishedPosts(),
  ]);

  return (
    <>
      <CustomCursor />
      <Navbar firstName={profile.firstName} location={profile.location} />
      <main className="mx-auto max-w-7xl px-6 pb-28 pt-36 lg:px-10 lg:pb-40 lg:pt-44">
        <div className="mb-14">
          <SectionLabel index="✶">Writing</SectionLabel>
          <Reveal>
            <h1 className="max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              How I build things, taken apart step by step.
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-400">
              Deep-dives into the projects I ship — the architecture, the dead
              ends, and the fixes that actually worked.
            </p>
          </Reveal>
        </div>

        {posts.length === 0 ? (
          <Reveal>
            <div className="glass rounded-3xl px-8 py-16 text-center">
              <p className="font-display text-2xl font-bold">No posts yet.</p>
              <p className="mt-3 text-zinc-400">
                The first write-up is on its way — check back soon.
              </p>
            </div>
          </Reveal>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <BlogCard key={post.id} post={post} delay={(i % 3) * 0.08} />
            ))}
          </div>
        )}
      </main>
      <Footer profile={profile} />
    </>
  );
}
