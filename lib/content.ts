import { readFileSync } from "fs";
import path from "path";
import {
  delegatePricing,
  resolveDelegateTier,
  type DelegateTierId,
} from "@/lib/pricing";
import {
  homeContentSchema,
  navigationSchema,
  topicsContentSchema,
  architectureSchema,
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

export function getTopics() {
  return topicsContentSchema.parse(loadJson("topics.json"));
}

export function getProgram() {
  return programSchema.parse(loadJson("program.json"));
}

export function getArchitecture() {
  return architectureSchema.parse(loadJson("architecture.json"));
}

export function getSpeakers() {
  return speakersSchema.parse(loadJson("speakers.json"));
}

export function getAward() {
  return loadJson("award.json") as {
    statueCaption: LocalizedString;
    statueImage: string;
    intro: LocalizedString;
    grandPrix: LocalizedString;
    grandPrixNote: LocalizedString;
    principles: LocalizedString[];
    timeline: Array<{ id: string; date: string; label: LocalizedString }>;
    criteria: Array<{
      score: number;
      title: LocalizedString;
      text: LocalizedString;
    }>;
    scoringNote: LocalizedString;
    juryAnnounceDate: string;
    rulesSource: string;
    nominations: Array<{
      id: string;
      block: "Environment" | "Social" | "Governance" | "Next Generation";
      title: LocalizedString;
      eligible: LocalizedString;
      evaluates: LocalizedString;
    }>;
    winnersByYear: unknown[];
  };
}

export function getYouth() {
  return loadJson("youth.json") as {
    intro: LocalizedString;
    delegate: {
      title: LocalizedString;
      text: LocalizedString;
      requirements: LocalizedString[];
    };
    pitch: {
      title: LocalizedString;
      text: LocalizedString;
      tracks: Array<{
        id: string;
        title: LocalizedString;
        examples: LocalizedString;
      }>;
      stages: Array<{
        id: string;
        when: LocalizedString;
        result: LocalizedString;
      }>;
      criteria: Array<{ score: number; title: LocalizedString }>;
      prizes: LocalizedString[];
      rulesSource: string;
    };
  };
}

export function getExpo() {
  return loadJson("expo.json") as {
    intro: LocalizedString;
    zones: Array<{
      id: string;
      title: LocalizedString;
      text: LocalizedString;
    }>;
    conditions: LocalizedString[];
    planImage: { src: string; alt: LocalizedString };
    labeledPlanImage: { src: string; alt: LocalizedString };
    legend: Array<{ n: number; title: LocalizedString }>;
  };
}

export function getRegisterContent() {
  return loadJson("register.json") as {
    intro: LocalizedString;
    comparison: Array<{
      id: string;
      label: LocalizedString;
      guest: boolean;
      delegate: boolean;
    }>;
    freeDelegate: LocalizedString[];
  };
}

export function getPartnersContent() {
  return loadJson("partners.json") as {
    intro: LocalizedString;
    audience: Array<{ value: string; label: LocalizedString }>;
    priceNote: LocalizedString;
    sharedTitle: LocalizedString;
    shared: LocalizedString[];
    packages: Array<{
      id: string;
      title: LocalizedString;
      price: LocalizedString;
      summary: LocalizedString;
      includes: LocalizedString[];
    }>;
    institutional: { title: LocalizedString; text: LocalizedString };
    howTo: { title: LocalizedString; text: LocalizedString };
    deckUrl: string;
    deckAvailable: boolean;
  };
}

export function getAttendeesContent() {
  return loadJson("attendees.json") as {
    intro: LocalizedString;
    venue: {
      title: LocalizedString;
      text: LocalizedString;
      mapUrl: string;
      image: { src: string; alt: LocalizedString };
    };
    halls: Array<{
      id: string;
      title: LocalizedString;
      text: LocalizedString;
      image: { src: string; alt: LocalizedString };
    }>;
    floorPlan: {
      title: LocalizedString;
      note: LocalizedString;
      image: { src: string; alt: LocalizedString };
      diagram: { src: string; alt: LocalizedString };
      zones: Array<{ n: number; title: LocalizedString }>;
    };
    transport: { title: LocalizedString; items: LocalizedString[] };
    hotels: {
      title: LocalizedString;
      text: LocalizedString;
      items: unknown[];
    };
    visa: { title: LocalizedString; text: LocalizedString };
    faq: Array<{ q: LocalizedString; a: LocalizedString }>;
  };
}

export function getMediaContent() {
  return loadJson("media.json") as {
    intro: LocalizedString;
    news: unknown[];
    newsAnnounceDate: string;
    pressReleases: unknown[];
    brandKitUrl: string;
    brandKitAvailable: boolean;
    accreditationNote: LocalizedString;
  };
}

export function getGuestCountry() {
  return loadJson("guest-country.json") as {
    announceDate: string;
    countryConfirmed: boolean;
    country: LocalizedString | null;
    intro: LocalizedString;
    buyerNote: LocalizedString;
    includes: LocalizedString[];
  };
}

export function getContactContent() {
  return loadJson("contact.json") as {
    intro: LocalizedString;
    coordinator: {
      name: LocalizedString;
      role: LocalizedString;
      phone: string;
      emails: string[];
    };
    channels: Array<{
      id: string;
      label: LocalizedString;
      value: string;
    }>;
    address: LocalizedString;
    note: LocalizedString;
  };
}

export function getLegalContent() {
  return loadJson("legal.json") as {
    privacy: { title: LocalizedString; body: LocalizedString };
    consent: { title: LocalizedString; body: LocalizedString };
    terms: { title: LocalizedString; body: LocalizedString };
  };
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
        ru: "Прием заявок Youth Impact Pitch",
        en: "Youth Impact Pitch applications close",
        kk: "Youth Impact Pitch өтінімдері аяқталады",
      },
    },
    {
      id: "award",
      date: site.dates.awardClose,
      label: {
        ru: "Прием заявок ESG Award",
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

export type OrganizerContent = {
  title: LocalizedString;
  blocks: {
    id: string;
    name: LocalizedString;
    subtitle: LocalizedString;
    paragraphs: LocalizedString[];
    logo?: { src: string; width: number; height: number };
    portrait?: { src: string; width: number; height: number };
    stats?: { value: string; label: LocalizedString }[];
    membersLabel?: LocalizedString;
    members?: { name: string; href: string }[];
    awardsLabel?: LocalizedString;
    awards?: LocalizedString[];
    link?: { href: string; label: string };
  }[];
};

export function getOrganizers(): OrganizerContent {
  return loadJson("organizers.json") as OrganizerContent;
}

export function getDelegatePriceUsd(now = new Date()): {
  amount: number;
  isEarly: boolean;
  tier: DelegateTierId;
  earlyEnds: string;
  lateStarts: string;
} {
  const tier = resolveDelegateTier(now);
  return {
    amount: delegatePricing[tier].amountUsd,
    isEarly: tier === "early",
    tier,
    earlyEnds: delegatePricing.early.ends,
    lateStarts: delegatePricing.late.starts,
  };
}
