import { NextResponse } from "next/server";
import { formTypes, type FormType } from "@/schemas/forms";
import { processFormSubmission } from "@/lib/forms/submit";
import { checkRateLimit, getClientIp } from "@/lib/forms/rate-limit";

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

  const ip = getClientIp(request);
  const limited = checkRateLimit(`${rawType}:${ip}`);
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
    payload = await request.json();
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
