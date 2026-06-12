import { ImageResponse } from "next/og";
import { getSiteData } from "@/lib/data";

export const alt = "Portfolio — Software Developer & Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Re-rendered per request so the card always reflects current CMS copy.
export const dynamic = "force-dynamic";

export default async function OpengraphImage() {
  const { profile } = await getSiteData();
  const name = profile.name || `${profile.firstName} ${profile.lastName}`;
  const role = profile.role || "Software Developer";
  const tagline = profile.tagline || profile.blurb || "";

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
        {/* glow orbs — dark luxury accents */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -120,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,240,255,0.28), transparent 70%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -200,
            left: -140,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,0,60,0.22), transparent 70%)",
            display: "flex",
          }}
        />

        {/* top row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: "#00f0ff",
              display: "flex",
            }}
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
            {role}
          </div>
        </div>

        {/* name + tagline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              color: "#ffffff",
              fontSize: 120,
              fontWeight: 800,
              lineHeight: 1,
              letterSpacing: -2,
              display: "flex",
            }}
          >
            {name}
          </div>
          {tagline ? (
            <div
              style={{
                color: "#c7ccd1",
                fontSize: 36,
                maxWidth: 900,
                lineHeight: 1.3,
                display: "flex",
              }}
            >
              {tagline}
            </div>
          ) : null}
        </div>

        {/* bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ color: "#6b7177", fontSize: 26, display: "flex" }}>
            {profile.location}
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {["#00f0ff", "#ff003c", "#ffb800"].map((c) => (
              <div
                key={c}
                style={{
                  width: 56,
                  height: 8,
                  borderRadius: 999,
                  background: c,
                  display: "flex",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
