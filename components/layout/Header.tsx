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
    <header className="sticky top-0 z-40 border-b border-line bg-[rgba(244,241,236,0.92)] backdrop-blur-md">
      <div className="container-shell flex items-center justify-between gap-4 py-3">
        <Link
          href="/"
          className="max-w-[14rem] text-sm font-bold leading-tight text-deep sm:max-w-none sm:text-base"
        >
          {siteName}
        </Link>

        <nav
          className="hidden items-center gap-4 lg:flex"
          aria-label={tA11y("primaryNav")}
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink-soft transition hover:text-ink"
            >
              {t(item.labelKey)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Link href="/register" className="btn btn-primary hidden sm:inline-flex">
            {tCta("register")}
          </Link>
          <details className="lg:hidden">
            <summary className="inline-flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-line [&::-webkit-details-marker]:hidden">
              <Menu size={18} />
              <span className="sr-only">{t("menu")}</span>
            </summary>
            <div className="fixed inset-x-0 bottom-0 top-16 z-50 flex flex-col bg-paper">
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
              <div className="sticky bottom-0 border-t border-line bg-paper p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                <Link href="/register" className="btn btn-primary w-full">
                  {tCta("register")}
                </Link>
              </div>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
