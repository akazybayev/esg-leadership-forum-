import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { DemoApplyForm } from "@/components/forms/DemoApplyForm";
import { EmptyAnnounce } from "@/components/home/EmptyAnnounce";
import { getMediaContent, tLocalized } from "@/lib/content";
import { formatForumDate } from "@/lib/dates";

export default async function MediaPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  const t = await getTranslations("mediaPage");
  const tStatus = await getTranslations("status");
  const content = getMediaContent();

  return (
    <div>
      <section className="container-shell py-12 md:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-deep md:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-ink-soft">
          {tLocalized(content.intro, locale)}
        </p>
      </section>

      <section className="border-y border-line bg-white/40 py-14">
        <div className="container-shell grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-deep">{t("news")}</h2>
            <div className="mt-4">
              <EmptyAnnounce
                message={tStatus("comingSoon", {
                  date: formatForumDate(content.newsAnnounceDate, locale),
                })}
              />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-deep">{t("press")}</h2>
            <div className="mt-4">
              <EmptyAnnounce message={t("pressSoon")} />
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-14">
        <h2 className="text-3xl font-bold text-deep">{t("brand")}</h2>
        <p className="mt-3 max-w-2xl text-ink-soft">{t("brandText")}</p>
        {content.brandKitAvailable ? (
          <a href={content.brandKitUrl} className="btn btn-deep mt-6 inline-flex">
            {t("downloadBrand")}
          </a>
        ) : (
          <p className="mt-4 text-sm font-medium text-accent">{t("brandMissing")}</p>
        )}
      </section>

      <section id="accreditation" className="border-t border-line bg-white/40 py-14">
        <div className="container-shell max-w-3xl">
          <h2 className="text-3xl font-bold text-deep">{t("accreditation")}</h2>
          <p className="mt-3 text-ink-soft">
            {tLocalized(content.accreditationNote, locale)}
          </p>
          <DemoApplyForm
            formType="media"
            id="media-accreditation"
            submitLabel={t("submit")}
            successMessage={t("success")}
            fields={[
              { name: "outlet", label: t("fieldOutlet"), required: true },
              { name: "name", label: t("fieldName"), required: true },
              {
                name: "email",
                label: "Email",
                type: "email",
                required: true,
              },
              {
                name: "role",
                label: t("fieldRole"),
                required: true,
              },
              {
                name: "note",
                label: t("fieldNote"),
                type: "textarea",
              },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
