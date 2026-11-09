"use client";

import { useEffect, useRef, useState } from "react";

type TurnstileApi = {
  render: (element: HTMLElement, options: { sitekey: string; theme: "light" | "dark" }) => string;
  remove: (widgetId: string) => void;
};

function turnstileApi(): TurnstileApi | undefined {
  return (window as Window & { turnstile?: TurnstileApi }).turnstile;
}

let scriptPromise: Promise<void> | null = null;

function loadTurnstile(): Promise<void> {
  if (turnstileApi()) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.dataset.turnstile = "1";
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error("turnstile"));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export function TurnstileField({ theme = "light" }: { theme?: "light" | "dark" }) {
  const ref = useRef<HTMLDivElement>(null);
  const [siteKey, setSiteKey] = useState("");

  useEffect(() => {
    let cancel = false;
    fetch("/api/forms/turnstile")
      .then((response) => response.json())
      .then((data: { siteKey?: string }) => {
        if (!cancel) setSiteKey(data.siteKey?.trim() || "");
      })
      .catch(() => {
        if (!cancel) setSiteKey("");
      });
    return () => {
      cancel = true;
    };
  }, []);

  useEffect(() => {
    const element = ref.current;
    if (!siteKey || !element) return;
    let widgetId = "";
    let cancel = false;
    loadTurnstile()
      .then(() => {
        const api = turnstileApi();
        if (cancel || !api || !element.isConnected) return;
        widgetId = api.render(element, { sitekey: siteKey, theme });
      })
      .catch(() => undefined);
    return () => {
      cancel = true;
      const api = turnstileApi();
      if (widgetId && api) api.remove(widgetId);
    };
  }, [siteKey, theme]);

  if (!siteKey) return null;
  return <div ref={ref} className="min-h-16" />;
}
