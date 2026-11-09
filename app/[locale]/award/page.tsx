import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { DemoApplyForm } from "@/components/forms/DemoApplyForm";
import { EmptyAnnounce } from "@/components/home/EmptyAnnounce";
import { getAward, getSiteConfig, tLocalized } from "@/lib/content";
import { formatForumDate } from "@/lib/dates";
import { pageMetadata } from "@/lib/page-meta";

const blocks = [
  "Environment",
  "Social",
  "Governance",
  "Next Generation",
] as const;


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMetadata(locale, "award");
}

export default async function AwardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  const t = await getTranslations("awardPage");
  const tCta = await getTranslations("cta");
  const tStatus = await getTranslations("status");
  const award = getAward();
  const site = getSiteConfig();

  return (
    <div>
      <section className="container-shell grid gap-10 py-12 md:grid-cols-[1fr_0.9fr] md:items-center md:py-16">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
            ESG Award 2027
          </p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-deep md:text-5xl">
            {tLocalized(award.statueCaption, locale)}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">
            {tLocalized(award.intro, locale)}
          </p>
          <p className="mt-4 text-sm font-medium text-deep">
            {formatForumDate(site.dates.awardOpen, locale)} —{" "}
            {formatForumDate(site.dates.awardClose, locale)}
          </p>
          <a href="#apply" className="btn btn-primary mt-6 inline-flex">
            {tCta("applyAward")}
          </a>
        </div>
        <div className="relative aspect-[5/6] overflow-hidden bg-paper-2">
          <Image
            src={award.statueImage}
            alt={tLocalized(award.statueCaption, locale)}
            fill
            data-zoom=""
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, 40vw"
            priority
          />
        </div>
      </section>

      <section className="border-y border-line bg-white/40 py-14">
        <div className="container-shell">
          <h2 className="text-3xl font-bold text-deep">{t("principles")}</h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {award.principles.map((item) => (
              <li
                key={tLocalized(item, locale)}
                className="border-t border-line pt-4 text-ink"
              >
                {tLocalized(item, locale)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-shell py-14">
        <h2 className="text-3xl font-bold text-deep md:text-4xl">
          {t("nominations")}
        </h2>
        <p className="mt-3 max-w-2xl text-ink-soft">
          {tLocalized(award.grandPrix, locale)} —{" "}
          {tLocalized(award.grandPrixNote, locale)}
        </p>
        <div className="mt-10 space-y-10">
          {blocks.map((block) => {
            const items = award.nominations.filter((n) => n.block === block);
            return (
              <div key={block}>
                <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">
                  {block}
                </h3>
                <ul className="mt-4 divide-y divide-line border-y border-line">
                  {items.map((item) => (
                    <li
                      key={item.id}
                      className="grid gap-2 py-4 md:grid-cols-[1.1fr_0.9fr_1fr]"
                    >
                      <p className="font-bold text-deep">
                        {tLocalized(item.title, locale)}
                      </p>
                      <p className="text-sm text-ink-soft">
                        {tLocalized(item.eligible, locale)}
                      </p>
                      <p className="text-sm text-ink">
                        {tLocalized(item.evaluates, locale)}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      <section className="border-y border-line bg-deep py-14 text-white">
        <div className="container-shell grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">{t("timeline")}</h2>
            <ol className="mt-6 space-y-4">
              {award.timeline.map((item) => (
                <li key={item.id} className="border-t border-white/15 pt-4">
                  <p className="text-sm font-semibold text-[#e2b79a]">
                    {item.date}
                  </p>
                  <p className="mt-1">{tLocalized(item.label, locale)}</p>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="text-3xl font-bold">{t("criteria")}</h2>
            <ul className="mt-6 space-y-4">
              {award.criteria.map((item) => (
                <li key={item.score + tLocalized(item.title, locale)}>
                  <p className="font-bold text-[#e2b79a]">
                    {item.score} · {tLocalized(item.title, locale)}
                  </p>
                  <p className="mt-1 text-white/75">
                    {tLocalized(item.text, locale)}
                  </p>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-white/70">
              {tLocalized(award.scoringNote, locale)}
            </p>
          </div>
        </div>
      </section>

      <section className="container-shell py-14">
        <h2 className="text-3xl font-bold text-deep">{t("jury")}</h2>
        <div className="mt-6">
          <EmptyAnnounce
            message={tStatus("comingSoon", {
              date: formatForumDate(award.juryAnnounceDate, locale),
            })}
          />
        </div>
      </section>

      <section id="apply" className="border-t border-line bg-white/40 py-14">
        <div className="container-shell max-w-3xl">
          <h2 className="text-3xl font-bold text-deep">{t("applyTitle")}</h2>
          <p className="mt-3 text-ink-soft">{t("applyText")}</p>
          <DemoApplyForm
            formType="award"
            id="award-apply"
            submitLabel={tCta("applyAward")}
            successMessage={t("applySuccess")}
            fields={[
              {
                name: "organization",
                label: t("fieldOrg"),
                required: true,
              },
              {
                name: "nomination",
                label: t("fieldNomination"),
                type: "select",
                required: true,
                options: award.nominations.map((n) => ({
                  value: n.id,
                  label: `${n.block}: ${tLocalized(n.title, locale)}`,
                })),
              },
              {
                name: "project",
                label: t("fieldProject"),
                type: "textarea",
                required: true,
                placeholder: t("fieldProjectHint"),
              },
              {
                name: "metrics",
                label: t("fieldMetrics"),
                type: "textarea",
                required: true,
              },
              {
                name: "contactName",
                label: t("fieldContact"),
                required: true,
              },
              {
                name: "email",
                label: "Email",
                type: "email",
                required: true,
              },
              {
                name: "disclosure",
                label: t("fieldDisclosure"),
                type: "textarea",
              },
              {
                name: "documents",
                label: t("fieldDocs"),
                type: "url",
                placeholder: "https://…",
              },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
