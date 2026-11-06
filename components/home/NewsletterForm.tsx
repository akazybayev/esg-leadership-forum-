"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { newsletterFormSchema } from "@/schemas/forms";
import type { z } from "zod";

type Values = z.infer<typeof newsletterFormSchema>;

export function NewsletterForm({
  placeholder,
  button,
  success,
}: {
  placeholder: string;
  button: string;
  success: string;
}) {
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<Values>({
    resolver: zodResolver(newsletterFormSchema),
    defaultValues: { email: "", company: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setError("");
    setStatus("");
    const response = await fetch("/api/forms/newsletter", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...values, company: "" }),
    });
    if (!response.ok) {
      setError("Could not subscribe. Please try again.");
      return;
    }
    setStatus(success);
    reset();
  });

  return (
    <form
      className="mt-6 flex flex-col gap-3 sm:flex-row"
      onSubmit={onSubmit}
      noValidate
    >
      <label className="sr-only" htmlFor="newsletter-email">
        Email
      </label>
      <input
        id="newsletter-email"
        type="email"
        placeholder={placeholder}
        className="min-h-12 flex-1 rounded-full border border-line bg-white px-4 text-ink"
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
      {error ? (
        <p className="basis-full text-sm text-accent" role="alert">
          {error}
        </p>
      ) : null}
      {status ? (
        <p className="basis-full text-sm text-accent" role="status">
          {status}
        </p>
      ) : null}
    </form>
  );
}
