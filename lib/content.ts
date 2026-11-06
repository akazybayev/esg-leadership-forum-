import { readFileSync } from "fs";
import path from "path";
import {
  awardSchema,
  navigationSchema,
  programSchema,
  siteConfigSchema,
  speakersSchema,
  type LocalizedString,
  type SiteConfig,
} from "@/schemas/content";
import type { Locale } from "@/i18n/routing";

function loadJson(file: string): unknown {
  const full = path.join(process.cwd(), "content", file);
  return JSON.parse(readFileSync(full, "utf8"));
}

export function getSiteConfig(): SiteConfig {
  return siteConfigSchema.parse(loadJson("site.json"));
}

export function getNavigation() {
  return navigationSchema.parse(loadJson("navigation.json"));
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

export function tLocalized(value: LocalizedString, locale: Locale): string {
  return value[locale] || value.ru;
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
