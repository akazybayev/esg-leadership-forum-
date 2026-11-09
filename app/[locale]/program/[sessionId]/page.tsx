import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { CalendarPlus } from "lucide-react";
import { getHomeContent, getSiteConfig, tLocalized } from "@/lib/content";
import { getAllSessionIds, getSessionById, splitSessionTitle } from "@/lib/program";
import { buildPageMetadata, forumTitle } from "@/lib/seo";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  const ids = getAllSessionIds();
  return routing.locales.flatMap((locale) =>
    ids.map((sessionId) => ({ locale, sessionId })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; sessionId: string }>;
}): Promise<Metadata> {
  const { locale: localeParam, sessionId } = await params;
  const locale = localeParam as Locale;
  const session = getSessionById(sessionId);
  if (!session) return {};
  const title = tLocalized(session.title, locale);
  return buildPageMetadata({
    locale,
    path: `/program/${sessionId}`,
    title: forumTitle(title),
    description: title,
    ogDescription: tLocalized(getHomeContent().hero.supporting, locale),
  });
}

export default async function SessionPage({
  params,
}: {
  params: Promise<{ locale: string; sessionId: string }>;
}) {
  const { locale: localeParam, sessionId } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  const session = getSessionById(sessionId);
  if (!session) notFound();

  const t = await getTranslations("program");
  const tAccess = await getTranslations("access");
  const site = getSiteConfig();

  const dayLabel = session.day === "1" ? t("day1") : t("day2");
  const title = tLocalized(session.title, locale);
  const parts = splitSessionTitle(title);
  const accessLabel =
    session.access === "open"
      ? tAccess("open")
      : session.byRegistration
        ? tAccess("delegatesBooked")
        : tAccess("delegates");

  return (
    <article className="container-shell py-12 md:py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
        {dayLabel} · {session.start}–{session.end}
      </p>
      <h1 className="mt-3 max-w-4xl text-3xl font-bold tracking-tight text-deep md:text-5xl">
        {parts.name}
      </h1>
      {parts.subtitle ? (
        <p className="mt-3 max-w-3xl text-xl leading-snug text-ink-soft">{parts.subtitle}</p>
      ) : null}
      <p className="mt-4 text-ink-soft">
        {session.room} · {site.venue.name} · {t("timezone")}
      </p>

      <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold">
        <span className="rounded-full bg-paper-2 px-2.5 py-1 text-ink-soft">
          {t(`format.${session.format}`)}
        </span>
        {session.line ? (
          <span className="rounded-full bg-paper-2 px-2.5 py-1 text-ink-soft">
            {session.line}
          </span>
        ) : null}
        <span className="rounded-full bg-paper-2 px-2.5 py-1 text-ink-soft">
          {accessLabel}
        </span>
      </div>

      <div className="mt-8 max-w-3xl space-y-4 text-lg text-ink-soft">
        {session.description ? (
          <p>{tLocalized(session.description, locale)}</p>
        ) : (
          <p>{t("noDescription")}</p>
        )}
        {session.byRegistration ? (
          <p>
            {t("registrationHint")}{" "}
            <Link
              href="/register"
              className="font-semibold text-accent underline-offset-2 hover:underline"
            >
              {t("registerDelegate")}
            </Link>
          </p>
        ) : null}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <a
          className="btn btn-deep"
          href={`/calendar/sessions/${session.id}.ics`}
          download={`${session.id}.ics`}
        >
          <CalendarPlus aria-hidden="true" size={16} />
          {t("addToCalendar")}
        </a>
        <Link href="/program" className="btn btn-secondary">
          {t("backToProgram")}
        </Link>
      </div>
    </article>
  );
}
