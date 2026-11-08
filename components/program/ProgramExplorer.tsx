import { CalendarPlus, ChevronDown } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { tLocalized } from "@/lib/i18n-content";
import { splitSessionTitle } from "@/lib/program";
import type { ProgramSession } from "@/lib/program-types";
import type { LocalizedString } from "@/schemas/content";

const lines = ["Lead", "Finance", "Planet", "People", "Region"] as const;
const days = ["1", "2"] as const;

type Props = {
  note: LocalizedString;
  sessions: ProgramSession[];
};

function accessKey(session: ProgramSession) {
  if (session.access === "open") return "open" as const;
  if (session.byRegistration) return "delegatesBooked" as const;
  return "delegates" as const;
}

export async function ProgramExplorer({ note, sessions }: Props) {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("program");
  const tAccess = await getTranslations("access");
  const rooms = [...new Set(sessions.map((session) => session.room))].sort((a, b) =>
    a.localeCompare(b, "ru"),
  );
  const formats = [...new Set(sessions.map((session) => session.format))].sort();

  return (
    <div data-program-explorer>
      <p className="max-w-3xl text-ink-soft">{tLocalized(note, locale)}</p>
      <p className="mt-2 text-sm text-ink-soft">{t("timezone")}</p>

      <nav className="mt-8 flex flex-wrap gap-2" aria-label={t("days")}>
        {days.map((value) => (
          <button
            key={value}
            type="button"
            data-day-filter={value}
            aria-pressed="false"
            className="program-day-link rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink-soft"
          >
            {t(`day${value}`)}
          </button>
        ))}
      </nav>

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-ink-soft">{t("filterLine")}</span>
          <select className="min-h-11 rounded-lg border border-line bg-white px-3" data-filter="line" defaultValue="">
            <option value="">{t("any")}</option>
            {lines.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-ink-soft">{t("filterRoom")}</span>
          <select className="min-h-11 rounded-lg border border-line bg-white px-3" data-filter="room" defaultValue="">
            <option value="">{t("any")}</option>
            {rooms.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-ink-soft">{t("filterFormat")}</span>
          <select className="min-h-11 rounded-lg border border-line bg-white px-3" data-filter="format" defaultValue="">
            <option value="">{t("any")}</option>
            {formats.map((value) => (
              <option key={value} value={value}>
                {t(`format.${value}`)}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-ink-soft">{t("filterAccess")}</span>
          <select className="min-h-11 rounded-lg border border-line bg-white px-3" data-filter="access" defaultValue="">
            <option value="">{t("any")}</option>
            <option value="open">{tAccess("open")}</option>
            <option value="delegates">{tAccess("delegates")}</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-ink-soft">{t("search")}</span>
          <input
            className="min-h-11 rounded-lg border border-line bg-white px-3"
            data-filter="q"
            defaultValue=""
            placeholder={t("searchPlaceholder")}
            type="search"
          />
        </label>
      </div>

      <p className="mt-4 text-sm text-ink-soft" data-results data-results-template={t("results", { count: "COUNT" })}>
        {t("results", { count: sessions.length })}
      </p>

      <div className="mt-6 space-y-10">
        {days.map((value) => {
          const items = sessions.filter((session) => session.day === value);
          return (
            <section
              key={value}
              id={`program-day-${value}`}
              data-day-section={value}
              className="scroll-mt-24"
            >
              <h2 className="text-2xl font-bold text-deep">{t(`day${value}`)}</h2>
              <ul className="mt-4 space-y-3">
                {items.map((session) => {
                  const title = tLocalized(session.title, locale);
                  const parts = splitSessionTitle(title);
                  const description = session.description
                    ? tLocalized(session.description, locale)
                    : "";
                  return (
                    <li
                      key={session.id}
                      data-session
                      data-day={session.day}
                      data-line={session.line ?? ""}
                      data-room={session.room}
                      data-format={session.format}
                      data-access={session.access}
                      data-title={`${title} ${description}`.toLowerCase()}
                    >
                      <details className="session-details border border-line bg-white">
                        <summary className="px-4 py-4">
                          <span className="min-w-0 flex-1">
                            <p className="meta-accent text-sm font-semibold">
                              {session.start}–{session.end} · {session.room}
                              {session.line ? ` · ${session.line}` : ""}
                            </p>
                            <h3 className="mt-1 text-lg font-bold leading-snug text-deep md:text-xl">
                              <Link href={`/program/${session.id}`} className="hover:underline">
                                {parts.name}
                              </Link>
                            </h3>
                            {parts.subtitle ? (
                              <p className="mt-1 text-base leading-snug text-ink-soft">{parts.subtitle}</p>
                            ) : null}
                            <span className="mt-2 flex flex-wrap gap-2 text-xs font-semibold">
                              <span className="rounded-full bg-paper-2 px-2.5 py-1 text-ink-soft">
                                {t(`format.${session.format}`)}
                              </span>
                              <span className="rounded-full bg-paper-2 px-2.5 py-1 text-ink-soft">
                                {tAccess(accessKey(session))}
                              </span>
                            </span>
                          </span>
                          <ChevronDown aria-hidden="true" className="session-chevron mt-1 shrink-0 text-deep" size={20} />
                        </summary>
                        <div className="space-y-3 border-t border-line px-4 py-4 text-ink-soft">
                          {description ? <p>{description}</p> : <p>{t("noDescription")}</p>}
                          {session.byRegistration ? (
                            <p>
                              {t("registrationHint")}{" "}
                              <Link href="/register" className="font-semibold text-accent underline-offset-2 hover:underline">
                                {t("registerDelegate")}
                              </Link>
                            </p>
                          ) : null}
                          <div className="flex flex-wrap gap-3 pt-1">
                            <Link href={`/program/${session.id}`} className="btn btn-secondary">
                              {t("openSession")}
                            </Link>
                            <a className="btn btn-deep" href={`/calendar/sessions/${session.id}.ics`} download={`${session.id}.ics`}>
                              <CalendarPlus aria-hidden="true" size={16} />
                              {t("addToCalendar")}
                            </a>
                          </div>
                        </div>
                      </details>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
