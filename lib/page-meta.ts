import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing, type Locale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo";

type PageKey =
  | "home"
  | "about"
  | "program"
  | "speakers"
  | "award"
  | "expo"
  | "youth"
  | "guestCountry"
  | "partners"
  | "sponsors"
  | "register"
  | "attendees"
  | "media"
  | "contact"
  | "privacy"
  | "consent"
  | "terms";

const pathByKey: Record<PageKey, string> = {
  home: "",
  about: "/about",
  program: "/program",
  speakers: "/speakers",
  award: "/award",
  expo: "/expo",
  youth: "/youth",
  guestCountry: "/guest-country",
  partners: "/partners",
  sponsors: "/sponsors",
  register: "/register",
  attendees: "/attendees",
  media: "/media",
  contact: "/contact",
  privacy: "/privacy",
  consent: "/consent",
  terms: "/terms",
};

const customDescriptionKeys = new Set<PageKey>([
  "home",
  "program",
  "register",
  "guestCountry",
  "award",
  "contact",
]);

export async function pageMetadata(
  localeParam: string,
  key: PageKey,
  image?: string,
): Promise<Metadata> {
  if (!hasLocale(routing.locales, localeParam)) return {};
  const locale = localeParam as Locale;
  const t = await getTranslations({ locale, namespace: "meta" });
  const title = t(`pages.${key}`);
  const description = customDescriptionKeys.has(key)
    ? t(`pageDescriptions.${key}`)
    : t("defaultDescription");

  return buildPageMetadata({
    locale,
    path: pathByKey[key],
    title,
    description,
    image,
  });
}
