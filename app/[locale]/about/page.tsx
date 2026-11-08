import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { TopicAgenda } from "@/components/home/TopicAgenda";
import { ForumArchitecture } from "@/components/program/ForumArchitecture";
import { ShareButtons } from "@/components/share/ShareButtons";
import { getTopics } from "@/lib/content";
import { absoluteUrl } from "@/lib/seo";
import { forumLineIds } from "@/lib/pricing";
import { pageMetadata } from "@/lib/page-meta";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return pageMetadata(locale, "about");
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale = localeParam as Locale;
  setRequestLocale(locale);
  const t = await getTranslations("aboutPage");
  const tLines = await getTranslations("lines");
  const tCta = await getTranslations("cta");
  const tShare = await getTranslations("share");
  const topics = getTopics();

  const paragraphs = ["p1", "p2", "p3", "p4", "p5", "p6"] as const;
  const stats = [
    ["participants", "500"],
    ["countries", "20+"],
    ["speakers", "60–70"],
    ["exhibitors", "20"],
  ] as const;

  return (
    <div>
      <section className="container-shell py-12 md:py-16">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
          {t("eyebrow")}
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-deep md:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-2xl text-ink">{t("subtitle")}</p>
        <p className="mt-3 text-sm font-medium text-deep">{t("whenWhere")}</p>
        <ShareButtons
          url={absoluteUrl(locale, "/about")}
          title={t("title")}
          hrefs={{
            linkedin: "https://www.linkedin.com/company/global-esg-partnership/",
            instagram:
              "https://www.instagram.com/global_esg_partnership?mdxt=dGRwNnp2aXl1Mmh3",
            telegram: "https://t.me/esg_school",
            whatsapp: "https://wa.me/77015552576",
          }}
          labels={{
            share: tShare("label"),
            linkedin: tShare("linkedin"),
            instagram: tShare("instagram"),
            telegram: tShare("telegram"),
            whatsapp: tShare("whatsapp"),
            copy: tShare("copy"),
            copied: tShare("copied"),
          }}
        />
      </section>

      <section id="address" className="border-y border-line bg-white/40 py-14 md:py-20">
        <div className="container-shell grid gap-8 md:grid-cols-[minmax(0,280px)_1fr] md:items-start">
          <figure>
            <div className="relative aspect-[4/5] overflow-hidden bg-deep">
              <Image
                src="/images/people/aidar-kazybayev.jpg"
                alt={t("photoAlt")}
                fill
                className="object-cover object-top"
                sizes="(min-width: 768px) 280px, 100vw"
              />
            </div>
          </figure>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-deep md:text-4xl">
              {t("addressTitle")}
            </h2>
            <p className="mt-4 text-sm font-medium leading-relaxed text-deep">
              {t("photoCaption")}
            </p>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-ink-soft">
              <p className="font-medium text-ink">{t("greeting")}</p>
              {paragraphs.map((key) => (
                <p key={key}>{t(key)}</p>
              ))}
            </div>
            <Image
              src="/images/people/aidar-kazybayev-signature.png"
              alt={t("signatureAlt")}
              width={107}
              height={77}
              className="mt-6 h-16 w-auto"
            />
            <p className="mt-2 font-semibold text-deep">{t("signName")}</p>
            <p className="text-sm text-ink-soft">{t("signRole1")}</p>
            <p className="text-sm text-ink-soft">{t("signRole2")}</p>
            <Link href="/register" className="btn btn-primary mt-6">
              {tCta("register")}
            </Link>
          </div>
        </div>
      </section>

      <section className="container-shell py-14 md:py-20">
        <h2 className="text-3xl font-bold text-deep">{t("statsTitle")}</h2>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map(([key, value]) => (
            <div key={key} className="border border-line bg-white/70 p-5">
              <p className="text-3xl font-bold tracking-tight text-deep">{value}</p>
              <p className="mt-2 text-sm text-ink-soft">{t(`stat.${key}`)}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-ink-soft">{t("statsNote")}</p>
      </section>

      <section className="border-y border-line bg-white/40 py-14 md:py-20">
        <div className="container-shell">
          <h2 className="text-3xl font-bold text-deep">{t("linesTitle")}</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {forumLineIds.map((line) => (
              <article key={line} className="border border-line bg-paper p-5">
                <h3 className="text-xl font-bold text-deep">{line}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {tLines(`${line}.text`)}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <TopicAgenda topics={topics} locale={locale} variant="open" />

      <section className="container-shell py-14 md:py-20">
        <h2 className="text-3xl font-bold text-deep">{t("daysTitle")}</h2>
        <div className="mt-8">
          <ForumArchitecture />
        </div>
        <Link href="/program" className="btn btn-secondary mt-6">
          {t("fullProgram")}
        </Link>
      </section>

      <section className="border-y border-line bg-white/40 py-14 md:py-20">
        <div className="container-shell grid gap-6">
          <h2 className="text-3xl font-bold text-deep">{t("organizerTitle")}</h2>
          <article className="border border-line bg-paper p-6">
            <img
              src="/images/brand/global-esg-partnership-logo.png"
              alt={t("orgName")}
              width={220}
              height={175}
              className="h-auto w-52"
            />
            <h3 className="mt-4 text-xl font-bold text-deep">{t("orgName")}</h3>
            <p className="mt-3 leading-relaxed text-ink-soft">{t("orgText")}</p>
          </article>
          <article className="border border-line bg-paper p-6">
            <h3 className="text-xl font-bold text-deep">{t("personName")}</h3>
            <p className="mt-3 leading-relaxed text-ink-soft">{t("personText")}</p>
          </article>
          <article className="border border-line bg-paper p-6">
            <h3 className="text-xl font-bold text-deep">{t("schoolName")}</h3>
            <p className="mt-3 leading-relaxed text-ink-soft">{t("schoolText")}</p>
            <a
              href="https://www.esgschool.kz"
              className="mt-4 inline-block text-sm font-semibold text-deep underline"
              target="_blank"
              rel="noreferrer"
            >
              www.esgschool.kz
            </a>
          </article>
        </div>
      </section>

      <section className="container-shell py-16 text-center md:py-20">
        <p className="mx-auto max-w-2xl text-2xl font-semibold leading-snug text-deep md:text-3xl">
          {t("ctaText")}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/register" className="btn btn-primary">
            {tCta("register")}
          </Link>
          <Link href="/partners" className="btn btn-secondary">
            {t("becomePartner")}
          </Link>
        </div>
      </section>
    </div>
  );
}
