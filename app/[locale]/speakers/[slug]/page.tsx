import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { getSpeakers, tLocalized } from "@/lib/content";
import { getSessionById } from "@/lib/program";

export function generateStaticParams() {
  const speakers = getSpeakers().items.filter((s) => s.confirmed);
  if (speakers.length === 0) {
    return routing.locales.map((locale) => ({ locale, slug: "_placeholder" }));
  }
  return routing.locales.flatMap((locale) =>
    speakers.map((speaker) => ({ locale, slug: speaker.id })),
  );
}

export default async function SpeakerPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: localeParam, slug } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  if (slug === "_placeholder") notFound();

  const speaker = getSpeakers().items.find(
    (item) => item.id === slug && item.confirmed && item.name,
  );
  if (!speaker) notFound();

  const t = await getTranslations("speakers");
  const sessions = speaker.sessionIds
    .map((id) => getSessionById(id))
    .filter(Boolean);

  return (
    <article className="container-shell grid gap-10 py-12 md:grid-cols-[0.9fr_1.1fr] md:py-16">
      <div className="relative aspect-[4/5] overflow-hidden bg-paper-2">
        {speaker.photo ? (
          <Image
            src={speaker.photo}
            alt={tLocalized(speaker.name!, locale)}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        ) : (
          <div className="flex h-full items-end p-6 text-ink-soft">
            {t("photoSoon")}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
          {speaker.lines.join(" · ") || t("speaker")}
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-deep md:text-5xl">
          {tLocalized(speaker.name!, locale)}
        </h1>
        {speaker.title ? (
          <p className="mt-3 text-xl text-ink-soft">
            {tLocalized(speaker.title, locale)}
          </p>
        ) : null}
        {speaker.organization ? (
          <p className="mt-2 font-medium text-ink">
            {tLocalized(speaker.organization, locale)}
            {speaker.country
              ? ` · ${tLocalized(speaker.country, locale)}`
              : ""}
          </p>
        ) : null}
        {speaker.bio ? (
          <p className="mt-6 max-w-2xl text-lg text-ink-soft">
            {tLocalized(speaker.bio, locale)}
          </p>
        ) : null}

        <h2 className="mt-10 text-2xl font-bold text-deep">{t("sessions")}</h2>
        {sessions.length === 0 ? (
          <p className="mt-3 text-ink-soft">{t("noSessions")}</p>
        ) : (
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {sessions.map((session) =>
              session ? (
                <li key={session.id} className="py-3">
                  <Link
                    href={`/program/${session.id}`}
                    className="font-medium text-deep hover:text-accent"
                  >
                    {session.start}–{session.end} ·{" "}
                    {tLocalized(session.title, locale)}
                  </Link>
                </li>
              ) : null,
            )}
          </ul>
        )}

        <Link href="/speakers" className="btn btn-secondary mt-8">
          {t("back")}
        </Link>
      </div>
    </article>
  );
}
