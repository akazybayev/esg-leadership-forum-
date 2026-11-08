"use client";

import { useEffect, useState } from "react";

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function getParts(targetIso: string): Parts {
  const target = new Date(`${targetIso}T09:30:00+05:00`).getTime();
  const diff = Math.max(0, target - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export function Countdown({
  targetDate,
  labels,
}: {
  targetDate: string;
  labels: { days: string; hours: string; minutes: string; seconds: string };
}) {
  const [parts, setParts] = useState<Parts>(() => getParts(targetDate));

  useEffect(() => {
    const id = window.setInterval(() => setParts(getParts(targetDate)), 1000);
    return () => window.clearInterval(id);
  }, [targetDate]);

  const cells: Array<[number, string]> = [
    [parts.days, labels.days],
    [parts.hours, labels.hours],
    [parts.minutes, labels.minutes],
    [parts.seconds, labels.seconds],
  ];

  return (
    <div
      className="grid grid-cols-4 gap-2 sm:gap-3"
      aria-live="polite"
      aria-atomic="true"
    >
      {cells.map(([value, label]) => (
        <div
          key={label}
          className="border border-white/20 bg-white/10 px-2 py-3 text-center backdrop-blur-sm"
        >
          <div
            className="text-2xl font-bold tabular-nums text-white sm:text-3xl"
            suppressHydrationWarning
          >
            {String(value).padStart(2, "0")}
          </div>
          <div className="mt-1 text-[0.7rem] uppercase tracking-[0.12em] text-white/75">
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
