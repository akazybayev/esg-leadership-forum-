"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { tLocalized } from "@/lib/i18n-content";
import type { TopicsContent } from "@/schemas/content";

type Item = TopicsContent["items"][number];
type SessionLink = Item["sessions"][number];

function topicHash(id: string) {
  return `topic-${id}`;
}

function TopicTitle({ text }: { text: string }) {
  const parts = text.split(/(?<=\.)\s+(?=\S)/);
  if (parts.length < 2) return text;
  return parts.map((part, index) => (
    <span key={`${index}-${part}`}>
      {index > 0 ? " " : null}
      <span className="inline-block">{part}</span>
    </span>
  ));
}

function sessionHref(session: SessionLink) {
  if (session.sessionSlug) return `/program/${session.sessionSlug}`;
  const params = new URLSearchParams({
    day: session.day,
    room: session.roomId,
  });
  return `/program?${params.toString()}#program-day-${session.day}`;
}

function sessionLabel(session: SessionLink, locale: Locale) {
  return `${tLocalized(session.dayLabel, locale)}, ${session.time}, ${tLocalized(session.hall, locale)} \u2013 ${tLocalized(session.sessionTitle, locale)}`;
}

function SessionLinks({
  item,
  locale,
  label,
}: {
  item: Item;
  locale: Locale;
  label: string;
}) {
  return (
    <div className="mt-5">
      <p className="text-sm font-semibold text-deep">{label}</p>
      <ul className="mt-2 space-y-2">
        {item.sessions.map((session) => (
          <li key={`${session.day}-${session.time}-${session.roomId}-${session.sessionTitle.ru}`}>
            <Link
              href={sessionHref(session)}
              className="text-accent underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
            >
              {sessionLabel(session, locale)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function TopicCopy({ item, locale }: { item: Item; locale: Locale }) {
  return (
    <>
      {item.paragraphs.map((paragraph) => (
        <p key={paragraph.ru} className="mt-4 text-base leading-relaxed text-ink">
          {tLocalized(paragraph, locale)}
        </p>
      ))}
    </>
  );
}

export function TopicAgenda({
  topics,
  locale,
  variant,
}: {
  topics: TopicsContent;
  locale: Locale;
  variant: "accordion" | "open";
}) {
  const t = useTranslations("topics");
  const headingId = "topic-agenda-heading";

  return (
    <section className="container-shell py-16 md:py-20" aria-labelledby={headingId}>
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
        {tLocalized(topics.eyebrow, locale)}
      </p>
      <h2
        id={headingId}
        className="mt-3 max-w-4xl text-3xl font-bold tracking-tight text-deep md:text-5xl"
      >
        {tLocalized(topics.title, locale)}
      </h2>
      <p className="mt-4 max-w-4xl text-lg text-ink-soft">
        {tLocalized(topics.subtitle, locale)}
      </p>
      <div className="mt-10 flex flex-col gap-3">
        {topics.items.map((item) => {
          const titleId = `topic-${item.id}-title`;
          const panelId = `topic-${item.id}-panel`;
          const title = tLocalized(item.title, locale);
          const subtitle = tLocalized(item.subtitle, locale);
          const body = (
            <div id={panelId} role="region" aria-labelledby={titleId}>
              <TopicCopy item={item} locale={locale} />
              <SessionLinks item={item} locale={locale} label={t("inProgram")} />
            </div>
          );
          if (variant === "open") {
            return (
              <article
                key={item.id}
                id={topicHash(item.id)}
                className="scroll-mt-28 border border-line bg-white px-4 py-5 md:px-6 md:py-6"
              >
                <h3 id={titleId} className="text-[22px] font-bold leading-snug text-deep md:text-[2rem]">
                  <TopicTitle text={title} />
                </h3>
                <p className="mt-2 text-base leading-snug text-ink-soft md:text-lg">{subtitle}</p>
                {body}
              </article>
            );
          }
          return (
            <details
              key={item.id}
              id={topicHash(item.id)}
              name="topics"
              className="topic-details scroll-mt-28 border border-line bg-white"
            >
              <summary
                className="flex items-start gap-4 px-4 py-5 md:px-6 md:py-6"
                aria-controls={panelId}
              >
                <span className="min-w-0 flex-1">
                  <h3 id={titleId} className="text-[22px] font-bold leading-snug text-deep md:text-[2rem]">
                    <TopicTitle text={title} />
                  </h3>
                  <span className="mt-2 block text-base leading-snug text-ink-soft md:text-lg">
                    {subtitle}
                  </span>
                </span>
                <ChevronDown aria-hidden="true" className="topic-chevron mt-1 shrink-0 text-deep" size={22} />
              </summary>
              <div className="px-4 pb-5 md:px-6 md:pb-6">{body}</div>
            </details>
          );
        })}
      </div>
    </section>
  );
}
