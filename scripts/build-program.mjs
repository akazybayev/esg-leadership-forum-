import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const source = await readFile(path.join(root, "docs/PROGRAM.md"), "utf8");

const forbidden = [
  ["ё", "буква ё"],
  ["Ё", "буква Ё"],
  ["—", "длинное тире"],
  ["День 0", "День 0"],
  ["12 октября", "12 октября"],
];
for (const [needle, label] of forbidden) {
  if (source.includes(needle)) {
    throw new Error(`docs/PROGRAM.md содержит ${label}`);
  }
}

function splitRow(line) {
  return line
    .split("|")
    .slice(1, -1)
    .map((cell) => cell.trim());
}

let day = null;
const sessions = [];
for (const line of source.split("\n")) {
  if (line.startsWith("## День 1")) day = "1";
  if (line.startsWith("## День 2")) day = "2";
  if (!line.startsWith("|") || !day) continue;
  const cells = splitRow(line);
  if (cells.length !== 8) {
    throw new Error(`строка таблицы должна иметь 8 колонок: ${line}`);
  }
  const [id, time, room, title, access, format, lineName, description] = cells;
  if (id === "id" || id.startsWith("---")) continue;
  const [start, end] = time.split("–");
  if (!start || !end || start.length !== 5 || end.length !== 5) {
    throw new Error(`время сессии ${id} должно быть ЧЧ:ММ–ЧЧ:ММ`);
  }
  const accessMap = {
    "Открыто всем": { access: "open", byRegistration: false },
    "Для делегатов": { access: "delegates", byRegistration: false },
    "Для делегатов, по записи": { access: "delegates", byRegistration: true },
  };
  const parsedAccess = accessMap[access];
  if (!parsedAccess) throw new Error(`неизвестный доступ у ${id}: ${access}`);
  const session = {
    id,
    day,
    start,
    end,
    room,
    format,
    access: parsedAccess.access,
    byRegistration: parsedAccess.byRegistration,
    title: { ru: title, en: "", kk: "" },
    speakers: [],
  };
  if (lineName) session.line = lineName;
  if (description) {
    session.description = { ru: description, en: "", kk: "" };
  }
  sessions.push(session);
}

const day1 = sessions.filter((session) => session.day === "1");
const day2 = sessions.filter((session) => session.day === "2");
if (day1.length !== 24 || day2.length !== 20) {
  throw new Error(`ожидались 24 и 20 сессий, получено ${day1.length} и ${day2.length}`);
}
const ids = new Set(sessions.map((session) => session.id));
if (ids.size !== sessions.length) throw new Error("id сессий повторяются");

const career = sessions.find((session) => session.id === "d2-1345-career");
if (!career || career.access !== "open" || career.byRegistration) {
  throw new Error("мастер-класс «Карьера в ESG» должен быть открыт всем");
}
for (const session of sessions) {
  const booked =
    (session.format === "masterclass" || session.format === "closed") &&
    session.id !== "d2-1345-career";
  if (booked && !(session.access === "delegates" && session.byRegistration)) {
    throw new Error(`${session.id} должен быть «Для делегатов, по записи»`);
  }
}

const program = {
  updatedAt: "2026-11-08",
  note: {
    ru: "Состав спикеров публикуется по мере подтверждения. Распределение по залам предварительное.",
    en: "Speakers are published as they are confirmed. Room assignments are provisional.",
    kk: "Спикерлер құрамы расталған сайын жарияланады. Залдардың бөлінісі алдын ала.",
  },
  sessions,
};

const json = `${JSON.stringify(program, null, 2)}\n`;
if (json.includes("ё") || json.includes("—") || json.includes("День 0") || json.includes("12 октября")) {
  throw new Error("собранный program.json содержит запрещенный текст");
}
await writeFile(path.join(root, "content/program.json"), json);

function sessionDate(day) {
  return day === "1" ? "2027-10-13" : "2027-10-14";
}

function toIcsStamp(date, time) {
  const [hh, mm] = time.split(":");
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

function icsText(value) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/[,;]/g, "\\$&");
}

const calendarDir = path.join(root, "public/calendar/sessions");
await mkdir(calendarDir, { recursive: true });
for (const session of sessions) {
  const date = sessionDate(session.day);
  const description = session.description?.ru ?? session.title.ru;
  const body = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//ESG Leadership Forum//Programme//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${session.id}@esg-leadership-forum`,
    `DTSTAMP:${toIcsStamp(date, session.start)}`,
    `DTSTART:${toIcsStamp(date, session.start)}`,
    `DTEND:${toIcsStamp(date, session.end)}`,
    `SUMMARY:${icsText(session.title.ru)}`,
    `DESCRIPTION:${icsText(description)}\\nAstana time (UTC+5)`,
    `LOCATION:${icsText(`${session.room}, Hilton Astana`)}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
  await writeFile(path.join(calendarDir, `${session.id}.ics`), body);
}

const keynote = await readFile(
  path.join(calendarDir, "d1-1000-keynote-1.ics"),
  "utf8",
);
if (!keynote.includes("DTSTART:20271013T050000Z") || !keynote.includes("DTEND:20271013T052500Z")) {
  throw new Error("время кейноута 1 в календаре не сходится с UTC+5");
}
const gala = await readFile(path.join(calendarDir, "d2-1900-gala.ics"), "utf8");
if (!gala.includes("DTSTART:20271014T140000Z") || !gala.includes("DTEND:20271014T170000Z")) {
  throw new Error("время гала-ужина в календаре не сходится с UTC+5");
}

const architecture = JSON.parse(
  await readFile(path.join(root, "content/architecture.json"), "utf8"),
);
const names = new Set(
  sessions.map((session) => {
    const index = session.title.ru.indexOf(": ");
    return index === -1 ? session.title.ru : session.title.ru.slice(0, index);
  }),
);
for (const forumDay of architecture.days) {
  for (const block of forumDay.blocks) {
    for (const item of block.sessions) {
      const key = item.linkName ?? item.name;
      if (!names.has(key)) {
        throw new Error(`схема ссылается на неизвестное короткое имя: ${key}`);
      }
    }
  }
}

console.log(`program: ${sessions.length} sessions, calendars written`);
