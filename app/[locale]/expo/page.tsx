import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { DemoApplyForm } from "@/components/forms/DemoApplyForm";
import { getExpo, tLocalized } from "@/lib/content";

export default async function ExpoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  const t = await getTranslations("expoPage");
  const expo = getExpo();

  return (
    <div>
      <section className="container-shell py-12 md:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
          ESG Expo
        </p>
        <h1 className="mt-3 max-w-4xl text-4xl font-bold tracking-tight text-deep md:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-ink-soft">
          {tLocalized(expo.intro, locale)}
        </p>
      </section>

      <section className="border-y border-line bg-white/40 py-14">
        <div className="container-shell">
          <h2 className="text-3xl font-bold text-deep">{t("plan")}</h2>
          <p className="mt-3 max-w-3xl text-ink-soft">{t("planNote")}</p>

          <div className="mt-8 overflow-hidden border border-line bg-white">
            <div className="relative aspect-[16/10] w-full bg-paper-2">
              <Image
                src={expo.labeledPlanImage.src}
                alt={tLocalized(expo.labeledPlanImage.alt, locale)}
                fill
                className="object-contain object-top p-2 md:p-4"
                sizes="100vw"
                priority
              />
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
            <div className="overflow-hidden border border-line bg-white">
              <div className="relative aspect-square w-full">
                <Image
                  src={expo.planImage.src}
                  alt={tLocalized(expo.planImage.alt, locale)}
                  fill
                  className="object-contain p-3"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold text-deep">{t("legend")}</h3>
              <ol className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                {expo.legend.map((zone) => (
                  <li
                    key={zone.n}
                    className="flex items-start gap-3 border-t border-line py-3 first:border-t-0 first:pt-0"
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center text-sm font-bold text-white ${
                        zone.n === 6 ? "bg-accent" : "bg-deep"
                      }`}
                    >
                      {zone.n}
                    </span>
                    <span className="pt-1 font-medium text-ink">
                      {tLocalized(zone.title, locale)}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell py-14">
        <h2 className="text-3xl font-bold text-deep">{t("zones")}</h2>
        <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {expo.zones.map((zone) => (
            <li key={zone.id} className="border-t-4 border-accent bg-white/70 p-5">
              <h3 className="text-xl font-bold text-deep">
                {tLocalized(zone.title, locale)}
              </h3>
              <p className="mt-2 text-ink-soft">{tLocalized(zone.text, locale)}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-line bg-white/40 py-14">
        <div className="container-shell">
          <h2 className="text-3xl font-bold text-deep">{t("conditions")}</h2>
          <ul className="mt-6 max-w-3xl space-y-3">
            {expo.conditions.map((item) => (
              <li
                key={tLocalized(item, locale)}
                className="border-t border-line pt-3 text-ink-soft"
              >
                {tLocalized(item, locale)}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="apply" className="container-shell max-w-3xl py-14">
        <h2 className="text-3xl font-bold text-deep">{t("applyTitle")}</h2>
        <p className="mt-3 text-ink-soft">{t("applyText")}</p>
        <DemoApplyForm
            formType="expo"
          id="expo-apply"
          submitLabel={t("submit")}
          successMessage={t("success")}
          fields={[
            { name: "company", label: t("fieldCompany"), required: true },
            { name: "contact", label: t("fieldContact"), required: true },
            {
              name: "email",
              label: "Email",
              type: "email",
              required: true,
            },
            {
              name: "zone",
              label: t("fieldZone"),
              type: "select",
              options: expo.zones.map((zone) => ({
                value: zone.id,
                label: tLocalized(zone.title, locale),
              })),
            },
            {
              name: "message",
              label: t("fieldMessage"),
              type: "textarea",
            },
          ]}
        />
      </section>
    </div>
  );
}
