import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { Manrope, Unbounded } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileRegisterBar } from "@/components/layout/MobileRegisterBar";
import { SkipLink } from "@/components/layout/SkipLink";
import { JsonLd } from "@/components/seo/JsonLd";
import { getNavigation, getSiteConfig, tLocalized } from "@/lib/content";
import {
  absoluteUrl,
  buildEventJsonLd,
  getSiteUrl,
  hreflangAlternates,
} from "@/lib/seo";
import { routing, type Locale } from "@/i18n/routing";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "500", "700", "900"],
  variable: "--font-unbounded",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) return {};
  const locale = localeParam as Locale;
  const t = await getTranslations({ locale, namespace: "meta" });
  const site = getSiteConfig();
  const siteName = tLocalized(site.name, locale);
  const description = t("defaultDescription");
  const ogImage = `${getSiteUrl()}/images/venue/main-hall.png`;

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: siteName,
      template: `%s · ${siteName}`,
    },
    description,
    applicationName: t("siteName"),
    alternates: hreflangAlternates(""),
    openGraph: {
      type: "website",
      locale,
      url: absoluteUrl(locale),
      siteName,
      title: siteName,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title: siteName,
      description,
      images: [ogImage],
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  if (!hasLocale(routing.locales, localeParam)) {
    notFound();
  }

  const locale = localeParam as Locale;
  setRequestLocale(locale);

  const messages = await getMessages();
  const site = getSiteConfig();
  const navigation = getNavigation();
  const tA11y = await getTranslations("a11y");

  return (
    <html lang={locale} className={`${manrope.variable} ${unbounded.variable}`}>
      <body className="pb-[calc(5.75rem+env(safe-area-inset-bottom))] font-sans antialiased md:pb-0">
        <NextIntlClientProvider messages={messages}>
          <SkipLink />
          <Header
            siteName={tLocalized(site.name, locale)}
            items={navigation.primary}
          />
          <main id="main-content" tabIndex={-1}>
            {children}
          </main>
          <Footer site={site} locale={locale} />
          <MobileRegisterBar label={tA11y("mobileRegister")} />
          <JsonLd data={buildEventJsonLd(locale)} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
