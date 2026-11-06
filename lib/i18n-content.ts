import type { Locale } from "@/i18n/routing";
import type { LocalizedString } from "@/schemas/content";

export function tLocalized(value: LocalizedString, locale: Locale): string {
  return value[locale] || value.ru;
}
