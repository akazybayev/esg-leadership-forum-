"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function MobileRegisterBar() {
  const t = useTranslations("cta");

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-[rgba(244,241,236,0.96)] p-3 backdrop-blur md:hidden">
      <Link href="/register" className="btn btn-primary w-full">
        {t("register")}
      </Link>
    </div>
  );
}
