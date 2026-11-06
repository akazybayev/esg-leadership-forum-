"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { locales, type Locale } from "@/i18n/routing";

const labels: Record<Locale, string> = {
  ru: "RU",
  en: "EN",
  kk: "KK",
};

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Language">
      {locales.map((code) => {
        const active = code === locale;
        return (
          <button
            key={code}
            type="button"
            className={`min-h-9 min-w-9 rounded-full px-2 text-sm font-semibold transition ${
              active
                ? "bg-deep text-white"
                : "text-ink-soft hover:bg-white/70 hover:text-ink"
            }`}
            aria-current={active ? "true" : undefined}
            onClick={() => router.replace(pathname, { locale: code })}
          >
            {labels[code]}
          </button>
        );
      })}
    </div>
  );
}
