import { NextResponse } from "next/server";
import { formTypes, type FormType } from "@/schemas/forms";
import { processFormSubmission } from "@/lib/forms/submit";
import { requestIsSameOrigin } from "@/lib/forms/origin";
import { checkRateLimit, clientAddress } from "@/lib/forms/rate-limit";

const MAX_BODY_CHARS = 12_000;

export const runtime = "nodejs";

function isFormType(value: string): value is FormType {
  return (formTypes as readonly string[]).includes(value);
}

export async function POST(
  request: Request,
  context: { params: Promise<{ type: string }> },
) {
  const { type: rawType } = await context.params;
  if (!isFormType(rawType)) {
    return NextResponse.json({ error: "Unknown form type" }, { status: 404 });
  }

  if (!requestIsSameOrigin(request)) {
    return NextResponse.json({ error: "Cross-site submission refused" }, { status: 403 });
  }

  const limited = await checkRateLimit(clientAddress(request));
  if (!limited.ok) {
    return NextResponse.json(
      { error: "Too many requests", retryAfterSec: limited.retryAfterSec },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      },
    );
  }

  let payload: unknown;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BODY_CHARS) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const result = await processFormSubmission(rawType, payload);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, issues: result.issues },
      { status: result.status },
    );
  }

  return NextResponse.json({
    ok: true,
    id: result.id,
    invoice: result.invoice ?? null,
  });
}
