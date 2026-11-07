import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { NewsletterForm } from "@/components/home/NewsletterForm";
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
              {emails.slice(0, 1).map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="mt-1 block text-sm text-[#c9d2d8] hover:underline"
                >
                  {email}
                </a>
              ))}
              <div className="mt-3 flex gap-3">
                <a
                  href="https://wa.me/77015552576"
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/20"
                  aria-label={t("whatsapp")}
                  target="_blank"
                  rel="noreferrer"
                >
                  <WhatsAppIcon />
                </a>
                <a
                  href="https://t.me/esg_school"
                  className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/20"
                  aria-label={t("telegram")}
                  target="_blank"
                  rel="noreferrer"
                >
                  <TelegramIcon />
                </a>
              </div>
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
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.14em] text-[#9aadb8]">
            {t("newsletter")}
          </p>
          <NewsletterForm
            id="footer-newsletter-email"
            placeholder={t("newsletterPlaceholder")}
            button={t("newsletterButton")}
            success={t("newsletterSuccess")}
          />
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-shell flex flex-col gap-2 py-4 text-sm text-[#9aadb8] md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.organizer.name}. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M20.5 3.5A11 11 0 0 0 2.1 17.2L1 23l5.9-1.1A11 11 0 0 0 20.5 3.5zM12 20.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3.5.7.7-3.4-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.5.1-.2a.5.5 0 0 0 0-.5c0-.1-.5-1.3-.7-1.7s-.4-.4-.5-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 11.8 11.8 0 0 0 4.5 4 15 15 0 0 0 1.5.6 3.6 3.6 0 0 0 1.7.1 2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.2-.2-.4-.3z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M21.8 4.2 2.9 11.5c-1.3.5-1.3 1.2-.2 1.5l4.8 1.5 11.1-7c.5-.3 1-.1.6.2l-9 8.1-.3 4.8c.5 0 .7-.2 1-.5l2.4-2.3 5 3.7c.9.5 1.6.2 1.8-.9l3.3-15.4c.3-1.3-.5-1.9-1.6-1.4z" />
    </svg>
  );
}
