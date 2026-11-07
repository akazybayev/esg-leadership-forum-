import { createHash } from "crypto";
import { mkdir, readFile, rename, writeFile } from "fs/promises";
import path from "path";

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;
const DEFAULT_PER_HOUR = 3;
const GLOBAL_PER_HOUR = 15;
const GLOBAL_PER_DAY = 40;
const DAILY_BYTE_BUDGET = 80_000;
const MAX_TRACKED_CLIENTS = 2_000;

type Bucket = { start: number; count: number };

type QuotaState = {
  hourStart: number;
  hourCount: number;
  dayStart: number;
  dayCount: number;
  dayBytes: number;
  clients: Record<string, Bucket>;
};

function emptyState(now: number): QuotaState {
  return {
    hourStart: now,
    hourCount: 0,
    dayStart: now,
    dayCount: 0,
    dayBytes: 0,
    clients: {},
  };
}

function limitPerHour() {
  const raw = Number(process.env.FORM_RATE_LIMIT_PER_HOUR);
  if (Number.isFinite(raw) && raw >= 1 && raw <= 100) return Math.floor(raw);
  return DEFAULT_PER_HOUR;
}

function quotaPath() {
  return path.join(process.cwd(), "data", "form-quota.json");
}

function hashClient(clientKey: string) {
  return createHash("sha256").update(clientKey).digest("hex").slice(0, 24);
}

let memory: QuotaState | null = null;
let chain: Promise<void> = Promise.resolve();

async function loadState(now: number): Promise<QuotaState> {
  if (memory) return memory;
  try {
    const raw = await readFile(quotaPath(), "utf8");
    const parsed = JSON.parse(raw) as QuotaState;
    if (
      parsed &&
      typeof parsed.hourStart === "number" &&
      typeof parsed.dayStart === "number" &&
      parsed.clients &&
      typeof parsed.clients === "object"
    ) {
      if (typeof parsed.dayBytes !== "number") parsed.dayBytes = 0;
      memory = parsed;
      return memory;
    }
  } catch {
    // A missing or unreadable counter file starts a fresh window.
  }
  memory = emptyState(now);
  return memory;
}

async function saveState(state: QuotaState) {
  const file = quotaPath();
  await mkdir(path.dirname(file), { recursive: true });
  const temp = `${file}.${process.pid}.tmp`;
  await writeFile(temp, JSON.stringify(state), "utf8");
  await rename(temp, file);
}

function pruneClients(state: QuotaState, now: number) {
  for (const [key, bucket] of Object.entries(state.clients)) {
    if (now - bucket.start >= HOUR_MS) delete state.clients[key];
  }
  const keys = Object.keys(state.clients);
  if (keys.length <= MAX_TRACKED_CLIENTS) return;
  keys
    .sort((a, b) => state.clients[a].start - state.clients[b].start)
    .slice(0, keys.length - MAX_TRACKED_CLIENTS)
    .forEach((key) => delete state.clients[key]);
}

async function enforce(
  clientKey: string,
  now: number,
): Promise<{ ok: true } | { ok: false; retryAfterSec: number }> {
  const state = await loadState(now);
  if (now - state.hourStart >= HOUR_MS) {
    state.hourStart = now;
    state.hourCount = 0;
  }
  if (now - state.dayStart >= DAY_MS) {
    state.dayStart = now;
    state.dayCount = 0;
    state.dayBytes = 0;
  }
  pruneClients(state, now);

  const key = hashClient(clientKey.trim().slice(0, 64) || "unknown");
  const bucket = state.clients[key];
  const clientCount = bucket && now - bucket.start < HOUR_MS ? bucket.count : 0;
  if (clientCount >= limitPerHour()) {
    const start = bucket?.start ?? now;
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((start + HOUR_MS - now) / 1000)),
    };
  }
  if (state.hourCount >= GLOBAL_PER_HOUR) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((state.hourStart + HOUR_MS - now) / 1000)),
    };
  }
  if (state.dayCount >= GLOBAL_PER_DAY) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((state.dayStart + DAY_MS - now) / 1000)),
    };
  }

  state.clients[key] =
    bucket && now - bucket.start < HOUR_MS
      ? { start: bucket.start, count: bucket.count + 1 }
      : { start: now, count: 1 };
  state.hourCount += 1;
  state.dayCount += 1;
  memory = state;
  try {
    await saveState(state);
  } catch {
    // The in-memory window still applies for this process.
  }
  return { ok: true };
}

export function clientAddress(request: Request): string {
  // The first forwarded address is chosen by the caller. The last one is the
  // hop added by the proxy in front of this app.
  const forwarded = request.headers.get("x-forwarded-for");
  const hops = forwarded
    ?.split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const lastHop = hops && hops.length > 0 ? hops[hops.length - 1] : "";
  const raw = lastHop || "unknown";
  return raw.slice(0, 64);
}

export async function reserveStoreBytes(
  bytes: number,
  now = Date.now(),
): Promise<{ ok: true } | { ok: false; retryAfterSec: number }> {
  const run = async () => {
    const state = await loadState(now);
    if (now - state.dayStart >= DAY_MS) {
      state.dayStart = now;
      state.dayCount = 0;
      state.dayBytes = 0;
    }
    if (state.dayBytes + bytes > DAILY_BYTE_BUDGET) {
      return {
        ok: false as const,
        retryAfterSec: Math.max(1, Math.ceil((state.dayStart + DAY_MS - now) / 1000)),
      };
    }
    state.dayBytes += bytes;
    memory = state;
    try {
      await saveState(state);
    } catch {
      // The in-memory budget still applies for this process.
    }
    return { ok: true as const };
  };
  const task = chain.then(run);
  chain = task.then(
    () => undefined,
    () => undefined,
  );
  return task;
}

export function checkRateLimit(
  clientKey: string,
  now = Date.now(),
): Promise<{ ok: true } | { ok: false; retryAfterSec: number }> {
  const task = chain.then(() => enforce(clientKey, now));
  chain = task.then(
    () => undefined,
    () => undefined,
  );
  return task;
}

export async function resetRateLimit() {
  memory = null;
  const file = quotaPath();
  const { rm } = await import("fs/promises");
  await rm(file, { force: true });
}
