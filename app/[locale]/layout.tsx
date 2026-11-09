import type { Metadata } from "next";
import Script from "next/script";
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
import { getHomeContent, getNavigation, getSiteConfig, tLocalized } from "@/lib/content";
import {
  absoluteUrl,
  buildEventJsonLd,
  FORUM_TITLE,
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
  const description = tLocalized(getHomeContent().hero.supporting, locale);
  const ogImage = `${getSiteUrl()}/images/venue/main-hall.png`;

  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: FORUM_TITLE,
      template: "%s",
    },
    description,
    applicationName: t("siteName"),
    alternates: hreflangAlternates(""),
    openGraph: {
      type: "website",
      locale,
      url: absoluteUrl(locale),
      siteName,
      title: FORUM_TITLE,
      description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title: FORUM_TITLE,
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
      <body className="font-sans antialiased">
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
          <dialog className="zoom-dialog" data-zoom-dialog="">
            <div className="zoom-dialog-bar">
              <button type="button" data-zoom-close="">
                {locale === "en" ? "Close" : locale === "kk" ? "Жабу" : "Закрыть"}
              </button>
            </div>
          </dialog>
          <Script src="/scripts/zoom.js" strategy="afterInteractive" />
          <JsonLd data={buildEventJsonLd(locale)} />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
