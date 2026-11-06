"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { tLocalized } from "@/lib/i18n-content";
import type { z } from "zod";
import type { speakerSchema } from "@/schemas/content";

type Speaker = z.infer<typeof speakerSchema>;

export function SpeakersExplorer({
  speakers,
  announceDateLabel,
}: {
  speakers: Speaker[];
  announceDateLabel: string;
}) {
  const locale = useLocale() as Locale;
  const t = useTranslations("speakers");
  const [line, setLine] = useState("");

  const filtered = useMemo(() => {
    const confirmed = speakers.filter((s) => s.confirmed && s.name);
    if (!line) return confirmed;
    return confirmed.filter((s) => s.lines.includes(line as never));
  }, [speakers, line]);

  if (filtered.length === 0) {
    return (
      <div className="mt-8 border border-dashed border-line bg-white/50 px-5 py-10 text-ink-soft">
        {t("comingSoon", { date: announceDateLabel })}
      </div>
    );
  }

  return (
    <div>
      <label className="mt-8 grid max-w-xs gap-1 text-sm">
        <span className="font-medium text-ink-soft">{t("filterLine")}</span>
        <select
          className="min-h-11 rounded-lg border border-line bg-white px-3"
          value={line}
          onChange={(e) => setLine(e.target.value)}
        >
          <option value="">{t("any")}</option>
          {["Lead", "Finance", "Planet", "People", "Region"].map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>

      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((speaker) => (
          <li key={speaker.id}>
            <Link
              href={`/speakers/${speaker.id}`}
              className="block border border-line bg-white/70 p-4 transition hover:border-deep"
            >
              <div className="relative mb-4 aspect-[4/5] overflow-hidden bg-paper-2">
                {speaker.photo ? (
                  <Image
                    src={speaker.photo}
                    alt={tLocalized(speaker.name!, locale)}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full items-end p-4 text-sm text-ink-soft">
                    {t("photoSoon")}
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold text-deep">
                {tLocalized(speaker.name!, locale)}
              </h2>
              {speaker.title ? (
                <p className="mt-1 text-sm text-ink-soft">
                  {tLocalized(speaker.title, locale)}
                </p>
              ) : null}
              {speaker.organization ? (
                <p className="mt-1 text-sm font-medium text-ink">
                  {tLocalized(speaker.organization, locale)}
                </p>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
