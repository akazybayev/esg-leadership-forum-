"use client";

import { useState } from "react";

export function ShareButtons({
  url,
  title,
  labels,
}: {
  url: string;
  title: string;
  labels: {
    share: string;
    linkedin: string;
    telegram: string;
    whatsapp: string;
    copy: string;
    copied: string;
  };
}) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(`${title} ${url}`);

  return (
    <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label={labels.share}>
      <a
        className="btn btn-secondary min-h-11"
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noreferrer"
      >
        {labels.linkedin}
      </a>
      <a
        className="btn btn-secondary min-h-11"
        href={`https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noreferrer"
      >
        {labels.telegram}
      </a>
      <a
        className="btn btn-secondary min-h-11"
        href={`https://wa.me/?text=${encodedText}`}
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
