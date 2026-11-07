"use client";

import { useMemo, useRef, type ReactNode } from "react";
import { useForm, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { z } from "zod";
import { Link } from "@/i18n/navigation";
import { forumLineIds } from "@/lib/pricing";

type Status = "guest" | "delegate";

type FormValues = {
  status: Status;
  name: string;
  email: string;
  country: string;
  organization: string;
  title: string;
  phone: string;
  category: string;
  lines: string;
  promo: string;
  payAsLegal: boolean;
  invoice: string;
  consent: boolean;
  terms: boolean;
  company_website: string;
};

function buildSchema(t: (key: string) => string) {
  const required = z.string().trim().min(1, t("errorRequired"));
  return z
    .object({
      status: z.enum(["guest", "delegate"]),
      name: required,
      email: z
        .string()
        .trim()
        .min(1, t("errorRequired"))
        .refine((value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value), {
          message: t("errorEmail"),
        }),
      country: required,
      organization: z.string(),
      title: z.string(),
      phone: z.string().refine((value) => !value.trim() || /^\+?[0-9()\-\s]{6,}$/.test(value.trim()), {
        message: t("errorPhone"),
      }),
      category: z.string(),
      lines: z.string(),
      promo: z.string().max(80),
      payAsLegal: z.boolean(),
      invoice: z.string().max(2000),
      consent: z.boolean().refine((value) => value, { message: t("errorConsent") }),
      terms: z.boolean(),
      company_website: z.string(),
    })
    .superRefine((value, ctx) => {
      if (value.status !== "delegate") return;
      for (const key of ["organization", "title", "category"] as const) {
        if (!value[key]?.trim()) {
          ctx.addIssue({
            code: "custom",
            path: [key],
            message: t("errorRequired"),
          });
        }
      }
      if (!value.terms) {
        ctx.addIssue({
          code: "custom",
          path: ["terms"],
          message: t("errorTerms"),
        });
      }
    });
}

const inputClass = "min-h-11 w-full rounded-lg border border-line bg-white px-3";

export function RegisterForm({ priceLabel }: { priceLabel: string }) {
  const locale = useLocale();
  const t = useTranslations("registerPage");
  const tLines = useTranslations("lines");
  const formRef = useRef<HTMLFormElement>(null);
  const schema = useMemo(() => buildSchema((key) => t(key)), [t]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      status: "delegate",
      name: "",
      email: "",
      country: "",
      organization: "",
      title: "",
      phone: "",
      category: "",
      lines: "",
      promo: "",
      payAsLegal: false,
      invoice: "",
      consent: false,
      terms: false,
      company_website: "",
    },
  });

  function onSubmit() {
    formRef.current?.submit();
  }

  const categories = [
    ["business", t("catBusiness")],
    ["government", t("catGovernment")],
    ["international", t("catInternational")],
    ["university", t("catUniversity")],
    ["ngo", t("catNgo")],
    ["media", t("catMedia")],
  ] as const;

  return (
    <form
      ref={formRef}
      id="register-form"
      method="post"
      action="/api/forms/register"
      className="group mt-8 grid gap-4 border border-line bg-white/70 p-5 md:p-6 [&:not(:has(#consent:checked))_button[type=submit]]:pointer-events-none [&:not(:has(#consent:checked))_button[type=submit]]:opacity-60 [&:has(#status-delegate:checked):not(:has(#terms:checked))_button[type=submit]]:pointer-events-none [&:has(#status-delegate:checked):not(:has(#terms:checked))_button[type=submit]]:opacity-60 [&:has(#status-guest:checked)_.for-delegate]:hidden [&:has(#status-guest:checked)_.for-guest]:block [&:has(#status-delegate:checked)_.fields]:grid [&:has(#tell-more:checked)_.fields]:grid [&:has(#pay-legal:checked)_.invoice]:block [&:has(#status-delegate:checked)_.req]:inline"
      onSubmit={handleSubmit(onSubmit)}
    >
      <input type="hidden" name="locale" value={locale} />
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={t("status")}>
        <label className="cursor-pointer rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink-soft has-[:checked]:border-deep has-[:checked]:bg-deep has-[:checked]:text-white">
          <input id="status-guest" type="radio" value="guest" className="sr-only" {...register("status")} />
          {t("guestFree")}
        </label>
        <label className="cursor-pointer rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-ink-soft has-[:checked]:border-deep has-[:checked]:bg-deep has-[:checked]:text-white">
          <input id="status-delegate" type="radio" value="delegate" defaultChecked className="sr-only" {...register("status")} />
          {t("delegatePaid")}
        </label>
      </div>
      <p className="text-lg font-semibold text-accent">{priceLabel}</p>

      <Field label={t("fieldName")} required error={errors.name?.message} id="name">
        <input id="name" required className={inputClass} autoComplete="name" aria-invalid={Boolean(errors.name)} {...register("name")} />
      </Field>
      <Field label="Email" required error={errors.email?.message} id="email">
        <input id="email" type="email" required autoComplete="email" className={inputClass} aria-invalid={Boolean(errors.email)} {...register("email")} />
      </Field>
      <Field label={t("fieldCountry")} required error={errors.country?.message} id="country">
        <input id="country" required className={inputClass} autoComplete="country-name" aria-invalid={Boolean(errors.country)} {...register("country")} />
      </Field>

      <label className="for-guest hidden cursor-pointer text-sm font-semibold text-deep">
        <input id="tell-more" type="checkbox" className="mr-2" />
        {t("tellMore")}
      </label>
      <div className="fields hidden gap-4">
        <SharedFields
          register={register}
          errors={errors}
          categories={categories}
          t={(key) => t(key)}
          tLines={(key) => tLines(key as "Lead.text")}
        />
      </div>

      <div className="for-delegate grid gap-4">
        <Field label={t("fieldPromo")} error={errors.promo?.message} id="promo">
          <input id="promo" className={inputClass} placeholder={t("fieldPromoHint")} {...register("promo")} />
          <p className="text-sm leading-relaxed text-ink-soft">
            {t.rich("promoHowBody", {
              email: (chunks) => (
                <a className="underline" href="mailto:forum@esgpartners.kz">
                  {chunks}
                </a>
              ),
            })}
          </p>
        </Field>
        <label className="flex items-start gap-3 text-sm text-ink">
          <input id="pay-legal" type="checkbox" className="mt-1" {...register("payAsLegal")} />
          <span>{t("payAsLegal")}</span>
        </label>
        <div className="invoice hidden">
          <Field label={t("fieldInvoice")} error={errors.invoice?.message} id="invoice">
            <textarea id="invoice" rows={4} className="w-full rounded-lg border border-line bg-white px-3 py-2" placeholder={t("fieldInvoiceHint")} {...register("invoice")} />
          </Field>
        </div>
        <label className="flex items-start gap-3 text-sm text-ink">
          <input id="terms" type="checkbox" className="mt-1" aria-invalid={Boolean(errors.terms)} {...register("terms")} />
          <span>
            {t.rich("termsLabel", {
              link: (chunks) => (
                <Link href="/terms" className="underline">
                  {chunks}
                </Link>
              ),
            })}
          </span>
        </label>
        {errors.terms?.message ? (
          <span className="text-xs text-accent" role="alert">
            {errors.terms.message}
          </span>
        ) : null}
      </div>

      <label className="flex items-start gap-3 text-sm text-ink">
        <input id="consent" type="checkbox" required className="mt-0.5 h-5 w-5 shrink-0 accent-accent" aria-invalid={Boolean(errors.consent)} {...register("consent")} />
        <span>
          {t.rich("consentLabel", {
            link: (chunks) => (
              <Link href="/consent" className="underline">
                {chunks}
              </Link>
            ),
          })}
        </span>
      </label>
      {errors.consent?.message ? (
        <span className="text-xs text-accent" role="alert">
          {errors.consent.message}
        </span>
      ) : null}

      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" {...register("company_website")} />

      <button type="submit" className="btn btn-primary justify-self-start" disabled={isSubmitting}>
        {isSubmitting ? "…" : t("submit")}
      </button>
    </form>
  );
}

function SharedFields({
  register,
  errors,
  categories,
  t,
  tLines,
}: {
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  categories: ReadonlyArray<readonly [string, string]>;
  t: (key: string) => string;
  tLines: (key: string) => string;
}) {
  return (
    <>
      <Field label={t("fieldOrg")} mark error={errors.organization?.message} id="organization">
        <input id="organization" className={inputClass} aria-invalid={Boolean(errors.organization)} {...register("organization")} />
      </Field>
      <Field label={t("fieldTitle")} mark error={errors.title?.message} id="job-title">
        <input id="job-title" className={inputClass} aria-invalid={Boolean(errors.title)} {...register("title")} />
      </Field>
      <Field label={t("fieldPhone")} hint={t("phoneHint")} error={errors.phone?.message} id="phone">
        <input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="+7 …" className={inputClass} aria-invalid={Boolean(errors.phone)} {...register("phone")} />
      </Field>
      <Field label={t("fieldCategory")} mark error={errors.category?.message} id="category">
        <select id="category" className={inputClass} defaultValue="" aria-invalid={Boolean(errors.category)} {...register("category")}>
          <option value="">—</option>
          {categories.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </Field>
      <fieldset>
        <legend className="text-sm font-medium text-ink">{t("fieldLines")}</legend>
        <div className="mt-2 grid gap-2">
          {forumLineIds.map((line) => (
            <label key={line} className="grid cursor-pointer gap-0.5 rounded-lg border border-line bg-white px-3 py-2 text-sm has-[:checked]:border-deep">
              <span className="flex items-center gap-2 font-semibold text-deep">
                <input type="radio" value={line} {...register("lines")} />
                {line}
              </span>
              <span className="pl-6 text-ink-soft">{tLines(`${line}.text`)}</span>
            </label>
          ))}
        </div>
      </fieldset>
    </>
  );
}

function Field({
  label,
  required,
  error,
  hint,
  id,
  mark,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  id: string;
  mark?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-1.5 text-sm">
      <label htmlFor={id} className="font-medium text-ink">
        {label}
        {required ? " *" : null}
        {mark ? <span className="req hidden"> *</span> : null}
      </label>
      {children}
      {hint ? <span className="text-xs text-ink-soft">{hint}</span> : null}
      {error ? (
        <span className="text-xs text-accent" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
