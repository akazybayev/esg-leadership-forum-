import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getAward, getProgram, getSiteConfig, tLocalized } from "@/lib/content";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  const t = await getTranslations("cta");
  const site = getSiteConfig();
  const program = getProgram();
  const award = getAward();

  return (
    <div>
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_420px_at_85%_10%,rgba(196,92,38,0.16),transparent_55%),linear-gradient(120deg,rgba(11,31,42,0.04),transparent_45%)]" />
        <div className="container-shell relative grid gap-10 py-16 md:grid-cols-[1.1fr_0.9fr] md:items-end md:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              13–14.10.2027 · {site.venue.name}
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.05] tracking-tight text-deep md:text-6xl">
              {tLocalized(site.name, locale)}
            </h1>
            <p className="mt-4 text-2xl font-medium text-ink-soft md:text-3xl">
              {tLocalized(site.slogan, locale)}
            </p>
            <p className="mt-5 max-w-xl text-base text-ink-soft md:text-lg">
              {tLocalized(site.venue.complex, locale)},{" "}
              {tLocalized(site.venue.city, locale)},{" "}
              {tLocalized(site.venue.country, locale)}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register" className="btn btn-primary">
                {t("register")}
              </Link>
              <Link href="/partners" className="btn btn-secondary">
                {t("becomePartner")}
              </Link>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-line bg-white/70 p-6 shadow-[var(--shadow-soft)]">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-soft">
              Stage 1 scaffold
            </p>
            <ul className="mt-4 space-y-3 text-sm text-ink">
              <li>i18n: ru / en / kk · default ru</li>
              <li>Palette A · Horizon Deep</li>
              <li>Program sessions loaded: {program.sessions.length}</li>
              <li>Award nominations loaded: {award.nominations.length}</li>
              <li>Forum stage: {site.stage}</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/program" className="btn btn-deep">
                {t("viewProgram")}
              </Link>
              <Link href="/award" className="btn btn-secondary">
                ESG Award
              </Link>
            </div>
          </div>
        </div>
        <div className="ornament-line h-px w-full" />
      </section>
    </div>
  );
}
