import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { getSessionSecret } from "./env";

export const SESSION_COOKIE_NAME = "brand_portal_session";
export const OTP_PENDING_COOKIE_NAME = "brand_portal_otp_pending";

const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
const OTP_PENDING_TTL_SECONDS = 60 * 10; // 10 minutes — matches the OTP's own expiry
const ALGORITHM = "HS256";

type TokenPurpose = "session" | "otp_pending";

function getSigningKey(): Uint8Array {
  return new TextEncoder().encode(getSessionSecret());
}

/** Normalizes a brand name for comparisons/storage: trims and lowercases. */
export function normalizeBrand(brand: string): string {
  return brand.trim().toLowerCase();
}

async function signToken(brand: string, purpose: TokenPurpose, ttlSeconds: number): Promise<string> {
  return new SignJWT({ brand, purpose })
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt()
    .setExpirationTime(`${ttlSeconds}s`)
    .sign(getSigningKey());
}

/**
 * Verifies a token and checks its `purpose` claim matches what's expected —
 * this keeps a pending-OTP token from being usable as a real session token
 * (or vice versa) even though both are signed with the same secret.
 */
async function verifyToken(token: string | undefined, expectedPurpose: TokenPurpose): Promise<string | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSigningKey(), {
      algorithms: [ALGORITHM],
    });
    if (payload.purpose !== expectedPurpose) return null;
    return typeof payload.brand === "string" ? payload.brand : null;
  } catch {
    return null;
  }
}

export function createSessionToken(normalizedBrand: string): Promise<string> {
  return signToken(normalizedBrand, "session", SESSION_TTL_SECONDS);
}

/** Returns the normalized brand name from a session token, or null if missing/invalid/expired. */
export function verifySessionToken(token: string | undefined): Promise<string | null> {
  return verifyToken(token, "session");
}

/** Issued after brand+password check passes, before the OTP is confirmed. */
export function createPendingOtpToken(normalizedBrand: string): Promise<string> {
  return signToken(normalizedBrand, "otp_pending", OTP_PENDING_TTL_SECONDS);
}

export function verifyPendingOtpToken(token: string | undefined): Promise<string | null> {
  return verifyToken(token, "otp_pending");
}

export const SESSION_COOKIE_MAX_AGE = SESSION_TTL_SECONDS;
export const OTP_PENDING_COOKIE_MAX_AGE = OTP_PENDING_TTL_SECONDS;
