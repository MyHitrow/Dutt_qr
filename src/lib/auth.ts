import crypto from "crypto";

const JWT_SECRET =
  process.env.ADMIN_JWT_SECRET ||
  process.env.ADMIN_SECRET_KEY ||
  "dutt-meyhane-secure-salt-2026-x99238-moka-works";

interface TokenPayload {
  role: "admin";
  username: string;
  exp: number; // timestamp in ms
}

/**
 * Generate a cryptographically signed HMAC-SHA256 admin session token.
 */
export function signAdminToken(username: string, expiresInDays = 7): string {
  const payload: TokenPayload = {
    role: "admin",
    username: username.toLowerCase().trim(),
    exp: Date.now() + expiresInDays * 24 * 60 * 60 * 1000,
  };

  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(payloadBase64)
    .digest("base64url");

  return `${payloadBase64}.${signature}`;
}

/**
 * Verify HMAC-SHA256 admin token and check expiration.
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

  // Constant-time comparison to prevent timing attacks
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

    return payload;
  } catch {
    return null;
  }
}

/**
 * Verify admin credentials against environment or secure defaults.
 */
export function checkAdminCredentials(username?: string, password?: string): boolean {
  if (!username || !password) return false;

  const validUsernames = (
    process.env.ADMIN_USERNAMES || "admin,dutt,duttmeyhane"
  )
    .split(",")
    .map((u) => u.trim().toLowerCase());

  const validPasswords = (
    process.env.ADMIN_PASSWORDS || "dutt123,DuttMersin.2026!"
  )
    .split(",")
    .map((p) => p.trim());

  const u = username.trim().toLowerCase();
  const p = password.trim();

  return validUsernames.includes(u) && validPasswords.includes(p);
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
