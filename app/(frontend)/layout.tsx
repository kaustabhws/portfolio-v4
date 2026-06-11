import type { Metadata } from "next";
import { Bricolage_Grotesque, Manrope, JetBrains_Mono } from "next/font/google";
import { getSiteData } from "@/lib/data";
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

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getSiteData();
  const name = profile.name || `${profile.firstName} ${profile.lastName}`;

  return {
    title: `${name} — ${profile.role}`,
    description: profile.blurb,
    keywords: [profile.role, "portfolio", "developer", profile.location],
    openGraph: {
      title: `${name} — ${profile.role}`,
      description: profile.tagline,
      type: "website",
    },
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
