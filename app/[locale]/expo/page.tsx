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
        <div className="container-shell grid gap-10 md:grid-cols-2 md:items-center">
          <div className="relative aspect-[7/4] overflow-hidden bg-paper-2">
            <Image
              src={expo.planImage.src}
              alt={tLocalized(expo.planImage.alt, locale)}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-deep">{t("zones")}</h2>
            <ul className="mt-6 space-y-4">
              {expo.zones.map((zone) => (
                <li key={zone.id} className="border-t border-line pt-4">
                  <h3 className="font-bold text-deep">
                    {tLocalized(zone.title, locale)}
                  </h3>
                  <p className="mt-1 text-ink-soft">
                    {tLocalized(zone.text, locale)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-shell py-14">
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
      </section>

      <section id="apply" className="border-t border-line bg-white/40 py-14">
        <div className="container-shell max-w-3xl">
          <h2 className="text-3xl font-bold text-deep">{t("applyTitle")}</h2>
          <p className="mt-3 text-ink-soft">{t("applyText")}</p>
          <DemoApplyForm
            id="expo-apply"
            submitLabel={t("submit")}
            successMessage={t("success")}
            fields={[
              {
                name: "organization",
                label: t("fieldOrg"),
                required: true,
              },
              {
                name: "zone",
                label: t("fieldZone"),
                type: "select",
                required: true,
                options: expo.zones.map((zone) => ({
                  value: zone.id,
                  label: tLocalized(zone.title, locale),
                })),
              },
              {
                name: "contact",
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
                name: "description",
                label: t("fieldDescription"),
                type: "textarea",
                required: true,
              },
            ]}
          />
        </div>
      </section>
    </div>
  );
}
