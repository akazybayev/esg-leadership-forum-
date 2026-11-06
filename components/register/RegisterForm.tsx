"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { DemoApplyForm, type DemoField } from "@/components/forms/DemoApplyForm";

export function RegisterForm({
  earlyPrice,
  standardPrice,
  isEarly,
  earlyDaysLeft,
  lines,
}: {
  earlyPrice: number;
  standardPrice: number;
  isEarly: boolean;
  earlyDaysLeft: number;
  lines: string[];
}) {
  const t = useTranslations("registerPage");
  const [status, setStatus] = useState<"guest" | "delegate">("delegate");

  const priceLabel = useMemo(() => {
    if (status === "guest") return t("priceFree");
    return isEarly
      ? t("priceEarly", { amount: earlyPrice, days: earlyDaysLeft })
      : t("priceStandard", { amount: standardPrice });
  }, [status, isEarly, earlyPrice, standardPrice, earlyDaysLeft, t]);

  const fields: DemoField[] = useMemo(() => {
    const base: DemoField[] = [
      { name: "name", label: t("fieldName"), required: true },
      { name: "organization", label: t("fieldOrg"), required: true },
      { name: "title", label: t("fieldTitle"), required: true },
      { name: "country", label: t("fieldCountry"), required: true },
      { name: "email", label: "Email", type: "email", required: true },
      { name: "phone", label: t("fieldPhone"), type: "tel" },
      {
        name: "category",
        label: t("fieldCategory"),
        type: "select",
        required: true,
        options: [
          { value: "business", label: t("catBusiness") },
          { value: "government", label: t("catGovernment") },
          { value: "international", label: t("catInternational") },
          { value: "university", label: t("catUniversity") },
          { value: "ngo", label: t("catNgo") },
          { value: "media", label: t("catMedia") },
        ],
      },
      {
        name: "lines",
        label: t("fieldLines"),
        type: "select",
        options: lines.map((line) => ({ value: line, label: line })),
      },
    ];

    if (status === "delegate") {
      base.push(
        {
          name: "promo",
          label: t("fieldPromo"),
          placeholder: t("fieldPromoHint"),
        },
        {
          name: "invoice",
          label: t("fieldInvoice"),
          type: "textarea",
          placeholder: t("fieldInvoiceHint"),
        },
      );
    }

    return base;
  }, [status, lines, t]);

  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-2" role="group" aria-label={t("status")}>
        {(["guest", "delegate"] as const).map((value) => (
          <button
            key={value}
            type="button"
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              status === value
                ? "bg-deep text-white"
                : "border border-line bg-white text-ink-soft"
            }`}
            onClick={() => setStatus(value)}
          >
            {t(value)}
          </button>
        ))}
      </div>
      <p className="mt-4 text-lg font-semibold text-accent">{priceLabel}</p>
      <DemoApplyForm
        key={status}
        id="register-form"
        formType="register"
        submitLabel={t("submit")}
        successMessage={
          status === "delegate" ? t("success") : t("successGuest")
        }
        hiddenFields={{ status }}
        fields={fields}
      />
      <p className="mt-3 text-sm text-ink-soft">{t("paymentNote")}</p>
    </div>
  );
}
