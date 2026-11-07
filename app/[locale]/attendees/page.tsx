import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getAttendeesContent, tLocalized } from "@/lib/content";
import { pageMetadata } from "@/lib/page-meta";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMetadata(locale, "attendees");
}

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

      <section className="border-y border-line bg-white/40">
        <div className="container-shell grid gap-10 py-14 md:grid-cols-3">
          <div>
            <h2 className="text-2xl font-bold text-deep">
              {tLocalized(content.visa.title, locale)}
            </h2>
            <p className="mt-3 text-ink-soft">
              {tLocalized(content.visa.text, locale)}
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-deep">
              {tLocalized(content.hotels.title, locale)}
            </h2>
            <p className="mt-3 text-ink-soft">
              {tLocalized(content.hotels.text, locale)}
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-deep">
              {tLocalized(content.transport.title, locale)}
            </h2>
            <ul className="mt-3 space-y-3">
              {content.transport.items.map((item) => (
                <li key={tLocalized(item, locale)} className="text-ink-soft">
                  {tLocalized(item, locale)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-white/40 py-14">
        <div className="container-shell grid gap-10 md:grid-cols-2 md:items-center">
          <div className="relative aspect-[16/10] overflow-hidden bg-paper-2">
            <Image
              src={content.venue.image.src}
              alt={tLocalized(content.venue.image.alt, locale)}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority
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

      <section className="container-shell py-14">
        <h2 className="text-3xl font-bold text-deep">{t("halls")}</h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          {content.halls.map((hall) => (
            <article key={hall.id}>
              <div className="relative aspect-[16/10] overflow-hidden bg-paper-2">
                <Image
                  src={hall.image.src}
                  alt={tLocalized(hall.image.alt, locale)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <h3 className="mt-4 text-2xl font-bold text-deep">
                {tLocalized(hall.title, locale)}
              </h3>
              <p className="mt-2 text-ink-soft">
                {tLocalized(hall.text, locale)}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-white/40 py-14">
        <div className="container-shell">
          <h2 className="text-3xl font-bold text-deep">
            {tLocalized(content.floorPlan.title, locale)}
          </h2>
          <p className="mt-3 max-w-3xl text-ink-soft">
            {tLocalized(content.floorPlan.note, locale)}
          </p>

          <div className="mt-8 overflow-hidden border border-line bg-white">
            <div className="relative aspect-[16/10] w-full bg-paper-2">
              <Image
                src={content.floorPlan.image.src}
                alt={tLocalized(content.floorPlan.image.alt, locale)}
                fill
                className="object-contain object-top p-2 md:p-4"
                sizes="100vw"
              />
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <div className="overflow-hidden border border-line bg-white">
              <div className="relative aspect-square w-full bg-white">
                <Image
                  src={content.floorPlan.diagram.src}
                  alt={tLocalized(content.floorPlan.diagram.alt, locale)}
                  fill
                  className="object-contain p-3"
                  sizes="(max-width: 1024px) 100vw, 60vw"
                />
              </div>
            </div>
            <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {content.floorPlan.zones.map((zone) => (
                <li
                  key={zone.n}
                  className="flex items-start gap-3 border-t border-line py-3 first:border-t-0 first:pt-0"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center bg-deep text-sm font-bold text-white">
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
