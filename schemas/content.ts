import { z } from "zod";

export const localizedStringSchema = z.object({
  ru: z.string(),
  en: z.string(),
  kk: z.string(),
});

export type LocalizedString = z.infer<typeof localizedStringSchema>;

export const forumStageSchema = z.enum(["before", "during", "after"]);

export const siteConfigSchema = z.object({
  name: localizedStringSchema,
  slogan: localizedStringSchema,
  organizer: z.object({
    name: z.string(),
    url: z.string().url(),
  }),
  venue: z.object({
    name: z.string(),
    complex: localizedStringSchema,
    city: localizedStringSchema,
    country: localizedStringSchema,
  }),
  timezone: z.literal("Asia/Almaty"),
  stage: forumStageSchema,
  dates: z.object({
    day1: z.string(),
    day2: z.string(),
    youthPitchOpen: z.string(),
    youthPitchClose: z.string(),
    awardOpen: z.string(),
    awardClose: z.string(),
    earlyBirdEnds: z.string(),
    shortlistMonth: z.string(),
    speakersAnnounce: z.string().optional(),
    sponsorsAnnounce: z.string().optional(),
    guestCountryAnnounce: z.string().optional(),
  }),
  pricing: z.object({
    guestUsd: z.number(),
    delegateEarlyUsd: z.number(),
    delegateLateUsd: z.number(),
    currencyDisplay: z.array(z.enum(["USD", "KZT"])),
  }),
  scale: z.object({
    days: z.number(),
    participants: z.number(),
    countries: z.string(),
    youthDelegates: z.number(),
    exhibitors: z.number(),
    awardNominations: z.number(),
    guestCountrySections: z.number().optional(),
    exhibitionStands: z.number().optional(),
  }),
  contact: z.object({
    email: z.string().email(),
    emails: z.array(z.string().email()).optional(),
    phone: z.string().optional(),
    coordinator: z
      .object({
        name: localizedStringSchema,
        role: localizedStringSchema,
      })
      .optional(),
  }),
  social: z.object({
    linkedin: z.string().url().optional(),
    instagram: z.string().url().optional(),
    youtube: z.string().url().optional(),
  }),
});

export type SiteConfig = z.infer<typeof siteConfigSchema>;

export const themeLineSchema = z.enum([
  "Lead",
  "Finance",
  "Planet",
  "People",
  "Region",
]);

export const venueRoomSchema = z.enum([
  "Main Stage",
  "Hall B",
  "Impact Stage",
  "Master Class 1",
  "Master Class 2",
  "Закрытый зал",
  "Expo",
  "Фойе, Expo",
  "Ресторан",
  "Площадка отеля",
  "Expo, B2B Lounge",
]);

export const accessLevelSchema = z.enum(["open", "delegates"]);

export const sessionFormatSchema = z.enum([
  "keynote",
  "plenary",
  "session",
  "masterclass",
  "closed",
  "ceremony",
  "pitch",
  "networking",
  "visit",
  "exhibition",
  "other",
]);

export const programSessionSchema = z.object({
  id: z.string(),
  day: z.enum(["1", "2"]),
  start: z.string(),
  end: z.string(),
  room: venueRoomSchema,
  format: sessionFormatSchema,
  line: themeLineSchema.optional(),
  access: accessLevelSchema,
  byRegistration: z.boolean().default(false),
  title: localizedStringSchema,
  description: localizedStringSchema.optional(),
  speakers: z.array(z.string()).default([]),
  moderator: z.string().optional(),
});

export const programSchema = z.object({
  updatedAt: z.string(),
  note: localizedStringSchema,
  sessions: z.array(programSessionSchema),
});

export const architectureSchema = z.object({
  zonesTitle: localizedStringSchema,
  zones: z.array(localizedStringSchema),
  days: z.array(
    z.object({
      id: z.enum(["1", "2"]),
      kicker: localizedStringSchema,
      title: localizedStringSchema,
      blocks: z.array(
        z.object({
          id: z.string(),
          label: localizedStringSchema,
          time: z.string(),
          note: localizedStringSchema.optional(),
          climax: z.boolean().optional(),
          climaxLabel: localizedStringSchema.optional(),
          sessions: z.array(
            z.object({
              name: z.string(),
              linkName: z.string().optional(),
              peak: z.boolean().optional(),
            }),
          ),
        }),
      ),
    }),
  ),
});

export type ForumArchitecture = z.infer<typeof architectureSchema>;

export const speakerSchema = z.object({
  id: z.string(),
  confirmed: z.boolean(),
  name: localizedStringSchema.optional(),
  title: localizedStringSchema.optional(),
  organization: localizedStringSchema.optional(),
  country: localizedStringSchema.optional(),
  bio: localizedStringSchema.optional(),
  photo: z.string().optional(),
  lines: z.array(themeLineSchema).default([]),
  sessionIds: z.array(z.string()).default([]),
});

export const speakersSchema = z.object({
  announceDate: z.string(),
  items: z.array(speakerSchema),
});

export const awardNominationSchema = z.object({
  id: z.string(),
  block: z.enum(["Environment", "Social", "Governance", "Next Generation"]),
  title: localizedStringSchema,
  eligible: localizedStringSchema,
  evaluates: localizedStringSchema,
});

export const awardSchema = z.object({
  statueCaption: localizedStringSchema,
  statueImage: z.string(),
  grandPrix: localizedStringSchema,
  nominations: z.array(awardNominationSchema),
  juryAnnounceDate: z.string().optional(),
});

export const navigationSchema = z.object({
  primary: z.array(
    z.object({
      href: z.string(),
      labelKey: z.string(),
    }),
  ),
});

export const homeContentSchema = z.object({
  hero: z.object({
    supporting: localizedStringSchema,
    image: z.object({
      src: z.string(),
      alt: localizedStringSchema,
    }),
  }),
  whyAttend: z.object({
    eyebrow: localizedStringSchema,
    title: localizedStringSchema,
    items: z.array(
      z.object({
        id: z.string(),
        title: localizedStringSchema,
        text: localizedStringSchema,
        href: z.string(),
      }),
    ),
  }),
  lines: z.object({
    eyebrow: localizedStringSchema,
    title: localizedStringSchema,
    items: z.array(
      z.object({
        id: themeLineSchema,
        title: localizedStringSchema,
        text: localizedStringSchema,
      }),
    ),
  }),
  programPreview: z.object({
    eyebrow: localizedStringSchema,
    title: localizedStringSchema,
  }),
  tickets: z.object({
    eyebrow: localizedStringSchema,
    title: localizedStringSchema,
    guest: z.object({
      title: localizedStringSchema,
      priceLabel: localizedStringSchema,
      perks: localizedStringSchema,
    }),
    delegate: z.object({
      title: localizedStringSchema,
      perks: localizedStringSchema,
    }),
  }),
  awardTeaser: z.object({
    eyebrow: localizedStringSchema,
    title: localizedStringSchema,
    text: localizedStringSchema,
  }),
  youthTeaser: z.object({
    eyebrow: localizedStringSchema,
    title: localizedStringSchema,
    text: localizedStringSchema,
  }),
  guestCountry: z
    .object({
      eyebrow: localizedStringSchema,
      title: localizedStringSchema,
      text: localizedStringSchema,
      href: z.string(),
    })
    .optional(),
  venue: z.object({
    eyebrow: localizedStringSchema,
    title: localizedStringSchema,
    text: localizedStringSchema,
    image: z.object({
      src: z.string(),
      alt: localizedStringSchema,
    }),
    planImage: z
      .object({
        src: z.string(),
        alt: localizedStringSchema,
      })
      .optional(),
    mapUrl: z.string().url(),
  }),
  newsletter: z.object({
    eyebrow: localizedStringSchema,
    title: localizedStringSchema,
    placeholder: localizedStringSchema,
    button: localizedStringSchema,
    success: localizedStringSchema,
  }),
});

export type HomeContent = z.infer<typeof homeContentSchema>;

export const topicsContentSchema = z.object({
  eyebrow: localizedStringSchema,
  title: localizedStringSchema,
  subtitle: localizedStringSchema,
  items: z.array(
    z.object({
      id: z.enum(["standards", "carbon", "ratings", "circular", "region", "ai"]),
      title: localizedStringSchema,
      subtitle: localizedStringSchema,
      paragraphs: z.tuple([localizedStringSchema, localizedStringSchema]),
      sessions: z.array(
        z.object({
          day: z.string(),
          dayLabel: localizedStringSchema,
          time: z.string(),
          hall: localizedStringSchema,
          roomId: z.string(),
          sessionTitle: localizedStringSchema,
          sessionSlug: z.string().nullable(),
        }),
      ),
    }),
  ),
});

export type TopicsContent = z.infer<typeof topicsContentSchema>;
