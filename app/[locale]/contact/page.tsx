import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { DemoApplyForm } from "@/components/forms/DemoApplyForm";
import { getContactContent, getSiteConfig, tLocalized } from "@/lib/content";

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  const t = await getTranslations("contactPage");
  const content = getContactContent();
  const site = getSiteConfig();

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
        <div className="container-shell grid gap-8 md:grid-cols-3">
          {content.channels.map((channel) => (
            <div key={channel.id}>
              <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-soft">
                {tLocalized(channel.label, locale)}
              </h2>
              <a
                href={`mailto:${channel.value}`}
                className="mt-3 inline-block text-xl font-bold text-deep hover:text-accent"
              >
                {channel.value}
              </a>
            </div>
          ))}
        </div>
        <div className="container-shell mt-10">
          <p className="font-medium text-ink">
            {site.organizer.name} · {tLocalized(content.address, locale)}
          </p>
          <p className="mt-2 text-sm text-ink-soft">
            {tLocalized(content.note, locale)}
          </p>
        </div>
      </section>

      <section className="container-shell max-w-3xl py-14">
        <h2 className="text-3xl font-bold text-deep">{t("formTitle")}</h2>
        <DemoApplyForm
          id="contact-form"
          submitLabel={t("submit")}
          successMessage={t("success")}
          fields={[
            { name: "name", label: t("fieldName"), required: true },
            {
              name: "email",
              label: "Email",
              type: "email",
              required: true,
            },
            {
              name: "topic",
              label: t("fieldTopic"),
              type: "select",
              required: true,
              options: content.channels.map((channel) => ({
                value: channel.id,
                label: tLocalized(channel.label, locale),
              })),
            },
            {
              name: "message",
              label: t("fieldMessage"),
              type: "textarea",
              required: true,
            },
          ]}
        />
      </section>
    </div>
  );
}
