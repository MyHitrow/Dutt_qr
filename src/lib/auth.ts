import crypto from "crypto";
import fs from "fs";
import path from "path";

function getJwtSecret(): string {
  const secret = process.env.ADMIN_JWT_SECRET || process.env.ADMIN_SECRET_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "[auth] FATAL: ADMIN_JWT_SECRET is missing! Set ADMIN_JWT_SECRET in your production environment variables."
      );
    }
    console.warn(
      "[auth] WARNING: ADMIN_JWT_SECRET is not configured. Using temporary dev secret."
    );
    return "dutt-dev-only-secret-key-replace-in-production-123456";
  }
  if (secret.length < 16) {
    console.warn("[auth] WARNING: ADMIN_JWT_SECRET is too short (< 16 chars). Consider using a stronger secret.");
  }
  return secret;
}

const JWT_SECRET = getJwtSecret();

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
    const tempFile = `${REVOKED_TOKENS_FILE}.tmp.${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    await fs.promises.writeFile(
      tempFile,
      JSON.stringify(Array.from(revokedJtis)),
      "utf8"
    );
    await fs.promises.rename(tempFile, REVOKED_TOKENS_FILE);
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

  const u = username.trim().toLowerCase();
  const p = password.trim();

  // 1. Support ADMIN_CREDENTIALS format: "user1:pass1,user2:pass2"
  const rawCredentials = process.env.ADMIN_CREDENTIALS;
  if (rawCredentials && rawCredentials.trim()) {
    const pairs = rawCredentials.split(",").map((s) => s.trim()).filter(Boolean);
    let matched = false;
    for (const pair of pairs) {
      const idx = pair.indexOf(":");
      if (idx !== -1) {
        const expectedUser = pair.substring(0, idx).trim().toLowerCase();
        const expectedPass = pair.substring(idx + 1).trim();
        if (safeStringCompare(u, expectedUser) && safeStringCompare(p, expectedPass)) {
          matched = true;
        }
      }
    }
    if (matched) return true;
  }

  // 2. Positional pairing for ADMIN_USERNAMES and ADMIN_PASSWORDS
  const rawUsernames = process.env.ADMIN_USERNAMES;
  const rawPasswords = process.env.ADMIN_PASSWORDS;

  if (!rawUsernames || !rawPasswords) {
    if (!rawCredentials) {
      console.error("[auth] ADMIN_USERNAMES veya ADMIN_PASSWORDS tanımlı değil! Erişim reddedildi.");
    }
    return false;
  }

  const validUsernames = rawUsernames
    .split(",")
    .map((un) => un.trim().toLowerCase())
    .filter(Boolean);

  const validPasswords = rawPasswords
    .split(",")
    .map((pw) => pw.trim())
    .filter(Boolean);

  if (validUsernames.length === 0 || validPasswords.length === 0) {
    return false;
  }

  // Positional pairing: username at index i strictly matches password at index i.
  // If passwords array is shorter, excess usernames map to the last password.
  for (let i = 0; i < validUsernames.length; i++) {
    const expectedUser = validUsernames[i];
    const passIndex = i < validPasswords.length ? i : validPasswords.length - 1;
    const expectedPass = validPasswords[passIndex];

    if (safeStringCompare(u, expectedUser) && safeStringCompare(p, expectedPass)) {
      return true;
    }
  }

  return false;
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
