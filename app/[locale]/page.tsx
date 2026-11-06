import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Countdown } from "@/components/home/Countdown";
import { DeadlineBanner } from "@/components/home/DeadlineBanner";
import { EmptyAnnounce } from "@/components/home/EmptyAnnounce";
import { NewsletterForm } from "@/components/home/NewsletterForm";
import {
  getAward,
  getDelegatePriceUsd,
  getHeadlineSessions,
  getHomeContent,
  getSiteConfig,
  getSpeakers,
  getSponsors,
  tLocalized,
} from "@/lib/content";
import { daysUntil, formatForumDate } from "@/lib/dates";
import { pageMetadata } from "@/lib/page-meta";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMetadata(locale, "home");
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);

  const t = await getTranslations("cta");
  const tHome = await getTranslations("home");
  const tStatus = await getTranslations("status");
  const tCountdown = await getTranslations("countdown");

  const site = getSiteConfig();
  const home = getHomeContent();
  const award = getAward();
  const speakers = getSpeakers();
  const sponsors = getSponsors();
  const headlines = getHeadlineSessions();
  const pricing = getDelegatePriceUsd();
  const earlyDays = daysUntil(site.dates.earlyBirdEnds);

  const stats = [
    { value: String(site.scale.days), label: tHome("statsDays") },
    { value: String(site.scale.participants), label: tHome("statsParticipants") },
    { value: site.scale.countries, label: tHome("statsCountries") },
    { value: String(site.scale.youthDelegates), label: tHome("statsYouth") },
    {
      value: String(site.scale.awardNominations),
      label: tHome("statsNominations"),
    },
  ];

  return (
    <div>
      <DeadlineBanner locale={locale} ctaLabel={t("register")} />

      <section className="relative min-h-[100svh] overflow-hidden">
        <Image
          src={home.hero.image.src}
          alt={tLocalized(home.hero.image.alt, locale)}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,31,42,0.88)_0%,rgba(11,31,42,0.62)_48%,rgba(11,31,42,0.28)_100%)]" />
        <div className="container-shell relative flex min-h-[100svh] flex-col justify-end gap-8 pb-14 pt-28">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#e2b79a]">
              {formatForumDate(site.dates.day1, locale, {
                day: "numeric",
                month: "short",
              })}
              –
              {formatForumDate(site.dates.day2, locale, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}{" "}
              · {site.venue.name}
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.02] tracking-tight text-white md:text-6xl lg:text-7xl">
              {tLocalized(site.name, locale)}
            </h1>
            <p className="mt-4 text-2xl font-medium text-[#f0d2bc] md:text-3xl">
              {tLocalized(site.slogan, locale)}
            </p>
            <p className="mt-5 max-w-xl text-base text-white/80 md:text-lg">
              {tLocalized(home.hero.supporting, locale)}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/register" className="btn btn-primary">
                {t("register")}
              </Link>
              <Link
                href="/partners"
                className="btn border border-white/35 bg-white/10 text-white hover:bg-white/20"
              >
                {t("becomePartner")}
              </Link>
            </div>
          </div>
          <div className="max-w-xl">
            <Countdown
              targetDate={site.dates.day1}
              labels={{
                days: tCountdown("days"),
                hours: tCountdown("hours"),
                minutes: tCountdown("minutes"),
                seconds: tCountdown("seconds"),
              }}
            />
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-deep text-white">
        <div className="container-shell grid grid-cols-2 gap-6 py-8 md:grid-cols-5">
          {stats.map((item) => (
            <div key={item.label}>
              <p className="text-3xl font-bold tracking-tight md:text-4xl">
                {item.value}
              </p>
              <p className="mt-1 text-sm text-white/65">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell py-16 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
          {tLocalized(home.whyAttend.eyebrow, locale)}
        </p>
        <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-deep md:text-5xl">
          {tLocalized(home.whyAttend.title, locale)}
        </h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {home.whyAttend.items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="group border-t border-line pt-5 transition hover:border-accent"
            >
              <h3 className="text-xl font-bold text-deep group-hover:text-accent">
                {tLocalized(item.title, locale)}
              </h3>
              <p className="mt-3 text-ink-soft">
                {tLocalized(item.text, locale)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-white/40 py-16 md:py-20">
        <div className="container-shell">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
            {tLocalized(home.lines.eyebrow, locale)}
          </p>
          <h2 className="mt-3 max-w-4xl text-3xl font-bold tracking-tight text-deep md:text-5xl">
            {tLocalized(home.lines.title, locale)}
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-5">
            {home.lines.items.map((item) => (
              <Link
                key={item.id}
                href={`/program?line=${item.id}`}
                className="border border-line bg-paper px-4 py-5 transition hover:border-deep"
              >
                <p className="text-sm font-semibold uppercase tracking-[0.14em] text-accent">
                  {tLocalized(item.title, locale)}
                </p>
                <p className="mt-3 text-sm text-ink-soft">
                  {tLocalized(item.text, locale)}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell py-16 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
          {tLocalized(home.agenda.eyebrow, locale)}
        </p>
        <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-deep md:text-5xl">
          {tLocalized(home.agenda.title, locale)}
        </h2>
        <ul className="mt-10 divide-y divide-line border-y border-line">
          {home.agenda.items.map((item) => (
            <li key={item.id}>
              <Link
                href={`/program?${item.query}`}
                className="flex items-center justify-between gap-4 py-4 text-lg font-medium text-deep transition hover:text-accent md:text-xl"
              >
                <span>{tLocalized(item.title, locale)}</span>
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="border-y border-line bg-white/40 py-16 md:py-20">
        <div className="container-shell">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
                {tHome("speakersEyebrow")}
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-deep md:text-5xl">
                {tHome("speakersTitle")}
              </h2>
            </div>
            <Link href="/speakers" className="btn btn-secondary">
              {t("allSpeakers")}
            </Link>
          </div>
          <div className="mt-8">
            {speakers.items.length === 0 ? (
              <EmptyAnnounce
                message={tStatus("comingSoon", {
                  date: formatForumDate(speakers.announceDate, locale),
                })}
              />
            ) : null}
          </div>
        </div>
      </section>

      <section className="container-shell py-16 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
          {tLocalized(home.programPreview.eyebrow, locale)}
        </p>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h2 className="max-w-3xl text-3xl font-bold tracking-tight text-deep md:text-5xl">
            {tLocalized(home.programPreview.title, locale)}
          </h2>
          <Link href="/program" className="btn btn-deep">
            {t("viewProgram")}
          </Link>
        </div>
        <div className="mt-10 grid gap-10 md:grid-cols-2">
          {(
            [
              ["day1", headlines.day1],
              ["day2", headlines.day2],
            ] as const
          ).map(([key, sessions]) => (
            <div key={key}>
              <h3 className="text-lg font-bold text-deep">{tHome(key)}</h3>
              <ul className="mt-4 space-y-4">
                {sessions.map((session) => (
                  <li key={session.id} className="border-t border-line pt-4">
                    <p className="text-sm font-semibold text-accent">
                      {session.start}–{session.end} · {session.room}
                    </p>
                    <p className="mt-1 font-medium text-ink">
                      {tLocalized(session.title, locale)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-ink-soft">{tStatus("timezone")}</p>
      </section>

      {home.guestCountry ? (
        <section className="container-shell py-16 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
            {tLocalized(home.guestCountry.eyebrow, locale)}
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-deep md:text-5xl">
            {tLocalized(home.guestCountry.title, locale)}
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">
            {tLocalized(home.guestCountry.text, locale)}
          </p>
          <Link
            href={home.guestCountry.href}
            className="btn btn-deep mt-8 inline-flex"
          >
            {tHome("guestCountryCta")}
          </Link>
        </section>
      ) : null}

      <section className="border-y border-line bg-deep py-16 text-white md:py-20">
        <div className="container-shell">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#e2b79a]">
            {tLocalized(home.tickets.eyebrow, locale)}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-5xl">
            {tLocalized(home.tickets.title, locale)}
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="border border-white/15 bg-white/5 p-6">
              <h3 className="text-2xl font-bold">
                {tLocalized(home.tickets.guest.title, locale)}
              </h3>
              <p className="mt-3 text-3xl font-bold text-[#e2b79a]">
                {tLocalized(home.tickets.guest.priceLabel, locale)}
              </p>
              <p className="mt-4 text-white/75">
                {tLocalized(home.tickets.guest.perks, locale)}
              </p>
              <Link href="/register" className="btn btn-primary mt-6">
                {t("register")}
              </Link>
            </div>
            <div className="border border-white/15 bg-white/5 p-6">
              <h3 className="text-2xl font-bold">
                {tLocalized(home.tickets.delegate.title, locale)}
              </h3>
              <p className="mt-3 text-3xl font-bold text-[#e2b79a]">
                {pricing.amount} USD
              </p>
              <p className="mt-2 text-sm text-white/65">
                {pricing.isEarly
                  ? tStatus("earlyBirdLeft", { days: earlyDays })
                  : tStatus("earlyBirdEnded")}
              </p>
              <p className="mt-4 text-white/75">
                {tLocalized(home.tickets.delegate.perks, locale)}
              </p>
              <Link href="/register" className="btn btn-primary mt-6">
                {t("register")}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell grid gap-10 py-16 md:grid-cols-[0.9fr_1.1fr] md:items-center md:py-20">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
            {tLocalized(home.awardTeaser.eyebrow, locale)}
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-deep md:text-5xl">
            {tLocalized(home.awardTeaser.title, locale)}
          </h2>
          <p className="mt-4 max-w-xl text-lg text-ink-soft">
            {tLocalized(home.awardTeaser.text, locale)}
          </p>
          <p className="mt-3 text-sm font-medium text-deep">
            {formatForumDate(site.dates.awardOpen, locale)} —{" "}
            {formatForumDate(site.dates.awardClose, locale)}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/award" className="btn btn-primary">
              {t("applyAward")}
            </Link>
            <p className="self-center text-sm text-ink-soft">
              {award.nominations.length} · {tLocalized(award.grandPrix, locale)}
            </p>
          </div>
        </div>
        <div className="relative aspect-[5/6] overflow-hidden bg-paper-2">
          <Image
            src={award.statueImage}
            alt={tLocalized(award.statueCaption, locale)}
            fill
            className="object-contain p-4"
            sizes="(max-width: 768px) 100vw, 45vw"
          />
        </div>
      </section>

      <section className="border-y border-line bg-white/40 py-16 md:py-20">
        <div className="container-shell">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
            {tLocalized(home.youthTeaser.eyebrow, locale)}
          </p>
          <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-deep md:text-5xl">
            {tLocalized(home.youthTeaser.title, locale)}
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">
            {tLocalized(home.youthTeaser.text, locale)}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/youth" className="btn btn-deep">
              {t("applyYouth")}
            </Link>
            <Link href="/youth" className="btn btn-secondary">
              {t("applyPitch")}
            </Link>
          </div>
        </div>
      </section>

      <section className="container-shell py-16 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
          {tHome("partnersEyebrow")}
        </p>
        <h2 className="mt-3 text-3xl font-bold tracking-tight text-deep md:text-5xl">
          {tHome("partnersTitle")}
        </h2>
        <div className="mt-8 space-y-6">
          {sponsors.levels.map((level) => (
            <div key={level.id}>
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink-soft">
                {tLocalized(level.title, locale)}
              </h3>
              {level.logos.length === 0 ? (
                <div className="mt-3">
                  <EmptyAnnounce
                    message={tStatus("comingSoon", {
                      date: formatForumDate(sponsors.announceDate, locale),
                    })}
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-white/40 py-16 md:py-20">
        <div className="container-shell grid gap-10 md:grid-cols-2 md:items-center">
          <div className="relative aspect-[16/10] overflow-hidden bg-paper-2">
            <Image
              src={home.venue.image.src}
              alt={tLocalized(home.venue.image.alt, locale)}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
              {tLocalized(home.venue.eyebrow, locale)}
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-deep md:text-5xl">
              {tLocalized(home.venue.title, locale)}
            </h2>
            <p className="mt-4 text-lg text-ink-soft">
              {tLocalized(home.venue.text, locale)}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/attendees" className="btn btn-deep">
                {t("venueDetails")}
              </Link>
              <Link href="/expo" className="btn btn-secondary">
                ESG Expo
              </Link>
              <a
                href={home.venue.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary"
              >
                {t("openMap")}
              </a>
            </div>
          </div>
        </div>
        {home.venue.planImage ? (
          <div className="container-shell mt-10">
            <div className="overflow-hidden border border-line bg-white">
              <div className="relative aspect-[16/9] w-full bg-paper-2">
                <Image
                  src={home.venue.planImage.src}
                  alt={tLocalized(home.venue.planImage.alt, locale)}
                  fill
                  className="object-contain object-top p-2 md:p-4"
                  sizes="100vw"
                />
              </div>
            </div>
          </div>
        ) : null}
      </section>

      <section className="container-shell py-16 md:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
          {tLocalized(home.newsletter.eyebrow, locale)}
        </p>
        <h2 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight text-deep md:text-5xl">
          {tLocalized(home.newsletter.title, locale)}
        </h2>
        <NewsletterForm
          placeholder={tLocalized(home.newsletter.placeholder, locale)}
          button={tLocalized(home.newsletter.button, locale)}
          success={tLocalized(home.newsletter.success, locale)}
        />
      </section>
    </div>
  );
}
