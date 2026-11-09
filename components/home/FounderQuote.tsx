"use client";

import { useEffect, useRef, useState } from "react";

export function FounderQuote({ text }: { text: string }) {
  const ref = useRef<HTMLQuoteElement>(null);
  const [short, setShort] = useState(false);
  const first = text.split(/(?<=\.)\s+/)[0] ?? text;

  useEffect(() => {
    const quote = ref.current;
    if (!quote) return;

    const measure = () => {
      if (window.innerWidth >= 640) {
        setShort(false);
        return;
      }
      const style = getComputedStyle(quote);
      const probe = document.createElement("div");
      probe.textContent = text;
      probe.style.position = "absolute";
      probe.style.visibility = "hidden";
      probe.style.pointerEvents = "none";
      probe.style.width = `${quote.clientWidth || quote.getBoundingClientRect().width}px`;
      probe.style.font = style.font;
      probe.style.lineHeight = style.lineHeight;
      probe.style.letterSpacing = style.letterSpacing;
      document.body.appendChild(probe);
      const line = parseFloat(style.lineHeight) || 26;
      const lines = probe.getBoundingClientRect().height / line;
      probe.remove();
      setShort(lines > 6.05);
    };

    const frame = window.requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", measure);
    };
  }, [text]);

  return (
    <blockquote ref={ref} className="youth-quote">
      {short ? first : text}
    </blockquote>
  );
}
