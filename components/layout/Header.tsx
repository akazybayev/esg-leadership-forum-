"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
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
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-[rgba(244,241,236,0.92)] backdrop-blur-md">
      <div className="container-shell flex items-center justify-between gap-4 py-3">
        <Link href="/" className="max-w-[14rem] text-sm font-bold leading-tight text-deep sm:max-w-none sm:text-base">
          {siteName}
        </Link>

        <nav className="hidden items-center gap-4 lg:flex" aria-label="Primary">
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
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? t("close") : t("menu")}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open ? (
        <div id="mobile-nav" className="border-t border-line bg-paper lg:hidden">
          <nav className="container-shell flex flex-col gap-1 py-3" aria-label="Mobile">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-3 text-base font-medium text-ink"
                onClick={() => setOpen(false)}
              >
                {t(item.labelKey)}
              </Link>
            ))}
            <Link
              href="/register"
              className="btn btn-primary mt-2"
              onClick={() => setOpen(false)}
            >
              {tCta("register")}
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
