import { NextResponse } from "next/server";
import { getSiteData } from "@/lib/data";
import { isEmailConfigured, sendContactEmails } from "@/lib/mailer";
import { rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const clamp = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : "";

// Max 3 messages per 10 minutes per IP.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 30 * 60 * 1000;

function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "local";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot — bots fill hidden fields. Pretend success and drop silently.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = clamp(body.name, 120);
  const email = clamp(body.email, 160);
  const subject = clamp(body.subject, 160);
  const message = clamp(body.message, 5000);

  if (!name || !email || !message) {
    return NextResponse.json(
      { ok: false, error: "Please fill in your name, email and message." },
      { status: 400 },
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  if (!isEmailConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Email isn't set up yet. Please reach out directly." },
      { status: 503 },
    );
  }

  // Rate limit actual send attempts (validation errors don't burn the quota).
  const limit = rateLimit(clientIp(request), RATE_LIMIT, RATE_WINDOW_MS);
  if (!limit.ok) {
    const mins = Math.ceil(limit.retryAfter / 60);
    return NextResponse.json(
      {
        ok: false,
        error: `Too many messages. Please try again in ${mins} minute${mins === 1 ? "" : "s"}.`,
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  try {
    const { profile } = await getSiteData();
    await sendContactEmails({
      name,
      email,
      subject,
      message,
      ownerName: profile.name || profile.firstName,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] send failed:", err);
    return NextResponse.json(
      {
        ok: false,
        error: "Couldn't send your message right now. Please try again shortly.",
      },
      { status: 500 },
    );
  }
}
