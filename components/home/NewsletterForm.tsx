"use client";

import { useRef } from "react";
import { useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsletterFormSchema } from "@/schemas/forms";
import type { z } from "zod";
import { ConsentCheckbox } from "@/components/forms/ConsentCheckbox";
import { TurnstileField } from "@/components/forms/TurnstileField";

type Values = z.infer<typeof newsletterFormSchema>;

export function NewsletterForm({
  placeholder,
  button,
  id = "newsletter-email",
}: {
  placeholder: string;
  button: string;
  success?: string;
  id?: string;
}) {
  const locale = useLocale();
  const formRef = useRef<HTMLFormElement>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<Values>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: { email: "", company: "", consent: false } as unknown as Values,
  });

  const onSubmit = handleSubmit(() => {
    formRef.current?.submit();
  });

  return (
    <form
      ref={formRef}
      method="post"
      action="/api/forms/newsletter"
      className="mt-6 grid gap-3"
      onSubmit={onSubmit}
    >
      <input type="hidden" name="locale" value={locale} />
      <div className="flex flex-col gap-3 sm:flex-row">
      <label className="sr-only" htmlFor={id}>
        Email
      </label>
      <input
        id={id}
        type="email"
        placeholder={placeholder}
        className="min-h-12 flex-1 rounded-full border border-line bg-white px-4 text-ink"
        required
        aria-invalid={Boolean(errors.email)}
        {...register("email")}
      />
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
        {...register("company")}
      />
      <button
        type="submit"
        className="btn btn-primary disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? "…" : button}
      </button>
      </div>
      <TurnstileField theme="dark" />
      <ConsentCheckbox
        id={`${id}-consent`}
        invalid={Boolean(errors.consent)}
        inputProps={register("consent")}
      />
    </form>
  );
}
