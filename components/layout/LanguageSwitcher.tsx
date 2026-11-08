"use client";

import { useLocale } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";

const labels: Record<Locale, string> = {
  ru: "RU",
  en: "EN",
  kk: "KK",
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Language">
      {locales.map((code) => {
        const active = code === locale;
        return (
          <Link
            key={code}
            href={pathname}
            locale={code}
            hrefLang={code}
            className="lang-link inline-flex min-h-11 min-w-11 items-center justify-center px-1"
            aria-current={active ? "true" : undefined}
          >
            {labels[code]}
          </Link>
        );
      })}
    </div>
  );
}
