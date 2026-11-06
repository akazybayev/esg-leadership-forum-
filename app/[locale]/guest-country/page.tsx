import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { EmptyAnnounce } from "@/components/home/EmptyAnnounce";
import { DemoApplyForm } from "@/components/forms/DemoApplyForm";
import { getGuestCountry, tLocalized } from "@/lib/content";
import { formatForumDate } from "@/lib/dates";

export default async function GuestCountryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  const t = await getTranslations("guestCountryPage");
  const tStatus = await getTranslations("status");
  const tCta = await getTranslations("cta");
  const content = getGuestCountry();

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
          {tLocalized(content.intro, locale)}
        </p>
        <p className="mt-3 max-w-3xl text-ink-soft">
          {tLocalized(content.buyerNote, locale)}
        </p>

        <div className="mt-8">
          {content.countryConfirmed && content.country ? (
            <p className="text-2xl font-bold text-deep">
              {tLocalized(content.country, locale)}
            </p>
          ) : (
            <EmptyAnnounce
              message={tStatus("comingSoon", {
                date: formatForumDate(content.announceDate, locale),
              })}
            />
          )}
        </div>
      </section>

      <section className="border-y border-line bg-white/40 py-14">
        <div className="container-shell">
          <h2 className="text-3xl font-bold text-deep">{t("includes")}</h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {content.includes.map((item) => (
              <li
                key={tLocalized(item, locale)}
                className="border-t border-line pt-3 text-ink-soft"
              >
                {tLocalized(item, locale)}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/program" className="btn btn-deep">
              {t("seeProgram")}
            </Link>
            <Link href="/partners" className="btn btn-secondary">
              {tCta("becomePartner")}
            </Link>
          </div>
        </div>
      </section>

      <section id="request" className="container-shell max-w-3xl py-14">
        <h2 className="text-3xl font-bold text-deep">{t("requestTitle")}</h2>
        <p className="mt-3 text-ink-soft">{t("requestText")}</p>
        <DemoApplyForm
            formType="guest-country"
          id="guest-country-request"
          submitLabel={t("submit")}
          successMessage={t("success")}
          fields={[
            { name: "country", label: t("fieldCountry"), required: true },
            {
              name: "organization",
              label: t("fieldOrg"),
              required: true,
            },
            { name: "contact", label: t("fieldContact"), required: true },
            {
              name: "email",
              label: "Email",
              type: "email",
              required: true,
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
