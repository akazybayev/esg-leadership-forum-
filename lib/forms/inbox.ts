import type { FormType } from "@/schemas/forms";

/** Temporary inbox until applications move to the forum mailbox. */
export const INBOX_EMAIL = "akazybayev@gmail.com";

export const INBOX_FORM_ACTION = `https://formsubmit.co/${INBOX_EMAIL}`;

const SUBJECTS: Record<FormType, string> = {
  register: "Регистрация",
  award: "Заявка ESG Award",
  "youth-delegate": "Молодежный делегат",
  "youth-pitch": "Youth Impact Pitch",
  expo: "Выставка",
  partners: "Партнерство",
  "guest-country": "Страна-гость",
  media: "Аккредитация СМИ",
  contact: "Сообщение",
  newsletter: "Рассылка",
};

export function inboxSubject(type: FormType): string {
  return `ESG Leadership Forum 2027 — ${SUBJECTS[type]}`;
}

function siteOrigin(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "";
  if (
    raw.startsWith("https://") &&
    !raw.includes("localhost") &&
    !raw.includes("127.0.0.1")
  ) {
    return raw;
  }
  return "https://esg-leadership-forum.apps.grok.bot";
}

export function receivedPageUrl(locale: string): string {
  return `${siteOrigin()}/${locale}/received`;
}

function asText(value: unknown): string | undefined {
  if (typeof value === "boolean") return value ? "yes" : "no";
  if (typeof value === "number" && Number.isFinite(value)) return String(value);
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : undefined;
  }
  return undefined;
}

export async function deliverToInbox(input: {
  type: FormType;
  fields: Record<string, unknown>;
  extra?: Record<string, string>;
}): Promise<{ ok: true } | { ok: false }> {
  const body: Record<string, string> = {
    _subject: inboxSubject(input.type),
    _template: "table",
    _captcha: "false",
    form_type: input.type,
  };

  for (const [key, value] of Object.entries(input.fields)) {
    if (key === "company_website") continue;
    if (input.type === "newsletter" && key === "company") continue;
    if (key.startsWith("_")) continue;
    const text = asText(value);
    if (text) body[key] = text;
  }
  if (input.extra) Object.assign(body, input.extra);

  try {
    const response = await fetch(
      `https://formsubmit.co/ajax/${INBOX_EMAIL}`,
      {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(12_000),
      },
    );
    if (!response.ok) return { ok: false };
    const data = (await response.json().catch(() => null)) as {
      success?: string | boolean;
    } | null;
    if (data && String(data.success) === "false") return { ok: false };
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
