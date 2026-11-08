"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function MobileRegisterBar({ label }: { label: string }) {
  const t = useTranslations("cta");

  return (
    <div
      className="mobile-register fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[rgba(11,31,42,0.96)] px-3 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
      role="region"
      aria-label={label}
    >
      <Link href="/register" className="btn btn-primary w-full">
        {t("register")}
      </Link>
    </div>
  );
}
