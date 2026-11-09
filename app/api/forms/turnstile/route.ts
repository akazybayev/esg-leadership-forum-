import { NextResponse } from "next/server";
import { turnstileSiteKey } from "@/lib/forms/turnstile";

export function GET() {
  return NextResponse.json({ siteKey: turnstileSiteKey() });
}
