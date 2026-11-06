import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { RegisterForm } from "@/components/register/RegisterForm";
import { ShareButtons } from "@/components/share/ShareButtons";
import {
  getDelegatePriceUsd,
  getRegisterContent,
  tLocalized,
} from "@/lib/content";
import { daysUntil, formatForumDate } from "@/lib/dates";
import { delegatePricing, tierDeadline } from "@/lib/pricing";
import { absoluteUrl } from "@/lib/seo";
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
  const tShare = await getTranslations("share");
  const content = getRegisterContent();
  const pricing = getDelegatePriceUsd();
  const countdownDays = daysUntil(tierDeadline(pricing.tier));
  const tiers = [
    {
      id: "early" as const,
      amount: delegatePricing.early.amountUsd,
      until: formatForumDate(delegatePricing.early.ends, locale),
    },
    {
      id: "standard" as const,
      amount: delegatePricing.standard.amountUsd,
      until: formatForumDate(delegatePricing.standard.ends, locale),
    },
    {
      id: "late" as const,
      amount: delegatePricing.late.amountUsd,
      until: formatForumDate(delegatePricing.late.starts, locale),
    },
  ];

  return (
    <div>
      <section className="container-shell py-12 md:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
          {tNav("register")}
        </p>
        <p className="mt-3 text-sm font-medium text-deep">{t("whenWhere")}</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-deep md:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-ink-soft">
          {tLocalized(content.intro, locale)}
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {tiers.map((tier) => {
            const current = tier.id === pricing.tier;
            return (
              <article
                key={tier.id}
                className={`border p-5 ${current ? "border-deep bg-deep text-white" : "border-line bg-white/70 text-deep"}`}
              >
                <h2 className="text-lg font-bold">{t(`tier.${tier.id}`)}</h2>
                <p className="mt-2 text-3xl font-bold">{tier.amount} USD</p>
                <p className={`mt-2 text-sm ${current ? "text-white/75" : "text-ink-soft"}`}>
                  {tier.id === "late"
                    ? t("tierFrom", { date: tier.until })
                    : t("tierUntil", { date: tier.until })}
                </p>
                {current ? (
                  <p className="mt-3 text-sm font-semibold text-[#e2b79a]">
                    {t("countdown", { days: countdownDays })}
                  </p>
                ) : null}
              </article>
            );
          })}
        </div>
        <ShareButtons
          url={absoluteUrl(locale, "/register")}
          title={t("title")}
          labels={{
            share: tShare("label"),
            linkedin: tShare("linkedin"),
            telegram: tShare("telegram"),
            whatsapp: tShare("whatsapp"),
            copy: tShare("copy"),
            copied: tShare("copied"),
          }}
        />
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
            priceLabel={
              pricing.tier === "early"
                ? t("priceEarly", {
                    amount: pricing.amount,
                    days: countdownDays,
                  })
                : t("priceCurrent", {
                    amount: pricing.amount,
                    tier: t(`tier.${pricing.tier}`),
                  })
            }
          />
        </div>
      </section>

      <section className="container-shell max-w-3xl py-14">
        <h2 className="text-3xl font-bold text-deep">{t("faqTitle")}</h2>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {(["visa", "card", "refund", "groups", "dress"] as const).map((id) => (
            <details key={id} className="group py-4">
              <summary className="cursor-pointer text-lg font-semibold text-deep">
                {t(`faq.${id}.q`)}
              </summary>
              <div className="mt-3 text-sm leading-relaxed text-ink-soft">
                {id === "refund" ? (
                  <p>
                    {t("faq.refund.a")}{" "}
                    <Link href="/terms" className="underline">
                      {t("faq.refund.link")}
                    </Link>
                  </p>
                ) : (
                  <p>
                    {t.rich(`faq.${id}.a`, {
                      email: (chunks) => (
                        <a className="underline" href="mailto:forum@esgpartners.kz">
                          {chunks}
                        </a>
                      ),
                    })}
                  </p>
                )}
              </div>
            </details>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-white/40 py-14">
        <div className="container-shell grid gap-6 md:grid-cols-2 md:items-start">
          <div>
            <h2 className="text-3xl font-bold text-deep">{t("wayTitle")}</h2>
            <p className="mt-4 text-lg text-ink">{t("wayAddress")}</p>
            <p className="mt-3 text-sm text-ink-soft">{t("wayTransfer")}</p>
            <a
              className="mt-4 inline-block text-sm font-semibold text-deep underline"
              href="https://maps.google.com/?q=Hilton+Astana"
              target="_blank"
              rel="noreferrer"
            >
              {t("wayOpen")}
            </a>
          </div>
          <iframe
            title={t("wayTitle")}
            className="min-h-64 w-full border border-line"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://maps.google.com/maps?q=Hilton+Astana&z=15&output=embed"
          />
        </div>
      </section>
    </div>
  );
}
