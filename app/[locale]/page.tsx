import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { Countdown, PriceClock } from "@/components/home/Countdown";
import { DeadlineBanner } from "@/components/home/DeadlineBanner";
import { FounderQuote } from "@/components/home/FounderQuote";
import { InitiatorPortrait } from "@/components/home/InitiatorPortrait";
import { HorizonImage } from "@/components/home/HorizonImage";
import { TopicAgenda } from "@/components/home/TopicAgenda";
import { ForumArchitecture } from "@/components/program/ForumArchitecture";
import { programDownloads } from "@/lib/program-downloads";
import {
  getAward,
  getDelegatePriceUsd,
  getHomeContent,
  getPartnersContent,
  getSiteConfig,
  getSponsors,
  getTopics,
  getYouth,
  tLocalized,
} from "@/lib/content";
import { delegatePricing, priceRiseAt } from "@/lib/pricing";
import { formatForumDate } from "@/lib/dates";
import { pageMetadata } from "@/lib/page-meta";

const trackClass: Record<string, string> = {
  Lead: "track-lead",
  Finance: "track-finance",
  Planet: "track-planet",
  People: "track-people",
  Region: "track-region",
};

const nominationGroups = [
  "Environment",
  "Social",
  "Governance",
  "Next Generation",
] as const;

function nomClass(block: string) {
  if (block === "Environment") return "nom nom-e";
  if (block === "Social") return "nom nom-s";
  if (block === "Governance") return "nom nom-g";
  return "nom nom-n";
}

function nomGroupClass(block: string) {
  if (block === "Environment") return "nom-group nom-group-e";
  if (block === "Social") return "nom-group nom-group-s";
  if (block === "Governance") return "nom-group nom-group-g";
  return "nom-group nom-group-n";
}

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
  const tProgram = await getTranslations("program");

  const site = getSiteConfig();
  const home = getHomeContent();
  const topics = getTopics();
  const award = getAward();
  const sponsors = getSponsors();
  const partners = getPartnersContent();
  const youth = getYouth();
  const pricing = getDelegatePriceUsd();

  const slogan = tLocalized(site.slogan, locale);
  const splitAt = slogan.indexOf(" ");
  const sloganThin = splitAt > 0 ? slogan.slice(0, splitAt) : slogan;
  const sloganBold = splitAt > 0 ? slogan.slice(splitAt + 1) : "";
  const guestPerks = tHome.raw("guestPerks") as string[];
  const delegatePerks = tHome.raw("delegatePerks") as string[];
  const dateOptions = { day: "numeric", month: "long" } as const;
  const ribbon = pricing.tier === "early" ? tHome("earlyRibbon") : tHome("lateRibbon");
  const packageById = new Map(partners.packages.map((item) => [item.id, item]));
  const general = packageById.get("general");
  const strategic = packageById.get("strategic");
  const theme = packageById.get("theme");
  const announce = tStatus("comingSoon", {
    date: formatForumDate(sponsors.announceDate, locale, dateOptions),
  });

  const stats = [
    { value: String(site.scale.days), label: tHome("statsDays") },
    { value: String(site.scale.participants), label: tHome("statsParticipants") },
    { value: site.scale.countries, label: tHome("statsCountries") },
    { value: String(site.scale.youthDelegates), label: tHome("statsYouth") },
    { value: String(site.scale.awardNominations), label: tHome("statsNominations") },
  ];

  return (
    <div className="home-page">
      <DeadlineBanner locale={locale} ctaLabel={t("register")} />

      <section className="hero-horizon" id="top">
        <HorizonImage
          className="hero-photo"
          src={home.hero.image.src}
          alt={tLocalized(home.hero.image.alt, locale)}
        />
        <div className="hero-layers" aria-hidden="true">
          <svg viewBox="0 0 1440 800" preserveAspectRatio="xMidYMax slice">
            <defs>
              <linearGradient id="horizon-a" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#0F5C5A" stopOpacity="0.55" />
                <stop offset="1" stopColor="#0F5C5A" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="horizon-b" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#1DB380" stopOpacity="0.35" />
                <stop offset="1" stopColor="#1DB380" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="horizon-c" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#E8B04B" stopOpacity="0.22" />
                <stop offset="1" stopColor="#E8B04B" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 560 C 300 500, 600 620, 900 540 S 1300 500, 1440 560 V800 H0Z" fill="url(#horizon-a)" />
            <path d="M0 640 C 260 600, 520 690, 820 630 S 1240 600, 1440 650 V800 H0Z" fill="url(#horizon-b)" />
            <path d="M0 710 C 320 690, 560 740, 900 710 S 1250 690, 1440 720 V800 H0Z" fill="url(#horizon-c)" />
            <g stroke="#F6F1E8" strokeOpacity="0.08" fill="none">
              <path d="M0 500 Q 720 440 1440 500" />
              <path d="M0 470 Q 720 400 1440 470" />
              <path d="M0 440 Q 720 360 1440 440" />
            </g>
          </svg>
        </div>
        <div className="hero-sun" aria-hidden="true" />
        <div className="container-shell hero-copy">
          <p className="hero-date">
            {formatForumDate(site.dates.day1, locale, { day: "numeric" })}
            –
            {formatForumDate(site.dates.day2, locale, {
              day: "numeric",
              month: "long",
              year: "numeric",
            }).replace(/\s*г\.$/u, "")}
            {" · "}
            {site.venue.name}
            {", "}
            {tLocalized(site.venue.complex, locale)}
            {" · "}
            {tLocalized(site.venue.city, locale)}
          </p>
          <h1 className="hero-title">
            <span className="thin">{sloganThin}</span>
            <span className="bold">{sloganBold}</span>
          </h1>
          <p className="hero-sub">{tLocalized(home.hero.supporting, locale)}</p>
          <div className="hero-cta">
            <Link href="/register" className="btn btn-primary">
              {t("register")}
            </Link>
            <a href="#program" className="btn btn-on-dark">
              {t("fullProgram")}
            </a>
            <Link href="/partners" className="btn btn-on-dark">
              {t("becomePartner")}
            </Link>
          </div>
          <Countdown
            targetIso={`${site.dates.day1}T09:30:00+05:00`}
            earlyIso="2027-08-01T00:00:00+05:00"
            earlyLabel={tHome("dayShort")}
            labels={{
              days: tCountdown("days"),
              hours: tCountdown("hours"),
              minutes: tCountdown("minutes"),
              seconds: tCountdown("seconds"),
            }}
          />
        </div>
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[0, 1].map((copy) =>
              topics.items.map((item) => (
                <span key={`${copy}-${item.id}`}>{tLocalized(item.title, locale)}</span>
              )),
            )}
          </div>
        </div>
      </section>

      <section className="light-copy" style={{ background: "var(--color-paper)" }}>
        <div className="container-shell">
          <div className="stat-row">
            {stats.map((item) => (
              <div key={item.label}>
                <b>{item.value}</b>
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell grid gap-8 py-16 md:grid-cols-[minmax(0,240px)_1fr] md:items-center">
        <InitiatorPortrait alt={tHome("initiatorAlt")} />
        <div className="light-copy">
          <p className="eyebrow">{tHome("initiatorEyebrow")}</p>
          <FounderQuote text={tHome("initiatorQuote")} />
          <p className="mt-4 text-sm text-ink-soft">{tHome("initiatorName")}</p>
          <Link href="/about#address" className="btn btn-secondary mt-6">
            {tHome("initiatorCta")}
          </Link>
        </div>
      </section>

      <TopicAgenda topics={topics} locale={locale} variant="accordion" surface="night" />

      <section className="band light-copy" style={{ background: "var(--color-paper)" }}>
        <div className="container-shell">
          <p className="eyebrow">{tLocalized(home.lines.eyebrow, locale)}</p>
          <h2 className="h-display">{tLocalized(home.lines.title, locale)}</h2>
          <div className="tracks">
            {home.lines.items.map((item) => (
              <Link
                key={item.id}
                href={`/program?line=${item.id}`}
                className={`track-card ${trackClass[item.id] ?? "track-lead"}`}
              >
                <span className="track-k">{tLocalized(item.title, locale)}</span>
                <div>
                  <h3>{tLocalized(item.title, locale)}</h3>
                  <p>{tLocalized(item.text, locale)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="band band-sand" id="program">
        <div className="container-shell">
          <p className="eyebrow">{tLocalized(home.programPreview.eyebrow, locale)}</p>
          <h2 className="h-display">
            <span className="title-wide">{tLocalized(home.programPreview.title, locale)}</span>
            <span className="title-narrow">{tHome("programTitleShort")}</span>
          </h2>
          <ForumArchitecture />
          <div className="download-row">
            {programDownloads.map((item) => (
              <a
                key={item.file}
                className="chip"
                href={`/downloads/program/${item.file}`}
                download={item.file}
              >
                <i>PDF</i>
                {tProgram(`downloads.${item.labelKey}`)}
              </a>
            ))}
          </div>
          <p className="mt-4 text-sm text-ink-soft">{tStatus("timezone")}</p>
        </div>
      </section>

      <section className="band band-night-2" id="tiers">
        <div className="container-shell">
          <p className="eyebrow">{tLocalized(home.tickets.eyebrow, locale)}</p>
          <h2 className="h-display">{tLocalized(home.tickets.title, locale)}</h2>
          <p className="lead">{tHome("ticketLead")}</p>
          <div className="tiers">
            <article className="tier tier-guest">
              <h3>{tLocalized(home.tickets.guest.title, locale)}</h3>
              <p className="price">
                {site.pricing.guestUsd}
                <small>USD</small>
              </p>
              <ul>
                {guestPerks.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>
              <Link href="/register" className="btn btn-on-dark mt-auto self-start">
                {tHome("guestCta")}
              </Link>
            </article>
            <article className="tier tier-delegate">
              <p className="tier-ribbon">{ribbon}</p>
              <h3>{tLocalized(home.tickets.delegate.title, locale)}</h3>
              <p className="price price-gold">
                {pricing.amount}
                <small>USD</small>
              </p>
              <p className="text-sm text-[var(--color-mist)]">
                {tHome("priceLadder", {
                  lateAmount: delegatePricing.late.amountUsd,
                })}
              </p>
              <ul>
                {delegatePerks.map((perk) => (
                  <li key={perk}>{perk}</li>
                ))}
              </ul>
              <p className="text-sm text-[var(--color-mist)]">
                {tHome("untilRaise")}{" "}
                <PriceClock earlyIso={priceRiseAt} dayLabel={tHome("dayShort")} />
              </p>
              <Link href="/register" className="btn btn-gold mt-auto self-start">
                {tHome("delegateCta")}
              </Link>
            </article>
          </div>
        </div>
      </section>

      <section className="band band-night" id="award">
        <div className="container-shell award-grid">
          <div>
            <p className="eyebrow">{tLocalized(home.awardTeaser.eyebrow, locale)}</p>
            <h2 className="h-display award-title">{tLocalized(home.awardTeaser.title, locale)}</h2>
            <p className="lead">{tLocalized(award.intro, locale)}</p>
            <div className="nom-groups">
              {nominationGroups.map((group) => (
                <div key={group} className={nomGroupClass(group)}>
                  <p className="nom-group-title">{group}</p>
                  <div className="noms">
                    {award.nominations
                      .filter((item) => item.block === group)
                      .map((item) => (
                        <span key={item.id} className={nomClass(item.block)}>
                          {tLocalized(item.title, locale)}
                        </span>
                      ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="hero-cta">
              <Link href="/award" className="btn btn-gold">
                {t("applyAward")}
                {" · "}
                {tHome("awardUntil", {
                  date: formatForumDate(site.dates.awardClose, locale, dateOptions),
                })}
              </Link>
              <Link href="/award" className="btn btn-on-dark">
                {tHome("awardRules")}
              </Link>
            </div>
          </div>
          <figure className="statue">
            <HorizonImage
              src={award.statueImage}
              alt={tLocalized(award.statueCaption, locale)}
              zoom
            />
            <figcaption className="absolute inset-x-6 bottom-5 text-sm text-[var(--color-mist)]">
              <b className="mb-1 block font-[family-name:var(--font-display)] text-[var(--color-sand)]">
                {tLocalized(award.statueCaption, locale)}
              </b>
              {tLocalized(award.grandPrix, locale)}
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="band light-copy" id="youth" style={{ background: "var(--color-paper)" }}>
        <div className="container-shell grid items-end gap-12 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="eyebrow">{tLocalized(home.youthTeaser.eyebrow, locale)}</p>
            <p className="youth-quote">
              {tHome.rich("youthQuote", {
                em: (chunks) => <em>{chunks}</em>,
              })}
            </p>
            <p className="lead">{tLocalized(home.youthTeaser.text, locale)}</p>
            <div className="hero-cta">
              <Link href="/youth" className="btn btn-primary">
                {t("applyYouth")}
              </Link>
              <Link href="/youth" className="btn btn-secondary">
                {t("applyPitch")}
              </Link>
            </div>
          </div>
          <div className="facts">
            <div className="fact">
              <b>{site.scale.youthDelegates}</b>
              <span>{tHome("youthFactDelegates")}</span>
            </div>
            <div className="fact">
              <b>8</b>
              <span>{tHome("youthFactFinalists")}</span>
            </div>
            <div className="fact">
              <b>{youth.pitch.tracks.length}</b>
              <span>{tHome("youthFactTracks")}</span>
            </div>
            <div className="fact">
              <b>
                {formatForumDate(site.dates.youthPitchClose, locale, {
                  day: "2-digit",
                  month: "2-digit",
                })}
              </b>
              <span>{tHome("youthFactDeadline")}</span>
            </div>
          </div>
        </div>
      </section>

      {home.guestCountry ? (
      <section className="band band-night" id="partners">
        <div className="container-shell">
          <article className="guest-card">
            <div className="flag-slot">{tHome("flagLabel")}</div>
            <div>
              <h3 className="display text-[22px] font-bold">
                {tLocalized(home.guestCountry.title, locale)}
              </h3>
              <p className="mt-2 text-[15px] text-[var(--color-mist)]">
                {tLocalized(home.guestCountry.text, locale)}
              </p>
            </div>
            <Link href={home.guestCountry.href} className="btn btn-on-dark">
              {tHome("guestCountryCta")}
            </Link>
          </article>
        </div>
      </section>
      ) : null}

      <section className="band light-copy" style={{ paddingTop: 0, background: "var(--color-paper)" }}>
        <div className="container-shell pt-16">
          <p className="eyebrow">{tHome("partnersEyebrow")}</p>
          <h2 className="h-display">{tHome("partnersTitle")}</h2>
          <div className="mt-10 grid gap-7">
            {general ? (
              <div className="partner-row">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
                    {tLocalized(general.title, locale)}
                  </p>
                  <b className="mt-1 block">{tLocalized(general.price, locale)}</b>
                </div>
                <div className="partner-slots">
                  <div className="logo-slot logo-slot-big">{announce}</div>
                </div>
              </div>
            ) : null}
            {strategic ? (
              <div className="partner-row">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
                    {tLocalized(strategic.title, locale)}
                  </p>
                  <b className="mt-1 block">{tLocalized(strategic.price, locale)}</b>
                </div>
                <div className="partner-slots">
                  {Array.from({ length: 3 }, (_, index) => (
                    <div key={index} className="logo-slot min-w-[150px]">
                      {tHome("logoSlot")}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {theme ? (
              <div className="partner-row">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
                    {tLocalized(theme.title, locale)}
                  </p>
                  <b className="mt-1 block">{tLocalized(theme.price, locale)}</b>
                </div>
                <div className="partner-slots">
                  {home.lines.items.map((item) => (
                    <div key={item.id} className="logo-slot min-w-[120px]">
                      {tLocalized(item.title, locale)}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
          <div className="mt-9">
            <Link href="/partners" className="btn btn-primary">
              {t("becomePartner")}
            </Link>
          </div>
        </div>
      </section>

      <section className="band band-night-2">
        <div className="container-shell grid items-center gap-8 md:grid-cols-2">
          <div className="venue-photo">
            <HorizonImage
              src={home.venue.image.src}
              alt={tLocalized(home.venue.image.alt, locale)}
              zoom
            />
          </div>
          <div>
            <p className="eyebrow">{tLocalized(home.venue.eyebrow, locale)}</p>
            <h2 className="h-display">{tLocalized(home.venue.title, locale)}</h2>
            <p className="lead">{tLocalized(home.venue.text, locale)}</p>
            <div className="venue-actions">
              <Link href="/attendees" className="btn btn-on-dark">
                {t("venueDetails")}
              </Link>
              <div className="venue-action">
                <span className="venue-caption">{tHome("planCaption")}</span>
                <Link href="/expo" className="btn btn-on-dark">
                  ESG Expo
                </Link>
              </div>
              <div className="venue-action">
                <span className="venue-caption">{tHome("mapCaption")}</span>
                <a href={home.venue.mapUrl} className="btn btn-on-dark" target="_blank" rel="noreferrer">
                  {t("openMap")}
                </a>
              </div>
            </div>
          </div>
        </div>
        {home.venue.planImage ? (
          <div className="container-shell mt-10">
            <div className="plan-frame">
              <HorizonImage
                src={home.venue.planImage.src}
                alt={tLocalized(home.venue.planImage.alt, locale)}
                zoom
              />
            </div>
          </div>
        ) : null}
      </section>
    </div>
  );
}
