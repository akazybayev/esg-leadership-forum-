import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { getNearestDeadline, tLocalized } from "@/lib/content";
import { formatForumDate } from "@/lib/dates";

export function DeadlineBanner({
  locale,
  ctaLabel,
}: {
  locale: Locale;
  ctaLabel: string;
}) {
  const deadline = getNearestDeadline();
  if (!deadline) return null;

  return (
    <div className="border-b border-line bg-deep text-[#f4f1ec]">
      <div className="container-shell flex flex-col gap-2 py-2.5 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-semibold text-accent">
            {formatForumDate(deadline.date, locale)}
          </span>
          <span className="mx-2 text-white/40">·</span>
          {tLocalized(deadline.label, locale)}
        </p>
        <Link href="/register" className="font-semibold text-white underline-offset-4 hover:underline">
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
