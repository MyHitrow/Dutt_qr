import crypto from "crypto";
import fs from "fs";
import path from "path";

const JWT_SECRET =
  process.env.ADMIN_JWT_SECRET ||
  process.env.ADMIN_SECRET_KEY ||
  "dutt-meyhane-secure-salt-2026-x99238-moka-works";

interface TokenPayload {
  role: "admin";
  username: string;
  exp: number; // timestamp in ms
  jti: string; // unique token ID for revocation
}

/* ── Token Revocation Store ── */
const REVOKED_TOKENS_FILE = path.join(process.cwd(), "storage", "revoked_tokens.json");
const revokedJtis = new Set<string>();

// Load revoked tokens from disk on startup
try {
  if (fs.existsSync(REVOKED_TOKENS_FILE)) {
    const raw = fs.readFileSync(REVOKED_TOKENS_FILE, "utf8");
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) {
      arr.forEach((id: string) => revokedJtis.add(id));
    }
  }
} catch {
  // Ignore startup read errors
}

async function persistRevokedJtis(): Promise<void> {
  try {
    const dir = path.dirname(REVOKED_TOKENS_FILE);
    if (!fs.existsSync(dir)) {
      await fs.promises.mkdir(dir, { recursive: true });
    }
    await fs.promises.writeFile(
      REVOKED_TOKENS_FILE,
      JSON.stringify(Array.from(revokedJtis)),
      "utf8"
    );
  } catch (err) {
    console.warn("[auth] Failed to persist revoked tokens:", err);
  }
}

/**
 * Revoke an admin token by marking its jti as revoked.
 */
export async function revokeAdminToken(token?: string | null): Promise<void> {
  if (!token || typeof token !== "string") return;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return;
    const raw = Buffer.from(parts[0], "base64url").toString("utf8");
    const payload = JSON.parse(raw);
    if (payload?.jti) {
      revokedJtis.add(payload.jti);
      await persistRevokedJtis();
    }
  } catch {
    // ignore parsing failure
  }
}

/**
 * Generate a cryptographically signed HMAC-SHA256 admin session token.
 * Default expiration is 8 hours (0.33 days).
 */
export function signAdminToken(username: string, expiresInDays = 0.33): string {
  const jti = crypto.randomUUID();
  const payload: TokenPayload = {
    role: "admin",
    username: username.toLowerCase().trim(),
    exp: Date.now() + Math.round(expiresInDays * 24 * 60 * 60 * 1000),
    jti,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(payloadBase64)
    .digest("base64url");

  return `${payloadBase64}.${signature}`;
}

/**
 * Verify HMAC-SHA256 admin token, check expiration and revocation list.
 */
export function verifyAdminToken(token?: string | null): TokenPayload | null {
  if (!token || typeof token !== "string") return null;

  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [payloadBase64, providedSig] = parts;

  const expectedSig = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(payloadBase64)
    .digest("base64url");

  // Constant-time signature comparison to prevent timing attacks
  try {
    const isSigValid = crypto.timingSafeEqual(
      Buffer.from(providedSig),
      Buffer.from(expectedSig)
    );
    if (!isSigValid) return null;
  } catch {
    return null;
  }

  try {
    const raw = Buffer.from(payloadBase64, "base64url").toString("utf8");
    const payload: TokenPayload = JSON.parse(raw);

    if (payload.role !== "admin" || !payload.exp || Date.now() > payload.exp) {
      return null;
    }

    if (payload.jti && revokedJtis.has(payload.jti)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Constant-time string comparison using SHA256 hashes.
 */
function safeStringCompare(a: string, b: string): boolean {
  const hashA = crypto.createHash("sha256").update(a).digest();
  const hashB = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(hashA, hashB);
}

/**
 * Verify admin credentials strictly from environment variables without hardcoded fallbacks.
 * Employs constant-time comparison to prevent timing attacks.
 */
export function checkAdminCredentials(username?: string, password?: string): boolean {
  if (!username || !password) return false;

  const rawUsernames = process.env.ADMIN_USERNAMES;
  const rawPasswords = process.env.ADMIN_PASSWORDS;

  if (!rawUsernames || !rawPasswords) {
    console.error("[auth] ADMIN_USERNAMES veya ADMIN_PASSWORDS tanımlı değil! Erişim reddedildi.");
    return false;
  }

  const validUsernames = rawUsernames
    .split(",")
    .map((u) => u.trim().toLowerCase())
    .filter(Boolean);

  const validPasswords = rawPasswords
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);

  const u = username.trim().toLowerCase();
  const p = password.trim();

  const isUserValid = validUsernames.some((vu) => safeStringCompare(u, vu));
  const isPassValid = validPasswords.some((vp) => safeStringCompare(p, vp));

  return isUserValid && isPassValid;
}

/**
 * Extracts and verifies admin auth from Request headers (Bearer token) or Cookies.
 */
export function verifyAdminRequest(req: Request): boolean {
  // 1. Check Authorization: Bearer <token>
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7).trim();
    if (verifyAdminToken(token)) return true;
  }

  // 2. Check Cookie: dut_admin_token
  const cookieHeader = req.headers.get("cookie") || "";
  const match = cookieHeader.match(/dut_admin_token=([^;]+)/);
  if (match && match[1]) {
    const token = decodeURIComponent(match[1].trim());
    if (verifyAdminToken(token)) return true;
  }

  return false;
}
