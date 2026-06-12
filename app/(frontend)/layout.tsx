import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Manrope, JetBrains_Mono } from "next/font/google";
import { getSiteData } from "@/lib/data";
import { SITE_URL, buildKeywords } from "@/lib/seo";
import "../globals.css";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const sans = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const viewport: Viewport = {
  themeColor: "#030303",
  colorScheme: "dark",
};

export async function generateMetadata(): Promise<Metadata> {
  const { profile, skills } = await getSiteData();
  const name = profile.name || `${profile.firstName} ${profile.lastName}`;
  const title = `${name} — ${profile.role}`;
  const description = profile.blurb;
  const topSkills = skills.flatMap((g) => g.items.map((i) => i.name)).slice(0, 8);

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: title,
      template: `%s — ${name}`,
    },
    description,
    applicationName: `${name} — Portfolio`,
    authors: [{ name }],
    creator: name,
    publisher: name,
    keywords: buildKeywords(
      name,
      profile.role,
      `${name} ${profile.role}`,
      `${name} portfolio`,
      profile.location,
      ...topSkills,
    ),
    category: "technology",
    alternates: { canonical: "/" },
    openGraph: {
      type: "profile",
      url: SITE_URL,
      siteName: `${name} — Portfolio`,
      title,
      description: profile.tagline || description,
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: profile.tagline || description,
      creator: profile.socials.find((s) => /twitter|x/i.test(s.label))?.handle,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
        { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
        { url: "/android-chrome-192x192.png", type: "image/png", sizes: "192x192" },
        { url: "/android-chrome-512x512.png", type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    },
    manifest: "/manifest.webmanifest",
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="noise min-h-screen bg-bg text-ink">{children}</body>
    </html>
  );
}
