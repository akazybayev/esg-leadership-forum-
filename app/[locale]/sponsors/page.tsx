import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { EmptyAnnounce } from "@/components/home/EmptyAnnounce";
import { getSponsors, tLocalized } from "@/lib/content";
import { formatForumDate } from "@/lib/dates";

export default async function SponsorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  const t = await getTranslations("sponsorsPage");
  const tStatus = await getTranslations("status");
  const tCta = await getTranslations("cta");
  const sponsors = getSponsors();

  return (
    <section className="container-shell py-12 md:py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
        {t("eyebrow")}
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-deep md:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-ink-soft">{t("intro")}</p>

      <div className="mt-10 space-y-8">
        {sponsors.levels.map((level) => (
          <div key={level.id}>
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-soft">
              {tLocalized(level.title, locale)}
            </h2>
            <div className="mt-3">
              {level.logos.length === 0 ? (
                <EmptyAnnounce
                  message={tStatus("comingSoon", {
                    date: formatForumDate(sponsors.announceDate, locale),
                  })}
                />
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <Link href="/partners" className="btn btn-primary mt-10 inline-flex">
        {tCta("becomePartner")}
      </Link>
    </section>
  );
}
