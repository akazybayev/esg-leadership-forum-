import { z } from "zod";

const honeypot = z.string().optional();
const email = z.string().trim().email();
const nonEmpty = z.string().trim().min(1).max(500);
const longText = z.string().trim().min(1).max(5000);
const optionalText = z.string().trim().max(5000).optional().or(z.literal(""));
const phone = z
  .string()
  .trim()
  .max(40)
  .optional()
  .or(z.literal(""))
  .refine((v) => !v || /^[+0-9()\-\s]{6,}$/.test(v), "Invalid phone");

export const formTypes = [
  "register",
  "award",
  "youth-delegate",
  "youth-pitch",
  "expo",
  "partners",
  "guest-country",
  "media",
  "contact",
  "newsletter",
] as const;

export type FormType = (typeof formTypes)[number];

const optionalShort = z.string().trim().max(200).optional().or(z.literal(""));

export const registerFormSchema = z
  .object({
    company_website: honeypot,
    status: z.enum(["guest", "delegate"]),
    name: nonEmpty,
    organization: optionalShort,
    title: optionalShort,
    country: nonEmpty,
    email,
    phone,
    category: z.string().trim().max(100).optional().or(z.literal("")),
    lines: z.string().trim().max(100).optional().or(z.literal("")),
    promo: z.string().trim().max(80).optional().or(z.literal("")),
    invoice: optionalText,
    payAsLegal: z.boolean().optional(),
    consent: z.literal(true),
    terms: z.boolean().optional(),
  })
  .superRefine((value, ctx) => {
    if (value.status !== "delegate") return;
    for (const key of ["organization", "title", "category"] as const) {
      const field = value[key];
      if (typeof field !== "string" || field.trim().length === 0) {
        ctx.addIssue({
          code: "custom",
          path: [key],
          message: "Required",
        });
      }
    }
    if (!value.terms) {
      ctx.addIssue({
        code: "custom",
        path: ["terms"],
        message: "Required",
      });
    }
  });

export const awardFormSchema = z.object({
  company_website: honeypot,
  organization: nonEmpty,
  nomination: nonEmpty,
  project: longText,
  metrics: longText,
  contactName: nonEmpty,
  email,
  disclosure: optionalText,
  documents: optionalText,
});

export const youthDelegateFormSchema = z.object({
  company_website: honeypot,
  name: nonEmpty,
  age: z.coerce.number().int().min(18).max(30),
  org: nonEmpty,
  email,
  motivation: longText,
});

export const youthPitchFormSchema = z.object({
  company_website: honeypot,
  team: nonEmpty,
  track: nonEmpty,
  members: nonEmpty,
  email,
  summary: longText,
  video: z.string().trim().url().optional().or(z.literal("")),
  file: optionalText,
});

export const expoFormSchema = z
  .object({
    company_website: honeypot,
    company: z.string().trim().max(500).optional().or(z.literal("")),
    organization: z.string().trim().max(500).optional().or(z.literal("")),
    contact: nonEmpty,
    email,
    zone: z.string().trim().max(100).optional().or(z.literal("")),
    message: optionalText,
  })
  .refine((v) => Boolean((v.company || "").trim() || (v.organization || "").trim()), {
    message: "Organization required",
    path: ["company"],
  });

export const partnersFormSchema = z.object({
  company_website: honeypot,
  company: nonEmpty,
  level: nonEmpty,
  contact: nonEmpty,
  email,
  message: optionalText,
});

export const guestCountryFormSchema = z.object({
  company_website: honeypot,
  country: nonEmpty,
  organization: nonEmpty,
  contact: nonEmpty,
  email,
  message: optionalText,
});

export const mediaFormSchema = z.object({
  company_website: honeypot,
  outlet: nonEmpty,
  name: nonEmpty,
  email,
  role: nonEmpty,
  note: optionalText,
});

export const contactFormSchema = z.object({
  company_website: honeypot,
  name: nonEmpty,
  email,
  topic: nonEmpty,
  message: longText,
});

export const newsletterFormSchema = z.object({
  company: honeypot,
  email,
});

export const formSchemaByType = {
  register: registerFormSchema,
  award: awardFormSchema,
  "youth-delegate": youthDelegateFormSchema,
  "youth-pitch": youthPitchFormSchema,
  expo: expoFormSchema,
  partners: partnersFormSchema,
  "guest-country": guestCountryFormSchema,
  media: mediaFormSchema,
  contact: contactFormSchema,
  newsletter: newsletterFormSchema,
} as const;

export type RegisterFormValues = z.infer<typeof registerFormSchema>;
