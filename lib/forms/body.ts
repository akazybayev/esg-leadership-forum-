import type { FormType } from "@/schemas/forms";

const LOCALES = new Set(["ru", "en", "kk"]);
const CHECKBOX_FIELDS = new Set(["consent", "terms", "payAsLegal"]);

export function isHtmlForm(contentType: string): boolean {
  return contentType.toLowerCase().includes("application/x-www-form-urlencoded");
}

export function parseUrlEncoded(raw: string): Record<string, string> {
  const params = new URLSearchParams(raw);
  const data: Record<string, string> = {};
  for (const [key, value] of params.entries()) {
    if (Object.prototype.hasOwnProperty.call(data, key)) continue;
    data[key] = value;
  }
  return data;
}

export function formLocale(
  fields: Record<string, string>,
  referer: string | null,
): "ru" | "en" | "kk" {
  if (LOCALES.has(fields.locale)) return fields.locale as "ru" | "en" | "kk";
  if (referer) {
    try {
      const first = new URL(referer).pathname.split("/").filter(Boolean)[0];
      if (first && LOCALES.has(first)) return first as "ru" | "en" | "kk";
    } catch {
      // Ignore a referer that is not a URL.
    }
  }
  return "ru";
}

/** Turns a browser form into the shape checked by the shared schema. */
export function normalizeFormFields(
  fields: Record<string, string>,
): Record<string, unknown> {
  const data: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields)) {
    if (key === "locale" || key === "price" || key.startsWith("_")) continue;
    if (CHECKBOX_FIELDS.has(key)) {
      data[key] = value === "on" || value === "true" || value === "yes";
      continue;
    }
    data[key] = value;
  }
  return data;
}

const RETURN_PATH: Record<FormType, string> = {
  register: "/register",
  award: "/award",
  "youth-delegate": "/youth",
  "youth-pitch": "/youth",
  expo: "/expo",
  partners: "/partners",
  "guest-country": "/guest-country",
  media: "/media",
  contact: "/contact",
  newsletter: "/",
};

export function formReturnPath(type: FormType, locale: string): string {
  const path = RETURN_PATH[type];
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}
