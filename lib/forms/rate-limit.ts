const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 30;

let windowStart = 0;
let accepted = 0;

/**
 * One fixed window for the whole process. There is no per-address map, so
 * the number of stored counters cannot grow with traffic or with forged
 * client addresses, and a single instance cannot be asked to remember them.
 */
export function checkRateLimit(): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  if (windowStart === 0 || now - windowStart >= WINDOW_MS) {
    windowStart = now;
    accepted = 0;
  }

  if (accepted >= MAX_PER_WINDOW) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((windowStart + WINDOW_MS - now) / 1000)),
    };
  }

  accepted += 1;
  return { ok: true };
}
