"use client";

import { useLocale, useTranslations } from "next-intl";
import { CalendarPlus } from "lucide-react";
import type { Locale } from "@/i18n/routing";
import { downloadSessionIcs } from "@/lib/calendar";
import type { ProgramSession } from "@/lib/program-types";

export function AddToCalendarButton({ session }: { session: ProgramSession }) {
  const locale = useLocale() as Locale;
  const t = useTranslations("program");

  return (
    <button
      type="button"
      className="btn btn-deep"
      onClick={() => downloadSessionIcs(session, locale)}
    >
      <CalendarPlus size={16} />
      {t("addToCalendar")}
    </button>
  );
}
