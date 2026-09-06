import "server-only";
import crypto from "node:crypto";
import { getSupabaseAdmin } from "./supabase-admin";

const OTP_TABLE = "brand_portal_otps";
const OTP_TTL_MINUTES = 10;

function generateOtpCode(): number {
  return crypto.randomInt(100000, 1000000); // 6 digits
}

/**
 * Generates a fresh OTP for `brand`, stores it, and returns it so the caller
 * can log it in development. Any previously-issued, still-unconsumed codes
 * for this brand are dropped first so only the latest one can ever be used.
 */
export async function issueOtp(brand: string): Promise<number> {
  const supabase = getSupabaseAdmin();
  const code = generateOtpCode();
  const expiresAt = new Date(Date.now() + OTP_TTL_MINUTES * 60_000).toISOString();

  await supabase.from(OTP_TABLE).delete().ilike("brand", brand).eq("consumed", false);

  const { error } = await supabase.from(OTP_TABLE).insert({
    brand,
    otp: code,
    expires_at: expiresAt,
    consumed: false,
  });
  if (error) throw error;

  return code;
}

/**
 * Checks `submitted` against the latest unconsumed, unexpired OTP for
 * `brand` and marks it consumed on success so it can't be reused.
 */
export async function verifyAndConsumeOtp(brand: string, submitted: string): Promise<boolean> {
  const submittedCode = Number(submitted.trim());
  if (!Number.isInteger(submittedCode)) return false;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from(OTP_TABLE)
    .select("id, otp, expires_at")
    .ilike("brand", brand)
    .eq("consumed", false)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  if (!data) return false;
  if (new Date(data.expires_at).getTime() < Date.now()) return false;
  if (data.otp !== submittedCode) return false;

  const { error: updateError } = await supabase
    .from(OTP_TABLE)
    .update({ consumed: true })
    .eq("id", data.id);
  if (updateError) throw updateError;

  return true;
}
