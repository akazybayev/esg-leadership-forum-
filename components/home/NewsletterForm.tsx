"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InboxFields } from "@/components/forms/InboxFields";
import { INBOX_FORM_ACTION } from "@/lib/forms/inbox";
import { newsletterFormSchema } from "@/schemas/forms";
import type { z } from "zod";

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
  const formRef = useRef<HTMLFormElement>(null);
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<Values>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: { email: "", company: "" },
  });

  const onSubmit = handleSubmit(() => {
    formRef.current?.submit();
  });

  return (
    <form
      ref={formRef}
      method="post"
      action={INBOX_FORM_ACTION}
      className="mt-6 flex flex-col gap-3 sm:flex-row"
      onSubmit={onSubmit}
    >
      <InboxFields formType="newsletter" />
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
    </form>
  );
}
