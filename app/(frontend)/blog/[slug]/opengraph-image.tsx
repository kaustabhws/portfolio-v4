import { ImageResponse } from "next/og";
import { getSiteData } from "@/lib/data";
import { getPostBySlug, formatPostDate } from "@/lib/blog";

export const alt = "Blog post";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";

const accentColor: Record<string, string> = {
  cyan: "#00f0ff",
  magenta: "#ff003c",
  yellow: "#ffb800",
};

export default async function PostOgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [post, { profile }] = await Promise.all([
    getPostBySlug(slug),
    getSiteData(),
  ]);

  const name = profile.name || `${profile.firstName} ${profile.lastName}`;
  const title = post?.title || "Writing";
  const accent = accentColor[post?.accent || "cyan"];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#030303",
          padding: "80px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${accent}44, transparent 70%)`,
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{ width: 14, height: 14, borderRadius: "50%", background: accent, display: "flex" }}
          />
          <div
            style={{
              color: "#9aa0a6",
              fontSize: 26,
              letterSpacing: 6,
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            Writing
          </div>
        </div>

        <div
          style={{
            color: "#ffffff",
            fontSize: title.length > 60 ? 64 : 84,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: -2,
            display: "flex",
            maxWidth: 1040,
          }}
        >
          {title}
        </div>

        <div
          style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
        >
          <div style={{ color: "#c7ccd1", fontSize: 28, display: "flex" }}>{name}</div>
          {post?.publishedAt ? (
            <div style={{ color: "#6b7177", fontSize: 24, display: "flex" }}>
              {formatPostDate(post.publishedAt)}
            </div>
          ) : null}
        </div>
      </div>
    ),
    { ...size },
  );
}
