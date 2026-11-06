"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { formSchemaByType, type FormType } from "@/schemas/forms";

export type DemoField = {
  name: string;
  label: string;
  type?:
    | "text"
    | "email"
    | "tel"
    | "textarea"
    | "select"
    | "number"
    | "url"
    | "file";
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
};

type InvoiceResponse = {
  id: string;
  amountUsd: number;
  currency: string;
  status: string;
  lineItems: Array<{ description: string; unitUsd: number }>;
};

export function DemoApplyForm({
  id,
  formType,
  fields,
  submitLabel,
  successMessage,
  hiddenFields,
  errorMessage = "Could not submit. Please check the fields and try again.",
  rateLimitMessage = "Too many requests. Please try again later.",
}: {
  id: string;
  formType: FormType;
  fields: DemoField[];
  submitLabel: string;
  successMessage: string;
  hiddenFields?: Record<string, string>;
  errorMessage?: string;
  rateLimitMessage?: string;
}) {
  const schema = formSchemaByType[formType];
  type Values = z.infer<typeof schema>;

  const fieldKey = fields.map((f) => f.name).join("|");
  const hiddenKey = JSON.stringify(hiddenFields || {});

  const defaultValues = useMemo(() => {
    const values: Record<string, string> = {};
    for (const field of fields) values[field.name] = "";
    if (hiddenFields) Object.assign(values, hiddenFields);
    values.company_website = "";
    if (formType === "newsletter") values.company = "";
    return values as Values;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed by fieldKey/hiddenKey
  }, [fieldKey, hiddenKey, formType]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(schema as any),
    defaultValues: defaultValues as never,
  });

  useEffect(() => {
    if (!hiddenFields) return;
    for (const [name, value] of Object.entries(hiddenFields)) {
      setValue(name as never, value as never);
    }
  }, [hiddenFields, setValue]);

  const [status, setStatus] = useState("");
  const [invoice, setInvoice] = useState<InvoiceResponse | null>(null);
  const [error, setError] = useState("");

  const onSubmit = handleSubmit(async (values) => {
    setError("");
    setStatus("");
    setInvoice(null);

    const payload = {
      ...values,
      ...(hiddenFields || {}),
      company_website: "",
    };

    try {
      const response = await fetch(`/api/forms/${formType}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.status === 429) {
        setError(rateLimitMessage);
        return;
      }

      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        invoice?: InvoiceResponse | null;
        error?: string;
      } | null;

      if (!response.ok || !data?.ok) {
        setError(data?.error || errorMessage);
        return;
      }

      const nextInvoice = data.invoice ?? null;
      reset({
        ...(defaultValues as object),
        ...(hiddenFields || {}),
        company_website: "",
      } as never);
      setInvoice(nextInvoice);
      setStatus(successMessage);
    } catch {
      setError(errorMessage);
    }
  });

  return (
    <form
      id={id}
      className="mt-6 grid gap-4 border border-line bg-white/70 p-5 md:p-6"
      onSubmit={onSubmit}
      noValidate
    >
      {hiddenFields
        ? Object.entries(hiddenFields).map(([name]) => (
            <input key={name} type="hidden" {...register(name as never)} />
          ))
        : null}

      {fields.map((field) => {
        const fieldError = (
          errors as Record<string, { message?: string } | undefined>
        )[field.name];
        return (
          <label key={field.name} className="grid gap-1.5 text-sm">
            <span className="font-medium text-ink">
              {field.label}
              {field.required ? " *" : ""}
            </span>
            {field.type === "textarea" ? (
              <textarea
                {...register(field.name as never)}
                rows={5}
                placeholder={field.placeholder}
                className="rounded-lg border border-line bg-white px-3 py-2"
                aria-invalid={Boolean(fieldError)}
              />
            ) : field.type === "select" ? (
              <select
                {...register(field.name as never)}
                className="min-h-11 rounded-lg border border-line bg-white px-3"
                defaultValue=""
                aria-invalid={Boolean(fieldError)}
              >
                <option value="" disabled>
                  —
                </option>
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                {...register(field.name as never)}
                type={field.type || "text"}
                placeholder={field.placeholder}
                className="min-h-11 rounded-lg border border-line bg-white px-3"
                aria-invalid={Boolean(fieldError)}
              />
            )}
            {fieldError?.message ? (
              <span className="text-xs text-accent" role="alert">
                {fieldError.message}
              </span>
            ) : null}
          </label>
        );
      })}

      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
        {...register("company_website" as never)}
      />

      <button
        type="submit"
        className="btn btn-primary justify-self-start disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? "…" : submitLabel}
      </button>

      {error ? (
        <p className="text-sm text-accent" role="alert">
          {error}
        </p>
      ) : null}
      {status ? (
        <p className="text-sm font-medium text-accent" role="status">
          {status}
        </p>
      ) : null}
      {invoice ? (
        <div
          className="rounded-lg border border-accent/40 bg-paper p-4 text-sm text-ink"
          role="status"
        >
          <p className="font-semibold text-deep">
            Invoice {invoice.id} · {invoice.amountUsd} {invoice.currency} ·{" "}
            {invoice.status}
          </p>
          <ul className="mt-2 space-y-1 text-ink-soft">
            {invoice.lineItems.map((item) => (
              <li key={item.description}>
                {item.description}: {item.unitUsd} {invoice.currency}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </form>
  );
}
