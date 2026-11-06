import { appendFile, mkdir } from "fs/promises";
import path from "path";
import type { FormType } from "@/schemas/forms";
import { formSchemaByType } from "@/schemas/forms";
import {
  createInvoiceDraft,
  submitPaymentIntent,
  type InvoiceDraft,
} from "@/lib/payment/invoice";

export type FormSubmitResult =
  | {
      ok: true;
      id: string;
      invoice?: InvoiceDraft;
    }
  | {
      ok: false;
      error: string;
      issues?: unknown;
      status: number;
    };

function isHoneypotFilled(payload: Record<string, unknown>): boolean {
  const traps = ["company_website", "company"];
  return traps.some((key) => {
    const value = payload[key];
    return typeof value === "string" && value.trim().length > 0;
  });
}

async function persistSubmission(record: Record<string, unknown>) {
  const dir = path.join(process.cwd(), "data", "submissions");
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, `${String(record.type)}.jsonl`);
  await appendFile(file, `${JSON.stringify(record)}\n`, "utf8");
}

async function deliverWebhook(record: Record<string, unknown>) {
  const url = process.env.FORM_WEBHOOK_URL?.trim();
  if (!url) return { delivered: false as const };

  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(record),
  });

  if (!response.ok) {
    throw new Error(`Webhook failed with ${response.status}`);
  }
  return { delivered: true as const };
}

export async function processFormSubmission(
  type: FormType,
  payload: unknown,
): Promise<FormSubmitResult> {
  if (!payload || typeof payload !== "object") {
    return { ok: false, error: "Invalid payload", status: 400 };
  }

  const data = payload as Record<string, unknown>;
  if (isHoneypotFilled(data)) {
    // Pretend success to bots.
    return { ok: true, id: "ignored" };
  }

  const schema = formSchemaByType[type];
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Validation failed",
      issues: parsed.error.flatten(),
      status: 422,
    };
  }

  const id = `sub_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  let invoice: InvoiceDraft | undefined;

  if (type === "register") {
    const draft = createInvoiceDraft(parsed.data as never);
    if (draft) {
      const paid = await submitPaymentIntent(draft);
      if (!paid.ok) {
        return { ok: false, error: paid.error, status: 502 };
      }
      invoice = paid.invoice;
    }
  }

  const record = {
    id,
    type,
    createdAt: new Date().toISOString(),
    to: process.env.FORM_TO_EMAIL || null,
    payload: parsed.data,
    invoice: invoice ?? null,
  };

  try {
    await persistSubmission(record);
    await deliverWebhook(record);
  } catch (error) {
    console.error("[forms] delivery failed", error);
    return {
      ok: false,
      error: "Could not store or deliver submission",
      status: 502,
    };
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[forms] accepted", { id, type, invoiceId: invoice?.id });
  }

  return { ok: true, id, invoice };
}
