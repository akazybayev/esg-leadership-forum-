import { readFileSync } from "fs";
import path from "path";
import {
  awardSchema,
  homeContentSchema,
  navigationSchema,
  programSchema,
  siteConfigSchema,
  speakersSchema,
  type LocalizedString,
  type SiteConfig,
} from "@/schemas/content";
function loadJson(file: string): unknown {
  const full = path.join(process.cwd(), "content", file);
  return JSON.parse(readFileSync(full, "utf8"));
}

export { tLocalized } from "@/lib/i18n-content";

export function getSiteConfig(): SiteConfig {
  return siteConfigSchema.parse(loadJson("site.json"));
}

export function getNavigation() {
  return navigationSchema.parse(loadJson("navigation.json"));
}

export function getHomeContent() {
  return homeContentSchema.parse(loadJson("home.json"));
}

export function getProgram() {
  return programSchema.parse(loadJson("program.json"));
}

export function getSpeakers() {
  return speakersSchema.parse(loadJson("speakers.json"));
}

export function getAward() {
  return awardSchema.parse(loadJson("award.json"));
}

export function getSponsors() {
  return loadJson("sponsors.json") as {
    announceDate: string;
    levels: Array<{
      id: string;
      title: LocalizedString;
      logos: unknown[];
    }>;
  };
}

export function getNearestDeadline(now = new Date()): {
  id: string;
  date: string;
  label: LocalizedString;
} | null {
  const site = getSiteConfig();
  const candidates: Array<{ id: string; date: string; label: LocalizedString }> = [
    {
      id: "youthPitch",
      date: site.dates.youthPitchClose,
      label: {
        ru: "Приём заявок Youth Impact Pitch",
        en: "Youth Impact Pitch applications close",
        kk: "Youth Impact Pitch өтінімдері аяқталады",
      },
    },
    {
      id: "award",
      date: site.dates.awardClose,
      label: {
        ru: "Приём заявок ESG Award",
        en: "ESG Award applications close",
        kk: "ESG Award өтінімдері аяқталады",
      },
    },
    {
      id: "earlyBird",
      date: site.dates.earlyBirdEnds,
      label: {
        ru: "Ранняя цена делегата",
        en: "Delegate early-bird price ends",
        kk: "Делегаттың ерте бағасы аяқталады",
      },
    },
    {
      id: "day1",
      date: site.dates.day1,
      label: {
        ru: "Открытие форума",
        en: "Forum opening",
        kk: "Форумның ашылуы",
      },
    },
  ];

  const upcoming = candidates
    .map((item) => ({
      ...item,
      ts: new Date(`${item.date}T23:59:59+05:00`).getTime(),
    }))
    .filter((item) => item.ts >= now.getTime())
    .sort((a, b) => a.ts - b.ts);

  return upcoming[0] ?? null;
}

export function getHeadlineSessions() {
  const program = getProgram();
  const pick = (day: "1" | "2", formats: string[], limit: number) =>
    program.sessions
      .filter((s) => s.day === day && formats.includes(s.format))
      .slice(0, limit);

  return {
    day1: pick("1", ["keynote", "plenary", "session", "ceremony"], 4),
    day2: pick("2", ["keynote", "plenary", "pitch", "ceremony", "session"], 4),
  };
}

export function getDelegatePriceUsd(now = new Date()): {
  amount: number;
  isEarly: boolean;
  earlyEnds: string;
} {
  const site = getSiteConfig();
  const earlyEnds = new Date(`${site.dates.earlyBirdEnds}T23:59:59+05:00`);
  const isEarly = now.getTime() <= earlyEnds.getTime();
  return {
    amount: isEarly
      ? site.pricing.delegateEarlyUsd
      : site.pricing.delegateStandardUsd,
    isEarly,
    earlyEnds: site.dates.earlyBirdEnds,
  };
}
