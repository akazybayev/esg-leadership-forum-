"use client";

import { useState } from "react";

export function ShareButtons({
  url,
  title,
  labels,
  hrefs,
}: {
  url: string;
  title: string;
  labels: {
    share: string;
    linkedin: string;
    instagram?: string;
    telegram: string;
    whatsapp: string;
    copy: string;
    copied: string;
  };
  hrefs?: {
    linkedin?: string;
    instagram?: string;
    telegram?: string;
    whatsapp?: string;
  };
}) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${title} ${url}`);
  const linkedin =
    hrefs?.linkedin ??
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
  const telegram =
    hrefs?.telegram ??
    `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(title)}`;
  const whatsapp = hrefs?.whatsapp ?? `https://wa.me/?text=${encodedText}`;

  return (
    <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label={labels.share}>
      <a
        className="btn btn-secondary min-h-11"
        href={linkedin}
        target="_blank"
        rel="noreferrer"
      >
        {labels.linkedin}
      </a>
      {hrefs?.instagram ? (
        <a
          className="btn btn-secondary min-h-11"
          href={hrefs.instagram}
          target="_blank"
          rel="noreferrer"
        >
          {labels.instagram}
        </a>
      ) : null}
      <a
        className="btn btn-secondary min-h-11"
        href={telegram}
        target="_blank"
        rel="noreferrer"
      >
        {labels.telegram}
      </a>
      <a
        className="btn btn-secondary min-h-11"
        href={whatsapp}
        target="_blank"
        rel="noreferrer"
      >
        {labels.whatsapp}
      </a>
      <button
        type="button"
        className="btn btn-secondary min-h-11"
        onClick={() => {
          void navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
          });
        }}
      >
        {copied ? labels.copied : labels.copy}
      </button>
    </div>
  );
}
