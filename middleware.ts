import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales, type Locale } from "./i18n/routing";

function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

function localeFromPath(pathname: string): Locale | null {
  const segment = pathname.split("/")[1];
  return isLocale(segment) ? segment : null;
}

function localeFromAcceptLanguage(header: string | null): Locale {
  if (!header) return defaultLocale;
  const tags = header
    .split(",")
    .map((part) => part.split(";")[0]?.trim().toLowerCase());
  for (const tag of tags) {
    if (!tag) continue;
    const base = tag.split("-")[0];
    if (base === "kk") return "kk";
    if (base === "en") return "en";
    if (base === "ru") return "ru";
  }
  return defaultLocale;
}

/**
 * Locale redirect only. next-intl's middleware copies every request header
 * into `x-middleware-request-*` response headers. The host rejects that
 * response (non-ASCII geo headers, oversized cookies) with
 * MIDDLEWARE_INVOCATION_FAILED, so this middleware never overrides headers.
 */
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (localeFromPath(pathname)) {
    return NextResponse.next();
  }

  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value;
  const locale = isLocale(cookieLocale)
    ? cookieLocale
    : localeFromAcceptLanguage(request.headers.get("accept-language"));

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/", "/(ru|en|kk)/:path*", "/((?!api|_next|_vercel|.*\\..*).*)"],
};
