import { randomUUID } from "crypto";
import type { RegisterFormValues } from "@/schemas/forms";
import { getDelegatePriceUsd, getSiteConfig } from "@/lib/content";

export type InvoiceDraft = {
  id: string;
  provider: "invoice";
  status: "pending";
  currency: "USD";
  amountUsd: number;
  createdAt: string;
  billTo: {
    name: string;
    organization: string;
    email: string;
    country: string;
    invoiceDetails?: string;
  };
  lineItems: Array<{ description: string; quantity: number; unitUsd: number }>;
  notes: string[];
};

/**
 * Stage 6 payment adapter stub.
 * Until PAYMENT_PROVIDER is a real gateway, delegate applications produce an invoice draft.
 */
export function createInvoiceDraft(
  values: RegisterFormValues,
  now = new Date(),
): InvoiceDraft | null {
  if (values.status !== "delegate") return null;

  const site = getSiteConfig();
  const pricing = getDelegatePriceUsd(now);
  const promo = values.promo?.trim();
  const amountUsd = promo ? 0 : pricing.amount;

  return {
    id: `INV-${now.getFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`,
    provider: "invoice",
    status: "pending",
    currency: "USD",
    amountUsd,
    createdAt: now.toISOString(),
    billTo: {
      name: values.name,
      organization: values.organization?.trim() || values.name,
      email: values.email,
      country: values.country,
      invoiceDetails: values.invoice?.trim() || undefined,
    },
    lineItems: [
      {
        description: promo
          ? `Delegate pass (promo ${promo}) — complimentary`
          : pricing.tier === "early"
            ? "Delegate pass — early"
            : pricing.tier === "late"
              ? "Delegate pass — late"
              : "Delegate pass — standard",
        quantity: 1,
        unitUsd: amountUsd,
      },
    ],
    notes: [
      `Forum: ${site.name.ru}`,
      `Dates: ${site.dates.day1} – ${site.dates.day2}`,
      `Payment provider: ${process.env.PAYMENT_PROVIDER || "invoice"} (stub)`,
      "KZT equivalent is calculated at payment-stage FX when a gateway is connected.",
      `Send invoice to: ${process.env.FORM_TO_EMAIL || site.contact.email}`,
    ],
  };
}

export async function submitPaymentIntent(
  invoice: InvoiceDraft,
): Promise<{ ok: true; invoice: InvoiceDraft } | { ok: false; error: string }> {
  // Future: call Kaspi / FreedomPay / Stripe here using PAYMENT_WEBHOOK_SECRET.
  if ((process.env.PAYMENT_PROVIDER || "invoice") !== "invoice") {
    return {
      ok: false,
      error: `Payment provider "${process.env.PAYMENT_PROVIDER}" is not wired yet.`,
    };
  }
  return { ok: true, invoice };
}
