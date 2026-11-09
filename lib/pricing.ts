/**
 * Delegate ticket prices. Change amounts and dates here only.
 * 250 USD through 31 Jul 2027, 500 USD from 1 Aug 2027 (Asia/Almaty).
 */
export const delegatePricing = {
  early: { amountUsd: 250, ends: "2027-07-31" },
  late: { amountUsd: 500, starts: "2027-08-01" },
} as const;

export type DelegateTierId = keyof typeof delegatePricing;

/** 01.08.2027 00:00 in Astana. The clock until the price rises. */
export const priceRiseAt = `${delegatePricing.late.starts}T00:00:00+05:00`;

export const forumLineIds = [
  "Lead",
  "Finance",
  "Planet",
  "People",
  "Region",
] as const;

export type ForumLineId = (typeof forumLineIds)[number];

function almatyDate(now: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Almaty",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function resolveDelegateTier(now = new Date()): DelegateTierId {
  const today = almatyDate(now);
  if (today <= delegatePricing.early.ends) return "early";
  return "late";
}

export function tierDeadline(tier: DelegateTierId): string {
  if (tier === "early") return delegatePricing.early.ends;
  return "2027-10-13";
}
