import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { DemoApplyForm } from "@/components/forms/DemoApplyForm";
import { getPartnersContent, tLocalized } from "@/lib/content";
import { pageMetadata } from "@/lib/page-meta";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMetadata(locale, "partners");
}

export default async function PartnersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  const t = await getTranslations("partnersPage");
  const content = getPartnersContent();

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
      </section>

      <section className="border-y border-line bg-deep py-10 text-white">
        <div className="container-shell grid grid-cols-2 gap-6 md:grid-cols-5">
          {content.audience.map((item) => (
            <div key={item.value + tLocalized(item.label, locale)}>
              <p className="text-3xl font-bold md:text-4xl">{item.value}</p>
              <p className="mt-1 text-sm text-white/65">
                {tLocalized(item.label, locale)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell py-14">
        <h2 className="text-3xl font-bold text-deep">
          {tLocalized(content.sharedTitle, locale)}
        </h2>
        <ul className="mt-6 grid gap-3 md:grid-cols-2">
          {content.shared.map((item) => (
            <li
              key={tLocalized(item, locale)}
              className="border-t border-line pt-3 text-ink-soft"
            >
              {tLocalized(item, locale)}
            </li>
          ))}
        </ul>
      </section>

      <section className="container-shell pb-14">
        <h2 className="text-3xl font-bold text-deep">{t("packages")}</h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {content.packages.map((pack) => (
            <article
              key={pack.id}
              className="border border-line bg-white/70 p-6"
            >
              <h3 className="text-2xl font-bold text-deep">
                {tLocalized(pack.title, locale)}
              </h3>
              <p className="mt-2 text-lg font-semibold text-accent">
                {tLocalized(pack.price, locale)}
              </p>
              <p className="mt-3 text-ink-soft">
                {tLocalized(pack.summary, locale)}
              </p>
              {pack.includes.length > 0 ? (
                <ul className="mt-5 space-y-2 text-sm text-ink">
                  {pack.includes.map((item) => (
                    <li key={tLocalized(item, locale)}>• {tLocalized(item, locale)}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          ))}
        </div>
        <p className="mt-6 text-sm text-ink-soft">
          {tLocalized(content.priceNote, locale)}
        </p>
        <article className="mt-10 border border-line bg-white/70 p-6">
          <h3 className="text-2xl font-bold text-deep">
            {tLocalized(content.institutional.title, locale)}
          </h3>
          <p className="mt-3 text-ink-soft">
            {tLocalized(content.institutional.text, locale)}
          </p>
        </article>
        {content.deckAvailable ? (
          <a href={content.deckUrl} className="btn btn-deep mt-8 inline-flex">
            {t("downloadDeck")}
          </a>
        ) : null}
      </section>

      <section id="request" className="border-t border-line bg-white/40 py-14">
        <div className="container-shell max-w-3xl">
          <h2 className="text-3xl font-bold text-deep">
            {tLocalized(content.howTo.title, locale)}
          </h2>
          <p className="mt-3 text-ink-soft">
            {tLocalized(content.howTo.text, locale)}
          </p>
          <DemoApplyForm
            formType="partners"
            id="partner-request"
            submitLabel={t("submit")}
            successMessage={t("success")}
            fields={[
              { name: "company", label: t("fieldCompany"), required: true },
              {
                name: "level",
                label: t("fieldLevel"),
                type: "select",
                required: true,
                options: [
                  ...content.packages.map((pack) => ({
                    value: pack.id,
                    label: tLocalized(pack.title, locale),
                  })),
                  {
                    value: "institutional",
                    label: tLocalized(content.institutional.title, locale),
                  },
                ],
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
        </div>
      </section>
    </div>
  );
}
