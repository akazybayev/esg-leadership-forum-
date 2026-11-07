"use client";

import { useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";

type NavItem = { href: string; labelKey: string };

export function Header({
  siteName,
  items,
}: {
  siteName: string;
  items: NavItem[];
}) {
  const t = useTranslations("nav");
  const tCta = useTranslations("cta");
  const tA11y = useTranslations("a11y");

  return (
    <header className="sticky top-0 z-40">
      <div className="border-b border-line bg-[rgba(244,241,236,0.92)] backdrop-blur-md">
        <div className="container-shell flex items-center justify-between gap-4 py-2">
        <Link href="/" className="shrink-0">
          <img
            src="/images/brand/forum-logo.png"
            alt={siteName}
            width={551}
            height={542}
            className="h-20 w-auto max-w-none"
          />
        </Link>

        <nav
          className="hidden items-center gap-x-2 xl:flex"
          aria-label={tA11y("primaryNav")}
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-[13px] font-medium text-ink-soft transition hover:text-ink"
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link href="/register" className="btn btn-primary header-register">
            {tCta("register")}
          </Link>
          <span className="inline-block h-10 w-10 xl:hidden" aria-hidden="true" />
        </div>
      </div>
      </div>
      <details className="xl:hidden">
        <summary className="absolute right-4 top-1/2 inline-flex h-10 w-10 -translate-y-1/2 cursor-pointer list-none items-center justify-center rounded-full border border-line bg-paper [&::-webkit-details-marker]:hidden">
          <Menu size={18} />
          <span className="sr-only">{t("menu")}</span>
        </summary>
        <div className="fixed inset-x-0 bottom-0 top-24 z-50 flex flex-col bg-paper">
          <nav
            id="mobile-nav"
            className="flex-1 overflow-y-auto px-4 py-4"
            aria-label={tA11y("mobileNav")}
          >
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-3 text-base font-medium text-ink"
              >
                {t(item.labelKey)}
              </Link>
            ))}
          </nav>
          <div className="border-t border-line bg-paper p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            <Link href="/register" className="btn btn-primary w-full">
              {tCta("register")}
            </Link>
          </div>
        </div>
      </details>
    </header>
  );
}
