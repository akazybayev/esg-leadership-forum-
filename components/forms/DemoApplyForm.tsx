"use client";

import { useState } from "react";

export type DemoField = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "textarea" | "select" | "number" | "url" | "file";
  required?: boolean;
  options?: Array<{ value: string; label: string }>;
  placeholder?: string;
};

export function DemoApplyForm({
  id,
  fields,
  submitLabel,
  successMessage,
}: {
  id: string;
  fields: DemoField[];
  submitLabel: string;
  successMessage: string;
}) {
  const [status, setStatus] = useState("");

  return (
    <form
      id={id}
      className="mt-6 grid gap-4 border border-line bg-white/70 p-5 md:p-6"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        if (data.get("company_website")) return; // honeypot
        setStatus(successMessage);
        form.reset();
      }}
    >
      {fields.map((field) => (
        <label key={field.name} className="grid gap-1.5 text-sm">
          <span className="font-medium text-ink">
            {field.label}
            {field.required ? " *" : ""}
          </span>
          {field.type === "textarea" ? (
            <textarea
              name={field.name}
              required={field.required}
              rows={5}
              placeholder={field.placeholder}
              className="rounded-lg border border-line bg-white px-3 py-2"
            />
          ) : field.type === "select" ? (
            <select
              name={field.name}
              required={field.required}
              className="min-h-11 rounded-lg border border-line bg-white px-3"
              defaultValue=""
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
              name={field.name}
              type={field.type || "text"}
              required={field.required}
              placeholder={field.placeholder}
              className="min-h-11 rounded-lg border border-line bg-white px-3"
            />
          )}
        </label>
      ))}

      <input
        type="text"
        name="company_website"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <button type="submit" className="btn btn-primary justify-self-start">
        {submitLabel}
      </button>
      {status ? (
        <p className="text-sm text-accent" role="status">
          {status}
        </p>
      ) : null}
    </form>
  );
}
