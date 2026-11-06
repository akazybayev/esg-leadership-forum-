import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { RegisterForm } from "@/components/register/RegisterForm";
import {
  getDelegatePriceUsd,
  getRegisterContent,
  getSiteConfig,
  tLocalized,
} from "@/lib/content";
import { daysUntil, formatForumDate } from "@/lib/dates";
import { pageMetadata } from "@/lib/page-meta";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMetadata(locale, "register");
}

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  const t = await getTranslations("registerPage");
  const tNav = await getTranslations("nav");
  const content = getRegisterContent();
  const site = getSiteConfig();
  const pricing = getDelegatePriceUsd();
  const earlyDays = daysUntil(site.dates.earlyBirdEnds);

  return (
    <div>
      <section className="container-shell py-12 md:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
          {tNav("register")}
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-deep md:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-ink-soft">
          {tLocalized(content.intro, locale)}
        </p>
        <p className="mt-3 text-sm font-medium text-deep">
          {pricing.isEarly
            ? t("earlyUntil", {
                date: formatForumDate(site.dates.earlyBirdEnds, locale),
                amount: site.pricing.delegateEarlyUsd,
              })
            : t("standardFrom", {
                amount: site.pricing.delegateStandardUsd,
              })}
        </p>
      </section>

      <section className="border-y border-line bg-white/40 py-14">
        <div className="container-shell overflow-x-auto">
          <h2 className="text-3xl font-bold text-deep">{t("compareTitle")}</h2>
          <table className="mt-6 w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="py-3 pr-4 font-semibold text-ink-soft">
                  {t("feature")}
                </th>
                <th className="py-3 pr-4 font-semibold text-deep">{t("guest")}</th>
                <th className="py-3 font-semibold text-deep">{t("delegate")}</th>
              </tr>
            </thead>
            <tbody>
              {content.comparison.map((row) => (
                <tr key={row.id} className="border-b border-line">
                  <td className="py-3 pr-4 text-ink">
                    {tLocalized(row.label, locale)}
                  </td>
                  <td className="py-3 pr-4">{row.guest ? "✓" : "—"}</td>
                  <td className="py-3">{row.delegate ? "✓" : "—"}</td>
                </tr>
              ))}
              <tr className="border-b border-line">
                <td className="py-3 pr-4 font-semibold text-ink">{t("price")}</td>
                <td className="py-3 pr-4 font-semibold">{t("priceFree")}</td>
                <td className="py-3 font-semibold">
                  {pricing.amount} USD
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="container-shell py-14">
        <h2 className="text-3xl font-bold text-deep">{t("freeTitle")}</h2>
        <ul className="mt-6 max-w-3xl space-y-3">
          {content.freeDelegate.map((item) => (
            <li
              key={tLocalized(item, locale)}
              className="border-t border-line pt-3 text-ink-soft"
            >
              {tLocalized(item, locale)}
            </li>
          ))}
        </ul>
      </section>

      <section id="form" className="border-t border-line bg-white/40 py-14">
        <div className="container-shell max-w-3xl">
          <h2 className="text-3xl font-bold text-deep">{t("formTitle")}</h2>
          <RegisterForm
            earlyPrice={site.pricing.delegateEarlyUsd}
            standardPrice={site.pricing.delegateStandardUsd}
            isEarly={pricing.isEarly}
            earlyDaysLeft={earlyDays}
            lines={["Lead", "Finance", "Planet", "People", "Region"]}
          />
        </div>
      </section>
    </div>
  );
}
