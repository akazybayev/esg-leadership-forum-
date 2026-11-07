/**
 * Delegate ticket prices. Change amounts and dates here only.
 * Early 250 USD through 31 Jul 2027, standard 300 USD through 30 Sep 2027,
 * late 350 USD from 1 Oct 2027.
 * TODO: confirm standard and late amounts with the client before invoicing.
 */
export const delegatePricing = {
  early: { amountUsd: 250, ends: "2027-07-31" },
  standard: { amountUsd: 300, ends: "2027-09-30" },
  late: { amountUsd: 350, starts: "2027-10-01" },
} as const;

export type DelegateTierId = keyof typeof delegatePricing;

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
  if (today <= delegatePricing.standard.ends) return "standard";
  return "late";
}

export function tierDeadline(tier: DelegateTierId): string {
  if (tier === "early") return delegatePricing.early.ends;
  if (tier === "standard") return delegatePricing.standard.ends;
  return "2027-10-13";
}
