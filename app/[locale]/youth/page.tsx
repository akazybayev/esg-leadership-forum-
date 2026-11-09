import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { DemoApplyForm } from "@/components/forms/DemoApplyForm";
import { getSiteConfig, getYouth, tLocalized } from "@/lib/content";
import { formatForumDate } from "@/lib/dates";
import { pageMetadata } from "@/lib/page-meta";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMetadata(locale, "youth");
}

export default async function YouthPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  const t = await getTranslations("youthPage");
  const tCta = await getTranslations("cta");
  const youth = getYouth();
  const site = getSiteConfig();

  return (
    <div>
      <section className="container-shell py-12 md:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight text-deep md:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-ink-soft">
          {tLocalized(youth.intro, locale)}
        </p>
      </section>

      <section className="border-y border-line bg-white/40 py-14">
        <div className="container-shell grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-deep">
              {tLocalized(youth.delegate.title, locale)}
            </h2>
            <p className="mt-3 text-ink-soft">
              {tLocalized(youth.delegate.text, locale)}
            </p>
            <ul className="mt-6 space-y-3">
              {youth.delegate.requirements.map((item) => (
                <li
                  key={tLocalized(item, locale)}
                  className="border-t border-line pt-3 text-ink"
                >
                  {tLocalized(item, locale)}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold text-deep">{t("delegateApply")}</h3>
            <DemoApplyForm
            formType="youth-delegate"
              id="youth-delegate"
              submitLabel={tCta("applyYouth")}
              successMessage={t("success")}
              fields={[
                { name: "name", label: t("fieldName"), required: true },
                {
                  name: "age",
                  label: t("fieldAge"),
                  type: "number",
                  required: true,
                },
                {
                  name: "org",
                  label: t("fieldOrg"),
                  required: true,
                },
                {
                  name: "email",
                  label: "Email",
                  type: "email",
                  required: true,
                },
                {
                  name: "motivation",
                  label: t("fieldMotivation"),
                  type: "textarea",
                  required: true,
                },
              ]}
            />
          </div>
        </div>
      </section>

      <section className="container-shell py-14">
        <h2 className="text-3xl font-bold text-deep md:text-4xl">
          {tLocalized(youth.pitch.title, locale)}
        </h2>
        <p className="mt-3 max-w-3xl text-lg text-ink-soft">
          {tLocalized(youth.pitch.text, locale)}
        </p>
        <p className="mt-3 text-sm font-medium text-deep">
          {formatForumDate(site.dates.youthPitchOpen, locale)} –{" "}
          {formatForumDate(site.dates.youthPitchClose, locale)}
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {youth.pitch.tracks.map((track) => (
            <div key={track.id} className="border border-line bg-paper p-5">
              <h3 className="text-lg font-bold text-deep">
                {tLocalized(track.title, locale)}
              </h3>
              <p className="mt-2 text-sm text-ink-soft">
                {tLocalized(track.examples, locale)}
              </p>
            </div>
          ))}
        </div>

        <h3 className="mt-12 text-2xl font-bold text-deep">{t("stages")}</h3>
        <ol className="mt-4 divide-y divide-line border-y border-line">
          {youth.pitch.stages.map((stage) => (
            <li
              key={stage.id}
              className="grid gap-2 py-4 md:grid-cols-[0.9fr_1.1fr]"
            >
              <p className="font-semibold text-accent">
                {tLocalized(stage.when, locale)}
              </p>
              <p className="text-ink">{tLocalized(stage.result, locale)}</p>
            </li>
          ))}
        </ol>

        <h3 className="mt-12 text-2xl font-bold text-deep">{t("criteria")}</h3>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {youth.pitch.criteria.map((item) => (
            <li key={item.score + tLocalized(item.title, locale)}>
              <span className="font-bold text-accent">{item.score}</span>
              <span className="ml-2 text-ink">
                {tLocalized(item.title, locale)}
              </span>
            </li>
          ))}
        </ul>

        <h3 className="mt-12 text-2xl font-bold text-deep">{t("prizes")}</h3>
        <ul className="mt-4 space-y-3">
          {youth.pitch.prizes.map((item) => (
            <li
              key={tLocalized(item, locale)}
              className="border-t border-line pt-3 text-ink-soft"
            >
              {tLocalized(item, locale)}
            </li>
          ))}
        </ul>
      </section>

      <section id="pitch-apply" className="border-t border-line bg-white/40 py-14">
        <div className="container-shell max-w-3xl">
          <h2 className="text-3xl font-bold text-deep">{t("pitchApply")}</h2>
          <DemoApplyForm
            formType="youth-pitch"
            id="youth-pitch"
            submitLabel={tCta("applyPitch")}
            successMessage={t("success")}
            fields={[
              {
                name: "team",
                label: t("fieldTeam"),
                required: true,
              },
              {
                name: "track",
                label: t("fieldTrack"),
                type: "select",
                required: true,
                options: youth.pitch.tracks.map((track) => ({
                  value: track.id,
                  label: tLocalized(track.title, locale),
                })),
              },
              {
                name: "members",
                label: t("fieldMembers"),
                required: true,
                placeholder: "1–4",
              },
              {
                name: "email",
                label: "Email",
                type: "email",
                required: true,
              },
              {
                name: "summary",
                label: t("fieldSummary"),
                type: "textarea",
                required: true,
              },
              {
                name: "video",
                label: t("fieldVideo"),
                type: "url",
              },
              {
                name: "file",
                label: t("fieldFile"),
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
