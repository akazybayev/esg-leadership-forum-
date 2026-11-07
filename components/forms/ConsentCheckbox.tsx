"use client";

import type { InputHTMLAttributes } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function ConsentCheckbox({
  id,
  invalid,
  inputProps,
}: {
  id: string;
  invalid?: boolean;
  inputProps: InputHTMLAttributes<HTMLInputElement>;
}) {
  const t = useTranslations("consentBox");

  return (
    <div>
      <label htmlFor={id} className="flex items-start gap-3 text-sm text-inherit">
        <input
          id={id}
          type="checkbox"
          required
          className="mt-0.5 h-5 w-5 shrink-0 accent-accent"
          aria-invalid={invalid || undefined}
          {...inputProps}
        />
        <span>
          {t.rich("label", {
            link: (chunks) => (
              <Link href="/consent" className="underline">
                {chunks}
              </Link>
            ),
          })}
        </span>
      </label>
      {invalid ? (
        <p className="mt-1 text-xs text-accent" role="alert">
          {t("error")}
        </p>
      ) : null}
    </div>
  );
}
