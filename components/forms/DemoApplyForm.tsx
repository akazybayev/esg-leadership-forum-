"use client";

import { useEffect, useMemo, useRef } from "react";
import { useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { formSchemaByType, type FormType } from "@/schemas/forms";
import { ConsentCheckbox } from "@/components/forms/ConsentCheckbox";

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

export function DemoApplyForm({
  id,
  formType,
  fields,
  submitLabel,
  hiddenFields,
}: {
  id: string;
  formType: FormType;
  fields: DemoField[];
  submitLabel: string;
  successMessage?: string;
  hiddenFields?: Record<string, string>;
  errorMessage?: string;
  rateLimitMessage?: string;
}) {
  const locale = useLocale();
  const schema = formSchemaByType[formType];
  type Values = z.infer<typeof schema>;

  const fieldKey = fields.map((f) => f.name).join("|");
  const hiddenKey = JSON.stringify(hiddenFields || {});

  const defaultValues = useMemo(() => {
    const values: Record<string, string | boolean> = {};
    for (const field of fields) values[field.name] = "";
    if (hiddenFields) Object.assign(values, hiddenFields);
    values.company_website = "";
    if (formType === "newsletter") values.company = "";
    values.consent = false;
    return values as Values;
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed by fieldKey/hiddenKey
  }, [fieldKey, hiddenKey, formType]);

  const {
    register,
    handleSubmit,
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

  const formRef = useRef<HTMLFormElement>(null);

  const onSubmit = handleSubmit(() => {
    formRef.current?.submit();
  });

  return (
    <form
      ref={formRef}
      id={id}
      method="post"
      action={`/api/forms/${formType}`}
      className="mt-6 grid min-w-0 gap-4 border border-line bg-white/70 p-4 md:p-6"
      onSubmit={onSubmit}
    >
      <input type="hidden" name="locale" value={locale} />
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
          <label key={field.name} className="grid min-w-0 gap-1.5 text-sm">
            <span className="font-medium text-ink">
              {field.label}
              {field.required ? " *" : ""}
            </span>
            {field.type === "textarea" ? (
              <textarea
                {...register(field.name as never)}
                rows={5}
                required={field.required}
                placeholder={field.placeholder}
                className="w-full min-w-0 rounded-lg border border-line bg-white px-3 py-2 text-base"
                aria-invalid={Boolean(fieldError)}
              />
            ) : field.type === "select" ? (
              <select
                {...register(field.name as never)}
                className="min-h-11 w-full min-w-0 rounded-lg border border-line bg-white px-3 text-base"
                defaultValue=""
                required={field.required}
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
                required={field.required}
                placeholder={field.placeholder}
                className="min-h-11 w-full min-w-0 rounded-lg border border-line bg-white px-3 text-base"
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

      <ConsentCheckbox
        id={`${id}-consent`}
        invalid={Boolean(
          (errors as Record<string, { message?: string } | undefined>).consent,
        )}
        inputProps={register("consent" as never)}
      />

      <button
        type="submit"
        className="btn btn-primary justify-self-start disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? "…" : submitLabel}
      </button>

    </form>
  );
}
