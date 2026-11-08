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
    <div className="bg-[var(--color-gold)] text-[var(--color-deep)]">
      <div className="container-shell flex flex-col gap-1 py-2 text-center text-sm font-extrabold sm:flex-row sm:items-center sm:justify-between sm:text-left">
        <p>
          {formatForumDate(deadline.date, locale)}
          {" · "}
          {tLocalized(deadline.label, locale)}
        </p>
        <Link href="/register" className="deadline-cta inline-flex min-h-11 items-center justify-center underline-offset-4 hover:underline">
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
