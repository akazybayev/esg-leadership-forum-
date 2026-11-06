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
          <details className="relative lg:hidden">
            <summary className="inline-flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full border border-line [&::-webkit-details-marker]:hidden">
              <Menu size={18} />
              <span className="sr-only">{t("menu")}</span>
            </summary>
            <nav
              id="mobile-nav"
              className="absolute right-0 top-12 z-50 w-64 border border-line bg-paper p-2 shadow-lg"
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
              <Link href="/register" className="btn btn-primary mt-2 w-full">
                {tCta("register")}
              </Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
