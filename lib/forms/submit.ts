import { mkdir, readFile, rename, writeFile } from "fs/promises";
import path from "path";
import type { FormType } from "@/schemas/forms";
import { formSchemaByType } from "@/schemas/forms";
import { reserveStoreBytes } from "@/lib/forms/rate-limit";
import { sealRecord } from "@/lib/forms/seal";
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

function honeypotKey(type: FormType): "company" | "company_website" {
  return type === "newsletter" ? "company" : "company_website";
}

function isHoneypotFilled(
  type: FormType,
  payload: Record<string, unknown>,
): boolean {
  const value = payload[honeypotKey(type)];
  return typeof value === "string" && value.trim().length > 0;
}

const MAX_STORE_BYTES = 200_000;
const MAX_RECORD_BYTES = 16_000;

let storeChain: Promise<void> = Promise.resolve();

async function writeRecord(record: Record<string, unknown>) {
  const dir = path.join(process.cwd(), "data", "submissions");
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, `${String(record.type)}.jsonl`);
  const stored = sealRecord(record);
  const line = `${JSON.stringify(stored)}\n`;
  if (Buffer.byteLength(line) > MAX_RECORD_BYTES) {
    throw new Error("Submission is too large");
  }
  const budget = await reserveStoreBytes(Buffer.byteLength(line));
  if (!budget.ok) {
    throw new Error("Submission store is over the daily budget");
  }
  const existing = await readFile(file, "utf8").catch(() => "");
  let next = existing + line;
  while (Buffer.byteLength(next) > MAX_STORE_BYTES) {
    const breakAt = next.indexOf("\n");
    if (breakAt === -1) break;
    next = next.slice(breakAt + 1);
  }
  const temp = `${file}.${process.pid}.tmp`;
  await writeFile(temp, next, "utf8");
  await rename(temp, file);
}

function persistSubmission(record: Record<string, unknown>) {
  const run = storeChain.then(() => writeRecord(record));
  storeChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function deliverWebhook(notice: {
  id: string;
  type: string;
  createdAt: string;
}) {
  const url = process.env.FORM_WEBHOOK_URL?.trim();
  if (!url) return { delivered: false as const };

  const response = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      id: notice.id,
      type: notice.type,
      createdAt: notice.createdAt,
    }),
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
  if (isHoneypotFilled(type, data)) {
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
    if (!draft.ok) {
      return { ok: false, error: "Promo code is not valid", status: 422 };
    }
    if (draft.invoice) {
      const paid = await submitPaymentIntent(draft.invoice);
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
    to: null,
    payload: parsed.data,
    invoice: invoice ?? null,
  };

  try {
    await persistSubmission(record);
  } catch (error) {
    if (error instanceof Error && error.message.includes("daily budget")) {
      return { ok: false, error: "Too many requests", status: 429 };
    }
    console.error("[forms] store failed");
    return {
      ok: false,
      error: "Could not store submission",
      status: 502,
    };
  }

  try {
    await deliverWebhook({ id, type, createdAt: record.createdAt });
  } catch {
    console.error("[forms] notice failed");
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[forms] accepted", { id, type, invoiceId: invoice?.id });
  }

  return { ok: true, id, invoice };
}
