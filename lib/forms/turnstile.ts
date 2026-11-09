const VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

export function turnstileSiteKey(): string {
  return process.env.TURNSTILE_SITE_KEY?.trim() || "";
}

/** A production submission needs a Turnstile pass. Local development does not. */
export async function turnstilePasses(token: string | undefined): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) return process.env.NODE_ENV !== "production";

  const responseToken = token?.trim() || "";
  if (!responseToken || responseToken.length > 2048) return false;

  const body = new URLSearchParams({ secret, response: responseToken });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      signal: controller.signal,
    });
    if (!response.ok) return false;
    const payload = (await response.json()) as { success?: boolean };
    return payload.success === true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}
