"use client";

import { useEffect, useId, useState, type KeyboardEvent } from "react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { tLocalized } from "@/lib/i18n-content";
import type { TopicsContent } from "@/schemas/content";

type Item = TopicsContent["items"][number];
type SessionLink = Item["sessions"][number];

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function topicHash(id: string) {
  return `topic-${id}`;
}

function idFromHash(hash: string, items: Item[]) {
  const id = hash.replace(/^#/, "");
  if (!id.startsWith("topic-")) return null;
  const topicId = id.slice("topic-".length);
  return items.some((item) => item.id === topicId) ? topicId : null;
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
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    if (variant !== "accordion") return;
    const apply = (scroll: boolean) => {
      const next = idFromHash(window.location.hash, topics.items);
      setOpenId(next);
      if (!next || !scroll) return;
      const node = document.getElementById(topicHash(next));
      node?.scrollIntoView({
        behavior: prefersReducedMotion() ? "auto" : "smooth",
        block: "start",
      });
    };
    apply(true);
    const onHash = () => apply(true);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [topics.items, variant]);

  function toggle(id: string) {
    const next = openId === id ? null : id;
    setOpenId(next);
    const url = new URL(window.location.href);
    url.hash = next ? topicHash(next) : "";
    window.history.replaceState(null, "", `${url.pathname}${url.search}${url.hash}`);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    const triggers = [
      ...event.currentTarget.querySelectorAll<HTMLButtonElement>("[data-topic-trigger]"),
    ];
    const index = triggers.findIndex((node) => node === document.activeElement);
    if (index < 0) return;
    event.preventDefault();
    const next =
      event.key === "ArrowDown"
        ? (index + 1) % triggers.length
        : (index - 1 + triggers.length) % triggers.length;
    triggers[next]?.focus();
  }

  return (
    <section className="container-shell py-16 md:py-20" aria-labelledby={`${baseId}-heading`}>
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-accent">
        {tLocalized(topics.eyebrow, locale)}
      </p>
      <h2
        id={`${baseId}-heading`}
        className="mt-3 max-w-4xl text-3xl font-bold tracking-tight text-deep md:text-5xl"
      >
        {tLocalized(topics.title, locale)}
      </h2>
      <p className="mt-4 max-w-4xl text-lg text-ink-soft">
        {tLocalized(topics.subtitle, locale)}
      </p>
      <div className="mt-10 flex flex-col gap-3" onKeyDown={variant === "accordion" ? onKeyDown : undefined}>
        {topics.items.map((item) => {
          const open = variant === "open" || openId === item.id;
          const titleId = `${baseId}-${item.id}-title`;
          const panelId = `${baseId}-${item.id}-panel`;
          const title = tLocalized(item.title, locale);
          const subtitle = tLocalized(item.subtitle, locale);
          return (
            <article
              key={item.id}
              id={topicHash(item.id)}
              className="scroll-mt-28 border border-line bg-white"
            >
              {variant === "accordion" ? (
                <h3>
                  <button
                    type="button"
                    data-topic-trigger=""
                    className="flex w-full items-start gap-4 px-4 py-5 text-left md:px-6 md:py-6"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => toggle(item.id)}
                  >
                    <span className="min-w-0 flex-1">
                      <span
                        id={titleId}
                        className="block text-[22px] font-bold leading-snug text-deep md:text-[2rem]"
                      >
                        <TopicTitle text={title} />
                      </span>
                      <span className="mt-2 block text-base leading-snug text-ink-soft md:text-lg">
                        {subtitle}
                      </span>
                    </span>
                    <ChevronDown
                      aria-hidden="true"
                      className="topic-chevron mt-1 shrink-0 text-deep"
                      data-open={open ? "true" : "false"}
                      size={22}
                    />
                  </button>
                </h3>
              ) : (
                <div className="px-4 pt-5 md:px-6 md:pt-6">
                  <h3
                    id={titleId}
                    className="text-[22px] font-bold leading-snug text-deep md:text-[2rem]"
                  >
                    <TopicTitle text={title} />
                  </h3>
                  <p className="mt-2 text-base leading-snug text-ink-soft md:text-lg">{subtitle}</p>
                </div>
              )}
              <div
                id={panelId}
                className={variant === "accordion" ? "topic-disclosure" : undefined}
                data-open={open ? "true" : "false"}
                role="region"
                aria-labelledby={titleId}
                inert={variant === "accordion" && !open ? true : undefined}
              >
                <div className={variant === "accordion" ? "topic-disclosure-inner" : undefined}>
                  <div className="px-4 pb-5 md:px-6 md:pb-6">
                    <TopicCopy item={item} locale={locale} />
                    <SessionLinks item={item} locale={locale} label={t("inProgram")} />
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
