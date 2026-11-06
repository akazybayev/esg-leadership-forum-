import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { AddToCalendarButton } from "@/components/program/AddToCalendarButton";
import { getSiteConfig, tLocalized } from "@/lib/content";
import { getAllSessionIds, getSessionById } from "@/lib/program";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  const ids = getAllSessionIds();
  return routing.locales.flatMap((locale) =>
    ids.map((sessionId) => ({ locale, sessionId })),
  );
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

  const dayLabel =
    session.day === "0"
      ? t("day0")
      : session.day === "1"
        ? t("day1")
        : t("day2");

  return (
    <article className="container-shell py-12 md:py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
        {dayLabel} · {session.start}–{session.end}
      </p>
      <h1 className="mt-3 max-w-4xl text-3xl font-bold tracking-tight text-deep md:text-5xl">
        {tLocalized(session.title, locale)}
      </h1>
      <p className="mt-4 text-ink-soft">
        {session.room} · {site.venue.name} · {t("timezone")}
      </p>

      <div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.08em]">
        <span className="rounded-full bg-paper-2 px-2.5 py-1 text-ink-soft">
          {t(`format.${session.format}`)}
        </span>
        {session.line ? (
          <span className="rounded-full bg-paper-2 px-2.5 py-1 text-ink-soft">
            {session.line}
          </span>
        ) : null}
        <span className="rounded-full bg-paper-2 px-2.5 py-1 text-ink-soft">
          {session.access === "open" ? tAccess("open") : tAccess("delegates")}
        </span>
        {session.byRegistration ? (
          <span className="rounded-full bg-[#f3e2d6] px-2.5 py-1 text-accent">
            {tAccess("byRegistration")}
          </span>
        ) : null}
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
        <AddToCalendarButton session={session} />
        <Link href="/program" className="btn btn-secondary">
          {t("backToProgram")}
        </Link>
      </div>
    </article>
  );
}
