import fs from "fs";
import path from "path";

const LOCK_FILE_DIR = path.join(process.cwd(), "storage");
const LOCK_FILE = path.join(LOCK_FILE_DIR, "auth_locks.json");

interface LockRecord {
  count: number;
  lockedUntil: number;
}

/**
 * Extract trusted client IP.
 * Traefik and trusted reverse proxies write client IP to X-Real-IP.
 */
export function getTrustedIp(req: Request): string {
  const realIp = req.headers.get("x-real-ip");
  if (realIp && realIp.trim()) {
    return realIp.trim();
  }

  const xff = req.headers.get("x-forwarded-for");
  if (xff && xff.trim()) {
    const parts = xff.split(",").map((p) => p.trim()).filter(Boolean);
    if (parts.length > 0) {
      return parts[0];
    }
  }

  return "unknown-client";
}

async function readLocks(): Promise<Record<string, LockRecord>> {
  try {
    if (fs.existsSync(LOCK_FILE)) {
      const data = await fs.promises.readFile(LOCK_FILE, "utf8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.warn("[rateLimit] Could not read lock file, falling back to empty:", err);
  }
  return {};
}

async function writeLocks(locks: Record<string, LockRecord>): Promise<void> {
  try {
    if (!fs.existsSync(LOCK_FILE_DIR)) {
      await fs.promises.mkdir(LOCK_FILE_DIR, { recursive: true });
    }
    const tempFile = `${LOCK_FILE}.tmp.${Date.now()}`;
    await fs.promises.writeFile(tempFile, JSON.stringify(locks, null, 2), "utf8");
    await fs.promises.rename(tempFile, LOCK_FILE);
  } catch (err) {
    console.error("[rateLimit] Could not write lock file:", err);
  }
}

/**
 * Check if an IP is currently locked out from admin authentication.
 */
export async function checkAuthLock(ip: string): Promise<{ isLocked: boolean; waitSeconds?: number; attemptsLeft?: number }> {
  const locks = await readLocks();
  const record = locks[ip];
  const now = Date.now();

  if (record && record.lockedUntil > now) {
    const waitSeconds = Math.ceil((record.lockedUntil - now) / 1000);
    return { isLocked: true, waitSeconds };
  }

  const count = record?.count || 0;
  return { isLocked: false, attemptsLeft: Math.max(0, 5 - count) };
}

/**
 * Record a failed admin authentication attempt. Locks IP for 60s if >= 5 attempts.
 */
export async function recordAuthFailure(ip: string): Promise<{ isLocked: boolean; waitSeconds?: number; attemptsLeft?: number }> {
  const locks = await readLocks();
  const record = locks[ip];
  const now = Date.now();

  const count = (record?.count || 0) + 1;

  if (count >= 5) {
    locks[ip] = { count, lockedUntil: now + 60 * 1000 };
    await writeLocks(locks);
    return { isLocked: true, waitSeconds: 60, attemptsLeft: 0 };
  }

  locks[ip] = { count, lockedUntil: 0 };
  await writeLocks(locks);
  return { isLocked: false, attemptsLeft: 5 - count };
}

/**
 * Reset failed attempts upon successful login.
 */
export async function resetAuthLock(ip: string): Promise<void> {
  const locks = await readLocks();
  if (locks[ip]) {
    delete locks[ip];
    await writeLocks(locks);
  }
}

/* ── Generic Sliding Window In-Memory Rate Limiter (for API flood protection) ── */
const genericRateLimitCache = new Map<string, { count: number; resetAt: number }>();

export function checkGenericRateLimit(key: string, maxRequests: number, windowMs: number): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = genericRateLimitCache.get(key);

  if (!entry || now > entry.resetAt) {
    genericRateLimitCache.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  entry.count += 1;
  return { allowed: true, remaining: maxRequests - entry.count };
}
