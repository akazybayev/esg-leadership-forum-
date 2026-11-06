import type { Metadata } from "next";
import { getSiteConfig, tLocalized } from "@/lib/content";
import { routing, type Locale } from "@/i18n/routing";

export const SITE_PATHS = [
  "",
  "/about",
  "/program",
  "/speakers",
  "/award",
  "/expo",
  "/youth",
  "/guest-country",
  "/partners",
  "/sponsors",
  "/register",
  "/attendees",
  "/media",
  "/contact",
  "/privacy",
  "/consent",
  "/terms",
] as const;

export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}

export function localePath(locale: Locale, path = ""): string {
  const normalized = path === "/" ? "" : path;
  return `/${locale}${normalized}`;
}

export function absoluteUrl(locale: Locale, path = ""): string {
  return `${getSiteUrl()}${localePath(locale, path)}`;
}

export function hreflangAlternates(path = "") {
  const languages: Record<string, string> = {};
  for (const locale of routing.locales) {
    languages[locale] = absoluteUrl(locale, path);
  }
  languages["x-default"] = absoluteUrl(routing.defaultLocale, path);
  return {
    canonical: absoluteUrl(routing.defaultLocale, path),
    languages,
  };
}

export function buildPageMetadata({
  locale,
  path = "",
  title,
  description,
  image,
}: {
  locale: Locale;
  path?: string;
  title: string;
  description: string;
  image?: string;
}): Metadata {
  const site = getSiteConfig();
  const siteName = tLocalized(site.name, locale);
  const ogImage = image
    ? image.startsWith("http")
      ? image
      : `${getSiteUrl()}${image}`
    : `${getSiteUrl()}/images/venue/main-hall.png`;

  return {
    title,
    description,
    alternates: hreflangAlternates(path),
    openGraph: {
      type: "website",
      locale,
      url: absoluteUrl(locale, path),
      siteName,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function buildEventJsonLd(locale: Locale) {
  const site = getSiteConfig();
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: tLocalized(site.name, locale),
    description: tLocalized(site.slogan, locale),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    startDate: `${site.dates.day1}T09:00:00+05:00`,
    endDate: `${site.dates.day2}T22:00:00+05:00`,
    eventSchedule: {
      "@type": "Schedule",
      startDate: site.dates.day1,
      endDate: site.dates.day2,
      scheduleTimezone: site.timezone,
    },
    location: {
      "@type": "Place",
      name: site.venue.name,
      address: {
        "@type": "PostalAddress",
        addressLocality: tLocalized(site.venue.city, locale),
        addressCountry: tLocalized(site.venue.country, locale),
        streetAddress: tLocalized(site.venue.complex, locale),
      },
    },
    organizer: {
      "@type": "Organization",
      name: site.organizer.name,
      url: site.organizer.url,
      email: site.contact.email,
      telephone: site.contact.phone,
    },
    offers: [
      {
        "@type": "Offer",
        name: "Guest",
        price: String(site.pricing.guestUsd),
        priceCurrency: "USD",
        url: absoluteUrl(locale, "/register"),
        availability: "https://schema.org/InStock",
        validFrom: new Date().toISOString().slice(0, 10),
      },
      {
        "@type": "Offer",
        name: "Delegate early-bird",
        price: String(site.pricing.delegateEarlyUsd),
        priceCurrency: "USD",
        url: absoluteUrl(locale, "/register"),
        availability: "https://schema.org/InStock",
        validThrough: site.dates.earlyBirdEnds,
      },
      {
        "@type": "Offer",
        name: "Delegate standard",
        price: String(site.pricing.delegateStandardUsd),
        priceCurrency: "USD",
        url: absoluteUrl(locale, "/register"),
        availability: "https://schema.org/InStock",
        validFrom: site.dates.earlyBirdEnds,
      },
    ],
    image: [`${getSiteUrl()}/images/venue/main-hall.png`],
    url: absoluteUrl(locale),
    inLanguage: [locale],
  };
}
