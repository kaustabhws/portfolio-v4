import { NextResponse } from "next/server";
import { seedBlog } from "@/lib/seed-blog-core";

// Windows-friendly seeding entry point (the Payload CLI breaks on Windows).
//   GET /seed-blog?secret=YOUR_PAYLOAD_SECRET
export const dynamic = "force-dynamic";
export const maxDuration = 120;

export async function GET(req: Request) {
  const secret = new URL(req.url).searchParams.get("secret");
  if (!process.env.PAYLOAD_SECRET || secret !== process.env.PAYLOAD_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const log = await seedBlog();
    return NextResponse.json({ ok: true, log });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}
