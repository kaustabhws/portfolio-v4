import "server-only";

type Result = { ok: boolean; retryAfter: number; remaining: number };

// In-memory sliding-window store. Note: per server instance — on serverless
// (e.g. Vercel) each instance has its own window, which is fine as a basic
// abuse guard. For strict global limits, back this with Redis/Upstash.
const hits = new Map<string, number[]>();
let lastSweep = 0;

/**
 * Sliding-window rate limit.
 * @returns ok=false with retryAfter (seconds) when the limit is exceeded.
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Result {
  const now = Date.now();

  // Occasionally sweep stale keys so the map doesn't grow unbounded.
  if (now - lastSweep > windowMs) {
    for (const [k, arr] of hits) {
      const fresh = arr.filter((t) => now - t < windowMs);
      if (fresh.length === 0) hits.delete(k);
      else hits.set(k, fresh);
    }
    lastSweep = now;
  }

  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    const retryAfter = Math.ceil((windowMs - (now - recent[0])) / 1000);
    hits.set(key, recent);
    return { ok: false, retryAfter, remaining: 0 };
  }

  recent.push(now);
  hits.set(key, recent);
  return { ok: true, retryAfter: 0, remaining: limit - recent.length };
}
