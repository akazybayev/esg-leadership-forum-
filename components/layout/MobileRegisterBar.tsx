"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function MobileRegisterBar({ label }: { label: string }) {
  const t = useTranslations("cta");
  const [away, setAway] = useState(true);

  useEffect(() => {
    const targets = ["#top", "#tiers"]
      .map((selector) => document.querySelector(selector))
      .filter((node): node is Element => node instanceof Element);
    const bar = document.querySelector(".mobile-register");
    const seen = new Map<Element, boolean>();

    const applyHeight = () => {
      if (!(bar instanceof HTMLElement)) return;
      const height = bar.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--register-bar", `${Math.ceil(height)}px`);
    };

    if (targets.length === 0) setAway(false);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) seen.set(entry.target, entry.isIntersecting);
        setAway([...seen.values()].some(Boolean));
      },
      { threshold: 0.12 },
    );

    for (const target of targets) {
      seen.set(target, true);
      observer.observe(target);
    }

    applyHeight();
    window.addEventListener("resize", applyHeight);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", applyHeight);
    };
  }, []);

  return (
    <div
      className={away ? "mobile-register is-away" : "mobile-register"}
      role="region"
      aria-label={label}
      aria-hidden={away}
    >
      <Link href="/register" className="btn btn-primary w-full" tabIndex={away ? -1 : undefined}>
        {t("register")}
      </Link>
    </div>
  );
}
