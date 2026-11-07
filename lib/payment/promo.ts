import { createHash, timingSafeEqual } from "crypto";

function digest(value: string) {
  return createHash("sha256").update(value).digest();
}

function sameSecret(left: string, right: string) {
  return timingSafeEqual(digest(left), digest(right));
}

/** Server-only allowlist. Empty means no complimentary code is accepted. */
export function promoAllowlist(): string[] {
  return (process.env.PROMO_CODES || "")
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0 && item.length <= 80);
}

export function acceptedPromo(code: string | undefined): string | null {
  const promo = code?.trim();
  if (!promo) return null;
  const match = promoAllowlist().find((item) => sameSecret(item, promo));
  return match ?? null;
}
