"use client";

import { useEffect, useState } from "react";

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function partsUntil(iso: string): Parts {
  const diff = Math.max(0, new Date(iso).getTime() - Date.now());
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60,
    seconds: Math.floor(diff / 1000) % 60,
  };
}

function earlyText(iso: string, dayLabel: string) {
  const early = partsUntil(iso);
  return `${early.days} ${dayLabel} ${pad(early.hours)}:${pad(early.minutes)}`;
}

export function Countdown({
  targetIso,
  earlyIso,
  labels,
  earlyLabel,
}: {
  targetIso: string;
  earlyIso: string;
  labels: { days: string; hours: string; minutes: string; seconds: string };
  earlyLabel: string;
}) {
  const [parts, setParts] = useState<Parts>(() => partsUntil(targetIso));

  useEffect(() => {
    const id = window.setInterval(() => setParts(partsUntil(targetIso)), 1000);
    return () => window.clearInterval(id);
  }, [targetIso]);

  const cells: Array<[string, string, string]> = [
    [String(parts.days), labels.days, "d"],
    [pad(parts.hours), labels.hours, "h"],
    [pad(parts.minutes), labels.minutes, "m"],
    [pad(parts.seconds), labels.seconds, "s"],
  ];

  return (
    <div data-countdown={targetIso} data-early={earlyIso} data-day-short={earlyLabel}>
      <div className="count-row" aria-live="polite">
        {cells.map(([value, label, unit]) => (
          <div key={unit}>
            <b data-unit={unit} suppressHydrationWarning>
              {value}
            </b>
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PriceClock({
  earlyIso,
  dayLabel,
}: {
  earlyIso: string;
  dayLabel: string;
}) {
  const [text, setText] = useState(() => earlyText(earlyIso, dayLabel));

  useEffect(() => {
    const id = window.setInterval(() => setText(earlyText(earlyIso, dayLabel)), 1000);
    return () => window.clearInterval(id);
  }, [earlyIso, dayLabel]);

  return (
    <b data-early-left suppressHydrationWarning>
      {text}
    </b>
  );
}
