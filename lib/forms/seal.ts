import { createCipheriv, createHash, randomBytes } from "crypto";

function keyBytes(): Buffer | null {
  const secret = process.env.FORM_STORE_KEY?.trim();
  if (!secret) return null;
  return createHash("sha256").update(secret).digest();
}

export function hasStoreKey(): boolean {
  return keyBytes() !== null;
}

/** Encrypts a record so names, emails and phones are not stored in clear text. */
export function sealRecord(record: Record<string, unknown>): Record<string, unknown> {
  const key = keyBytes();
  const envelope = {
    id: record.id,
    type: record.type,
    createdAt: record.createdAt,
  };
  if (!key) {
    return { ...envelope, stored: "metadata-only" };
  }

  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const body = Buffer.concat([
    cipher.update(JSON.stringify(record), "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return {
    ...envelope,
    stored: "sealed",
    box: Buffer.concat([iv, tag, body]).toString("base64"),
  };
}
