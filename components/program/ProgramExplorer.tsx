"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CalendarPlus, ChevronDown, Search } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { downloadSessionIcs } from "@/lib/calendar";
import { tLocalized } from "@/lib/i18n-content";
import { filterSessions, type ProgramSession } from "@/lib/program-types";
import type { LocalizedString } from "@/schemas/content";

type Props = {
  note: LocalizedString;
  sessions: ProgramSession[];
  initialDay?: string;
  initialLine?: string;
  initialRoom?: string;
  initialFormat?: string;
  initialAccess?: string;
  initialQuery?: string;
};

export function ProgramExplorer({
  note,
  sessions,
  initialDay = "1",
  initialLine = "",
  initialRoom = "",
  initialFormat = "",
  initialAccess = "",
  initialQuery = "",
}: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations("program");
  const tAccess = useTranslations("access");

  const [day, setDay] = useState(initialDay || "1");
  const [line, setLine] = useState(initialLine);
  const [room, setRoom] = useState(initialRoom);
  const [format, setFormat] = useState(initialFormat);
  const [access, setAccess] = useState(initialAccess);
  const [query, setQuery] = useState(initialQuery);
  const [openId, setOpenId] = useState<string | null>(null);

  const rooms = useMemo(
    () => [...new Set(sessions.map((s) => s.room))].sort(),
    [sessions],
  );
  const formats = useMemo(
    () => [...new Set(sessions.map((s) => s.format))].sort(),
    [sessions],
  );

  const filtered = useMemo(
    () =>
      filterSessions(sessions, {
        day,
        line: line || undefined,
        room: room || undefined,
        format: format || undefined,
        access: access || undefined,
        q: query,
      }),
    [sessions, day, line, room, format, access, query],
  );

  return (
    <div>
      <p className="max-w-3xl text-ink-soft">{tLocalized(note, locale)}</p>
      <p className="mt-2 text-sm text-ink-soft">{t("timezone")}</p>

      <div
        className="mt-8 flex flex-wrap gap-2"
        role="tablist"
        aria-label={t("days")}
      >
        {(["0", "1", "2"] as const).map((value) => (
          <button
            key={value}
            type="button"
            role="tab"
            aria-selected={day === value}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              day === value
                ? "bg-deep text-white"
                : "border border-line bg-white text-ink-soft hover:text-ink"
            }`}
            onClick={() => setDay(value)}
          >
            {t(`day${value}`)}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-ink-soft">{t("filterLine")}</span>
          <select
            className="min-h-11 rounded-lg border border-line bg-white px-3"
            value={line}
            onChange={(e) => setLine(e.target.value)}
          >
            <option value="">{t("any")}</option>
            {["Lead", "Finance", "Planet", "People", "Region"].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-ink-soft">{t("filterRoom")}</span>
          <select
            className="min-h-11 rounded-lg border border-line bg-white px-3"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          >
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
          <select
            className="min-h-11 rounded-lg border border-line bg-white px-3"
            value={format}
            onChange={(e) => setFormat(e.target.value)}
          >
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
          <select
            className="min-h-11 rounded-lg border border-line bg-white px-3"
            value={access}
            onChange={(e) => setAccess(e.target.value)}
          >
            <option value="">{t("any")}</option>
            <option value="open">{tAccess("open")}</option>
            <option value="delegates">{tAccess("delegates")}</option>
          </select>
        </label>
        <label className="grid gap-1 text-sm">
          <span className="font-medium text-ink-soft">{t("search")}</span>
          <span className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft"
            />
            <input
              className="min-h-11 w-full rounded-lg border border-line bg-white py-2 pl-9 pr-3"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
            />
          </span>
        </label>
      </div>

      <p className="mt-4 text-sm text-ink-soft">
        {t("results", { count: filtered.length })}
      </p>

      <ul className="mt-6 divide-y divide-line border-y border-line">
        {filtered.map((session) => {
          const open = openId === session.id;
          return (
            <li key={session.id} className="py-4">
              <button
                type="button"
                className="flex w-full items-start justify-between gap-4 text-left"
                aria-expanded={open}
                onClick={() => setOpenId(open ? null : session.id)}
              >
                <div>
                  <p className="text-sm font-semibold text-accent">
                    {session.start}–{session.end} · {session.room}
                    {session.line ? ` · ${session.line}` : ""}
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-deep md:text-xl">
                    {tLocalized(session.title, locale)}
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.08em]">
                    <span className="rounded-full bg-paper-2 px-2.5 py-1 text-ink-soft">
                      {t(`format.${session.format}`)}
                    </span>
                    <span className="rounded-full bg-paper-2 px-2.5 py-1 text-ink-soft">
                      {session.access === "open"
                        ? tAccess("open")
                        : tAccess("delegates")}
                    </span>
                    {session.byRegistration ? (
                      <span className="rounded-full bg-[#f3e2d6] px-2.5 py-1 text-accent">
                        {tAccess("byRegistration")}
                      </span>
                    ) : null}
                  </div>
                </div>
                <ChevronDown
                  className={`mt-1 shrink-0 transition ${open ? "rotate-180" : ""}`}
                  size={20}
                />
              </button>

              {open ? (
                <div className="mt-4 space-y-3 border-l-2 border-accent/40 pl-4 text-ink-soft">
                  {session.description ? (
                    <p>{tLocalized(session.description, locale)}</p>
                  ) : (
                    <p>{t("noDescription")}</p>
                  )}
                  {session.byRegistration ? (
                    <p>
                      {t("registrationHint")}{" "}
                      <Link href="/register" className="font-semibold text-accent underline-offset-2 hover:underline">
                        {t("registerDelegate")}
                      </Link>
                    </p>
                  ) : null}
                  <div className="flex flex-wrap gap-3 pt-1">
                    <Link
                      href={`/program/${session.id}`}
                      className="btn btn-secondary"
                    >
                      {t("openSession")}
                    </Link>
                    <button
                      type="button"
                      className="btn btn-deep"
                      onClick={() => downloadSessionIcs(session, locale)}
                    >
                      <CalendarPlus size={16} />
                      {t("addToCalendar")}
                    </button>
                  </div>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
