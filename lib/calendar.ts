import type { Locale } from "@/i18n/routing";
import { tLocalized } from "@/lib/i18n-content";
import type { ProgramSession } from "@/lib/program-types";

type Session = ProgramSession;

function sessionDate(day: "0" | "1" | "2"): string {
  if (day === "0") return "2027-10-12";
  if (day === "1") return "2027-10-13";
  return "2027-10-14";
}

function toIcsStamp(date: string, time: string): string {
  const [hh, mm] = time.split(":");
  // Astana is UTC+5 → convert to UTC for ICS floating-less Z stamp
  const hours = Number(hh) - 5;
  const dayOffset = hours < 0 ? -1 : 0;
  const utcHours = (hours + 24) % 24;
  const base = new Date(`${date}T12:00:00Z`);
  base.setUTCDate(base.getUTCDate() + dayOffset);
  const y = base.getUTCFullYear();
  const m = String(base.getUTCMonth() + 1).padStart(2, "0");
  const d = String(base.getUTCDate()).padStart(2, "0");
  return `${y}${m}${d}T${String(utcHours).padStart(2, "0")}${mm}00Z`;
}

export function buildSessionIcs(session: Session, locale: Locale): string {
  const date = sessionDate(session.day);
  const title = tLocalized(session.title, locale).replace(/,/g, "\\,");
  const description = (
    session.description ? tLocalized(session.description, locale) : title
  ).replace(/,/g, "\\,");
  const uid = `${session.id}@esg-leadership-forum`;
  const dtStart = toIcsStamp(date, session.start);
  const dtEnd = toIcsStamp(date, session.end);

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ESG Leadership Forum//Programme//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${dtStart}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}\\nAstana time (UTC+5)`,
    `LOCATION:${session.room}, Hilton Astana`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

export function buildForumIcs(): string {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ESG Leadership Forum//Register//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:forum@esg-leadership-forum",
    "DTSTAMP:20271013T040000Z",
    "DTSTART:20271013T040000Z",
    "DTEND:20271014T160000Z",
    "SUMMARY:ESG Leadership Forum Astana 2027",
    "DESCRIPTION:13–14 October 2027\\, 09:00–21:00 Asia/Almaty (UTC+5)",
    "LOCATION:Hilton Astana\\, Astana",
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

export function downloadForumIcs() {
  const blob = new Blob([buildForumIcs()], {
    type: "text/calendar;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = "esg-leadership-forum-astana-2027.ics";
  anchor.click();
  URL.revokeObjectURL(url);
}

export function downloadSessionIcs(session: Session, locale: Locale) {
  const ics = buildSessionIcs(session, locale);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${session.id}.ics`;
  a.click();
  URL.revokeObjectURL(url);
}
