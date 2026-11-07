import { NextResponse } from "next/server";
import { formTypes, type FormType } from "@/schemas/forms";
import { processFormSubmission } from "@/lib/forms/submit";
import { requestIsSameOrigin } from "@/lib/forms/origin";
import { checkRateLimit, clientAddress } from "@/lib/forms/rate-limit";
import {
  formLocale,
  formReturnPath,
  isHtmlForm,
  normalizeFormFields,
  parseUrlEncoded,
} from "@/lib/forms/body";

const MAX_BODY_CHARS = 12_000;

function declaredBodyIsTooLarge(request: Request, maxBytes: number): boolean {
  const declared = request.headers.get("content-length");
  if (declared === null) return false;
  if (!/^\d+$/.test(declared.trim())) return true;
  const size = Number(declared);
  return !Number.isSafeInteger(size) || size > maxBytes;
}

async function readLimited(request: Request, maxBytes: number): Promise<string | null> {
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > maxBytes) {
        await reader.cancel();
        return null;
      }
      chunks.push(value);
    }
  } finally {
    try {
      reader.releaseLock();
    } catch {
      // Cancel already released the reader.
    }
  }
  const body = new Uint8Array(bytes);
  let offset = 0;
  for (const chunk of chunks) {
    body.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(body);
}

export const runtime = "nodejs";

function isFormType(value: string): value is FormType {
  return (formTypes as readonly string[]).includes(value);
}

function htmlPage(locale: string, title: string, message: string, backHref: string) {
  const back = locale === "en" ? "Back" : locale === "kk" ? "Артқа" : "Назад";
  const safeTitle = title.replace(/[<>&]/g, "");
  const safeMessage = message.replace(/[<>&]/g, "");
  return `<!DOCTYPE html><html lang="${locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${safeTitle}</title></head><body style="font-family:sans-serif;max-width:36rem;margin:4rem auto;padding:0 1rem"><h1>${safeTitle}</h1><p>${safeMessage}</p><p><a href="${backHref}">${back}</a></p></body></html>`;
}

const COPY = {
  ru: {
    refused: ["Отправка отклонена", "Заявку можно отправить только с этого сайта."],
    limited: ["Слишком много заявок", "Попробуйте позже."],
    large: ["Заявка слишком большая", "Сократите текст и отправьте еще раз."],
    invalid: ["Проверьте форму", "Заполните обязательные поля и отправьте еще раз."],
    promo: ["Промокод не принят", "Укажите верный код или оставьте поле пустым."],
    failed: ["Заявка не принята", "Напишите на forum@esgpartners.kz."],
  },
  en: {
    refused: ["Submission refused", "An application can be sent only from this site."],
    limited: ["Too many applications", "Please try again later."],
    large: ["Application is too large", "Shorten the text and send it again."],
    invalid: ["Check the form", "Fill in the required fields and send it again."],
    promo: ["Promo code was not accepted", "Enter a valid code or leave the field empty."],
    failed: ["Application was not accepted", "Write to forum@esgpartners.kz."],
  },
  kk: {
    refused: ["Жіберу қабылданбады", "Өтінімді тек осы сайттан жіберуге болады."],
    limited: ["Өтінім тым көп", "Кейінірек қайталап көріңіз."],
    large: ["Өтінім тым үлкен", "Мәтінді қысқартып, қайта жіберіңіз."],
    invalid: ["Форманы тексеріңіз", "Міндетті өрістерді толтырып, қайта жіберіңіз."],
    promo: ["Промокод қабылданбады", "Дұрыс кодты жазыңыз немесе өрісті бос қалдырыңыз."],
    failed: ["Өтінім қабылданбады", "forum@esgpartners.kz адресіне жазыңыз."],
  },
} as const;

function reply(
  html: boolean,
  locale: "ru" | "en" | "kk",
  status: number,
  key: keyof (typeof COPY)["ru"],
  backHref: string,
  extraHeaders?: Record<string, string>,
) {
  const [title, message] = COPY[locale][key];
  if (!html) {
    return NextResponse.json(
      { error: message },
      { status, headers: extraHeaders },
    );
  }
  return new NextResponse(htmlPage(locale, title, message, backHref), {
    status,
    headers: {
      "content-type": "text/html; charset=utf-8",
      ...extraHeaders,
    },
  });
}

export async function POST(
  request: Request,
  context: { params: Promise<{ type: string }> },
) {
  const { type: rawType } = await context.params;
  const contentType = request.headers.get("content-type") || "";
  const html = isHtmlForm(contentType);
  const locale = formLocale({}, request.headers.get("referer"));
  const backHref = isFormType(rawType) ? formReturnPath(rawType, locale) : `/${locale}`;

  if (!isFormType(rawType)) {
    return NextResponse.json({ error: "Unknown form type" }, { status: 404 });
  }

  if (contentType.toLowerCase().includes("multipart/form-data")) {
    return reply(html, locale, 415, "large", backHref);
  }

  if (!requestIsSameOrigin(request)) {
    return reply(html, locale, 403, "refused", backHref);
  }

  if (declaredBodyIsTooLarge(request, MAX_BODY_CHARS)) {
    return reply(html, locale, 413, "large", backHref);
  }

  const limited = await checkRateLimit(clientAddress(request));
  if (!limited.ok) {
    return reply(html, locale, 429, "limited", backHref, {
      "Retry-After": String(limited.retryAfterSec),
    });
  }

  let payload: unknown;
  let fields: Record<string, string> = {};
  try {
    const raw = await readLimited(request, MAX_BODY_CHARS);
    if (raw === null) {
      return reply(html, locale, 413, "large", backHref);
    }
    if (html) {
      fields = parseUrlEncoded(raw);
      payload = normalizeFormFields(fields);
    } else {
      payload = JSON.parse(raw);
    }
  } catch {
    return reply(html, locale, 400, "invalid", backHref);
  }

  const pageLocale = formLocale(fields, request.headers.get("referer"));
  const pageBack = formReturnPath(rawType, pageLocale);
  const result = await processFormSubmission(rawType, payload);
  if (!result.ok) {
    const key = result.error === "Promo code is not valid" ? "promo" : result.status === 429 ? "limited" : result.status >= 500 ? "failed" : "invalid";
    return reply(html, pageLocale, result.status, key, pageBack);
  }

  if (html) {
    return NextResponse.redirect(new URL(`/${pageLocale}/received`, request.url), 303);
  }

  return NextResponse.json({
    ok: true,
    id: result.id,
    invoice: result.invoice ?? null,
  });
}
