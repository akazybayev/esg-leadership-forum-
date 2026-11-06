import type { Locale } from "@/i18n/routing";

const localeMap: Record<Locale, string> = {
  ru: "ru-RU",
  en: "en-GB",
  kk: "kk-KZ",
};

export function formatForumDate(
  isoDate: string,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
  },
): string {
  return new Intl.DateTimeFormat(localeMap[locale], {
    timeZone: "Asia/Almaty",
    ...options,
  }).format(new Date(`${isoDate}T12:00:00+05:00`));
}

export function daysUntil(isoDate: string, now = new Date()): number {
  const target = new Date(`${isoDate}T23:59:59+05:00`).getTime();
  const diff = target - now.getTime();
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}
