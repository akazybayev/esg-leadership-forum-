import { createHash } from "crypto";
import { withTransaction, type Query } from "@/lib/db";

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const DEFAULT_PER_HOUR = 3;
const GLOBAL_PER_HOUR = 400;
const GLOBAL_PER_DAY = 3000;
const DAILY_BYTE_BUDGET = 8_000_000;

type GlobalRow = {
  hour_start: number | string;
  hour_count: number | string;
  day_start: number | string;
  day_count: number | string;
  day_bytes: number | string;
};

type ClientRow = {
  window_start: number | string;
  hits: number | string;
};

type LimitResult = { ok: true } | { ok: false; retryAfterSec: number };

type Rejection = { ok: false; retryAfterSec: number; scope: "client" | "global" };

const MAX_DB_WAITERS = 3;
const clientClosedUntil = new Map<string, number>();
let globalClosedUntil = 0;
let dbWaiters = 0;

function pruneClosed(now: number) {
  if (clientClosedUntil.size < 500) return;
  for (const [key, until] of clientClosedUntil) {
    if (until <= now) clientClosedUntil.delete(key);
  }
}

function alreadyClosed(key: string, now: number): LimitResult | null {
  const until = Math.max(globalClosedUntil, clientClosedUntil.get(key) ?? 0);
  if (until <= now) return null;
  return { ok: false, retryAfterSec: Math.max(1, Math.ceil((until - now) / 1000)) };
}

function rememberClosed(key: string, rejection: Rejection, now: number) {
  const until = now + rejection.retryAfterSec * 1000;
  if (rejection.scope === "global") {
    globalClosedUntil = Math.max(globalClosedUntil, until);
  } else {
    clientClosedUntil.set(key, Math.max(clientClosedUntil.get(key) ?? 0, until));
  }
  pruneClosed(now);
}

function isIp(value: string): boolean {
  if (value.length === 0 || value.length > 64) return false;
  const parts = value.split(".");
  if (parts.length === 4) {
    return parts.every((part) => /^\d{1,3}$/.test(part) && Number(part) <= 255);
  }
  if (!value.includes(":") || value.split("::").length > 2) return false;
  return /^[0-9a-fA-F:.]+$/.test(value);
}

function limitPerHour() {
  const raw = Number(process.env.FORM_RATE_LIMIT_PER_HOUR);
  if (Number.isFinite(raw) && raw >= 1 && raw <= 100) return Math.floor(raw);
  return DEFAULT_PER_HOUR;
}

function hashClient(clientKey: string) {
  return createHash("sha256").update(clientKey).digest("hex").slice(0, 24);
}

function num(value: number | string): number {
  return typeof value === "number" ? value : Number(value);
}

function retry(start: number, windowMs: number, now: number) {
  return Math.max(1, Math.ceil((start + windowMs - now) / 1000));
}

async function lockedGlobal(query: Query, now: number) {
  const rows = (await query(
    `SELECT hour_start, hour_count, day_start, day_count, day_bytes
     FROM form_quota_global WHERE id = 1 FOR UPDATE`,
  )) as GlobalRow[];
  const row = rows[0];
  if (!row) throw new Error("quota row missing");
  const state = {
    hourStart: num(row.hour_start),
    hourCount: num(row.hour_count),
    dayStart: num(row.day_start),
    dayCount: num(row.day_count),
    dayBytes: num(row.day_bytes),
  };
  if (now - state.hourStart >= HOUR_MS) {
    state.hourStart = now;
    state.hourCount = 0;
  }
  if (now - state.dayStart >= DAY_MS) {
    state.dayStart = now;
    state.dayCount = 0;
    state.dayBytes = 0;
  }
  return state;
}

async function saveGlobal(
  query: Query,
  state: {
    hourStart: number;
    hourCount: number;
    dayStart: number;
    dayCount: number;
    dayBytes: number;
  },
) {
  await query(
    `UPDATE form_quota_global
     SET hour_start = $1, hour_count = $2, day_start = $3, day_count = $4, day_bytes = $5
     WHERE id = 1`,
    [state.hourStart, state.hourCount, state.dayStart, state.dayCount, state.dayBytes],
  );
}

function closed(error: unknown): LimitResult {
  console.error("[forms] quota unavailable");
  void error;
  return { ok: false, retryAfterSec: 60 };
}

export function clientAddress(request: Request): string {
  // A caller can prefix X-Forwarded-For. The connecting address is the hop
  // a proxy appends, so earlier hops are not separate visitors.
  const forwarded = request.headers.get("x-forwarded-for");
  const hops = (forwarded ?? "")
    .split(",")
    .map((item) => item.trim().replace(/^\[|\]$/g, ""))
    .filter((item) => item.length > 0);
  const last = hops.length > 0 ? hops[hops.length - 1] : "";
  if (!last || !isIp(last)) return "shared";
  return last.slice(0, 64);
}

async function readQuota(
  key: string,
  now: number,
): Promise<{ ok: true } | Rejection> {
  return withTransaction(async (query) => {
    const state = await lockedGlobal(query, now);
    const clients = (await query(
      `SELECT window_start, hits FROM form_quota_clients WHERE client_hash = $1`,
      [key],
    )) as ClientRow[];
    const client = clients[0];
    const open = client ? now - num(client.window_start) < HOUR_MS : false;
    const clientCount = open && client ? num(client.hits) : 0;
    const windowStart = open && client ? num(client.window_start) : now;

    if (clientCount >= limitPerHour()) {
      return { ok: false, retryAfterSec: retry(windowStart, HOUR_MS, now), scope: "client" };
    }
    if (state.hourCount >= GLOBAL_PER_HOUR) {
      return { ok: false, retryAfterSec: retry(state.hourStart, HOUR_MS, now), scope: "global" };
    }
    if (state.dayCount >= GLOBAL_PER_DAY) {
      return { ok: false, retryAfterSec: retry(state.dayStart, DAY_MS, now), scope: "global" };
    }

    state.hourCount += 1;
    state.dayCount += 1;
    await saveGlobal(query, state);
    await query(
      `INSERT INTO form_quota_clients (client_hash, window_start, hits)
       VALUES ($1, $2, 1)
       ON CONFLICT (client_hash) DO UPDATE
       SET window_start = $2, hits = $3`,
      [key, windowStart, clientCount + 1],
    );
    await query(
      `DELETE FROM form_quota_clients
       WHERE $1 - window_start >= $2 AND client_hash <> $3`,
      [now, HOUR_MS, key],
    );
    return { ok: true };
  });
}

export async function checkRateLimit(
  clientKey: string,
  now = Date.now(),
): Promise<LimitResult> {
  const key = hashClient(clientKey.trim().slice(0, 64) || "unknown");
  const cached = alreadyClosed(key, now);
  if (cached) return cached;
  if (dbWaiters >= MAX_DB_WAITERS) return { ok: false, retryAfterSec: 2 };
  dbWaiters += 1;
  try {
    const result = await readQuota(key, now);
    if (!result.ok) rememberClosed(key, result, now);
    return result.ok ? { ok: true } : { ok: false, retryAfterSec: result.retryAfterSec };
  } catch (error) {
    const rejection: Rejection = { ok: false, retryAfterSec: 60, scope: "global" };
    rememberClosed(key, rejection, now);
    return closed(error);
  } finally {
    dbWaiters -= 1;
  }
}

export async function reserveStoreBytes(
  bytes: number,
  now = Date.now(),
): Promise<LimitResult> {
  if (globalClosedUntil > now) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((globalClosedUntil - now) / 1000)),
    };
  }
  if (dbWaiters >= MAX_DB_WAITERS) return { ok: false, retryAfterSec: 2 };
  dbWaiters += 1;
  try {
    return await withTransaction(async (query) => {
      const state = await lockedGlobal(query, now);
      if (state.dayBytes + bytes > DAILY_BYTE_BUDGET) {
        await saveGlobal(query, state);
        const rejection: Rejection = {
          ok: false,
          retryAfterSec: retry(state.dayStart, DAY_MS, now),
          scope: "global",
        };
        rememberClosed("budget", rejection, now);
        return { ok: false as const, retryAfterSec: rejection.retryAfterSec };
      }
      state.dayBytes += bytes;
      await saveGlobal(query, state);
      return { ok: true as const };
    });
  } catch (error) {
    const rejection: Rejection = { ok: false, retryAfterSec: 60, scope: "global" };
    rememberClosed("budget", rejection, now);
    return closed(error);
  } finally {
    dbWaiters -= 1;
  }
}
