const WINDOW_MS = 60 * 60 * 1000;
const DEFAULT_PER_HOUR = 30;
const MAX_TRACKED_CLIENTS = 2_000;

type Bucket = { start: number; count: number };

const buckets = new Map<string, Bucket>();

function limitPerHour() {
  const raw = Number(process.env.FORM_RATE_LIMIT_PER_HOUR);
  if (Number.isFinite(raw) && raw >= 1 && raw <= 1_000) return Math.floor(raw);
  return DEFAULT_PER_HOUR;
}

function prune(now: number) {
  for (const [key, bucket] of buckets) {
    if (now - bucket.start >= WINDOW_MS) buckets.delete(key);
  }
}

function dropOldest() {
  let oldestKey = "";
  let oldestStart = Number.POSITIVE_INFINITY;
  for (const [key, bucket] of buckets) {
    if (bucket.start < oldestStart) {
      oldestStart = bucket.start;
      oldestKey = key;
    }
  }
  if (oldestKey) buckets.delete(oldestKey);
}

export function clientAddress(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const hop = forwarded?.split(",")[0]?.trim();
  const raw = hop || request.headers.get("x-real-ip")?.trim() || "unknown";
  return raw.slice(0, 64);
}

export function checkRateLimit(
  clientKey: string,
  now = Date.now(),
): { ok: true } | { ok: false; retryAfterSec: number } {
  const key = clientKey.trim().slice(0, 64) || "unknown";
  prune(now);

  let bucket = buckets.get(key);
  if (!bucket || now - bucket.start >= WINDOW_MS) {
    while (buckets.size >= MAX_TRACKED_CLIENTS) dropOldest();
    bucket = { start: now, count: 0 };
    buckets.set(key, bucket);
  }

  if (bucket.count >= limitPerHour()) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((bucket.start + WINDOW_MS - now) / 1000)),
    };
  }

  bucket.count += 1;
  return { ok: true };
}

export function resetRateLimit() {
  buckets.clear();
}
