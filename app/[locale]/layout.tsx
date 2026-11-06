import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { Manrope } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileRegisterBar } from "@/components/layout/MobileRegisterBar";
import { getNavigation, getSiteConfig, tLocalized } from "@/lib/content";
import { routing, type Locale } from "@/i18n/routing";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
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

  return (
    <html lang={locale} className={manrope.variable}>
      <body className="pb-20 font-sans antialiased md:pb-0">
        <NextIntlClientProvider messages={messages}>
          <Header
            siteName={tLocalized(site.name, locale)}
            items={navigation.primary}
          />
          <main>{children}</main>
          <Footer site={site} locale={locale} />
          <MobileRegisterBar />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
