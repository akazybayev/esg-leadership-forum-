"use client";

import { useState } from "react";

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

  return (
    <form
      className="mt-6 flex flex-col gap-3 sm:flex-row"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const email = new FormData(form).get("email");
        if (!email) return;
        setStatus(success);
        form.reset();
      }}
    >
      <label className="sr-only" htmlFor="newsletter-email">
        Email
      </label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        required
        placeholder={placeholder}
        className="min-h-12 flex-1 rounded-full border border-line bg-white px-4 text-ink"
      />
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <button type="submit" className="btn btn-primary">
        {button}
      </button>
      {status ? (
        <p className="basis-full text-sm text-accent" role="status">
          {status}
        </p>
      ) : null}
    </form>
  );
}
