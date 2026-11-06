import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { SpeakersExplorer } from "@/components/speakers/SpeakersExplorer";
import { getSpeakers } from "@/lib/content";
import { formatForumDate } from "@/lib/dates";

export default async function SpeakersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  const t = await getTranslations("nav");
  const tSpeakers = await getTranslations("speakers");
  const speakers = getSpeakers();

  return (
    <section className="container-shell py-12 md:py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
        ESG Leadership Forum
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight text-deep md:text-5xl">
        {t("speakers")}
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-soft">
        {tSpeakers("intro")}
      </p>
      <SpeakersExplorer
        speakers={speakers.items}
        announceDateLabel={formatForumDate(speakers.announceDate, locale)}
      />
    </section>
  );
}
