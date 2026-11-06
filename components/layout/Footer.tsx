import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import type { SiteConfig } from "@/schemas/content";
import { tLocalized } from "@/lib/content";

export async function Footer({
  site,
  locale,
}: {
  site: SiteConfig;
  locale: Locale;
}) {
  const t = await getTranslations("footer");
  const tNav = await getTranslations("nav");
  const phone = site.contact.phone;
  const phoneHref = phone?.replace(/\s+/g, "");
  const emails = site.contact.emails?.length
    ? site.contact.emails
    : [site.contact.email];

  return (
    <footer className="mt-16 border-t border-line bg-deep text-[#f4f1ec]">
      <div className="container-shell grid gap-10 py-12 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="text-xl font-bold">{tLocalized(site.name, locale)}</p>
          <p className="mt-2 text-[#c9d2d8]">{tLocalized(site.slogan, locale)}</p>
          <p className="mt-4 text-sm text-[#9aadb8]">
            {site.dates.day1.slice(8)}–{site.dates.day2.slice(8)}.
            {site.dates.day1.slice(5, 7)}.{site.dates.day1.slice(0, 4)} ·{" "}
            {site.venue.name}, {tLocalized(site.venue.city, locale)}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#9aadb8]">
            {t("organizer")}
          </p>
          <a
            href={site.organizer.url}
            className="mt-3 inline-block font-medium hover:underline"
            rel="noreferrer"
            target="_blank"
          >
            {site.organizer.name}
          </a>
          {site.contact.coordinator ? (
            <div className="mt-4">
              <p className="text-sm text-[#9aadb8]">
                {tLocalized(site.contact.coordinator.role, locale)}
              </p>
              <p className="mt-1 font-medium">
                {tLocalized(site.contact.coordinator.name, locale)}
              </p>
              {phone && phoneHref ? (
                <a
                  href={`tel:${phoneHref}`}
                  className="mt-2 block text-sm text-[#c9d2d8] hover:underline"
                >
                  {phone}
                </a>
              ) : null}
              {emails.map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="mt-1 block text-sm text-[#c9d2d8] hover:underline"
                >
                  {email}
                </a>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-sm text-[#9aadb8]">{site.contact.email}</p>
          )}
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#9aadb8]">
            {t("legal")}
          </p>
          <ul className="mt-3 space-y-2 text-sm">
            <li>
              <Link href="/privacy" className="hover:underline">
                {t("privacy")}
              </Link>
            </li>
            <li>
              <Link href="/consent" className="hover:underline">
                {t("consent")}
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:underline">
                {t("terms")}
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:underline">
                {tNav("contact")}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-shell flex flex-col gap-2 py-4 text-sm text-[#9aadb8] md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.organizer.name}. {t("rights")}
          </p>
          <p>{t("kkReviewNote")}</p>
        </div>
      </div>
    </footer>
  );
}
