import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { EmptyAnnounce } from "@/components/home/EmptyAnnounce";
import { getAttendeesContent, tLocalized } from "@/lib/content";

export default async function AttendeesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  const t = await getTranslations("attendeesPage");
  const content = getAttendeesContent();

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
        <div className="container-shell grid gap-10 md:grid-cols-2 md:items-center">
          <div className="relative aspect-[4/3] overflow-hidden bg-paper-2">
            <Image
              src={content.venue.image.src}
              alt={tLocalized(content.venue.image.alt, locale)}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-deep">
              {tLocalized(content.venue.title, locale)}
            </h2>
            <p className="mt-3 text-ink-soft">
              {tLocalized(content.venue.text, locale)}
            </p>
            <a
              href={content.venue.mapUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-deep mt-6 inline-flex"
            >
              {t("openMap")}
            </a>
          </div>
        </div>
      </section>

      <section className="container-shell grid gap-12 py-14 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold text-deep">
            {tLocalized(content.transport.title, locale)}
          </h2>
          <ul className="mt-4 space-y-3">
            {content.transport.items.map((item) => (
              <li
                key={tLocalized(item, locale)}
                className="border-t border-line pt-3 text-ink-soft"
              >
                {tLocalized(item, locale)}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-deep">
            {tLocalized(content.hotels.title, locale)}
          </h2>
          <p className="mt-3 text-ink-soft">
            {tLocalized(content.hotels.text, locale)}
          </p>
          {content.hotels.items.length === 0 ? (
            <div className="mt-4">
              <EmptyAnnounce message={t("hotelsSoon")} />
            </div>
          ) : null}
        </div>
      </section>

      <section className="border-y border-line bg-white/40 py-14">
        <div className="container-shell max-w-3xl">
          <h2 className="text-3xl font-bold text-deep">
            {tLocalized(content.visa.title, locale)}
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            {tLocalized(content.visa.text, locale)}
          </p>
        </div>
      </section>

      <section className="container-shell py-14">
        <h2 className="text-3xl font-bold text-deep">{t("faq")}</h2>
        <ul className="mt-6 divide-y divide-line border-y border-line">
          {content.faq.map((item) => (
            <li key={tLocalized(item.q, locale)} className="py-5">
              <h3 className="text-xl font-bold text-deep">
                {tLocalized(item.q, locale)}
              </h3>
              <p className="mt-2 text-ink-soft">{tLocalized(item.a, locale)}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
