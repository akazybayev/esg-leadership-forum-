"use client";

import { useEffect, useState } from "react";

export function InitiatorPortrait({ alt }: { alt: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(min-width: 768px)");
    const apply = () => setShow(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  if (!show) return null;

  return (
    <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] bg-deep">
      <img
        src="/images/people/aidar-kazybayev.jpg"
        alt={alt}
        data-zoom=""
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
    </div>
  );
}
