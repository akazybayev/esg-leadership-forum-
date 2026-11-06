import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getLegalContent, tLocalized } from "@/lib/content";
import { pageMetadata } from "@/lib/page-meta";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMetadata(locale, "consent");
}

export default async function ConsentPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);
  const legal = getLegalContent().consent;

  return (
    <section className="container-shell max-w-3xl py-12 md:py-16">
      <h1 className="text-4xl font-bold tracking-tight text-deep md:text-5xl">
        {tLocalized(legal.title, locale)}
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-ink-soft">
        {tLocalized(legal.body, locale)}
      </p>
    </section>
  );
}
