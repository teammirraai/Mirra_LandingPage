"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getSharedPassword } from "@/lib/env";
import { brandExistsInCatalog, deleteBrandProduct } from "@/lib/products";
import { issueOtp, verifyAndConsumeOtp } from "@/lib/otp";
import {
  createPendingOtpToken,
  createSessionToken,
  normalizeBrand,
  OTP_PENDING_COOKIE_MAX_AGE,
  OTP_PENDING_COOKIE_NAME,
  SESSION_COOKIE_MAX_AGE,
  SESSION_COOKIE_NAME,
  verifyPendingOtpToken,
  verifySessionToken,
} from "@/lib/session";

export interface LoginState {
  step: "credentials" | "otp";
  brand: string | null;
  error: string | null;
}

export async function login(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const brandInput = String(formData.get("brand") ?? "").trim();
  const passwordInput = String(formData.get("password") ?? "");

  if (!brandInput || !passwordInput) {
    return { step: "credentials", brand: null, error: "Enter both a brand name and a password." };
  }

  // SECURITY NOTE: this is still not real per-brand authentication — every
  // brand signs in with the same shared password (BRAND_PORTAL_SHARED_PASSWORD
  // in the root .env). It's a stronger gate than "brand name as its own
  // password" used before, but it's still one secret shared across every
  // brand partner, backstopped by the OTP step below as a second factor.
  // Treat leaking this password the same as leaking the /brand URL itself.
  if (passwordInput !== getSharedPassword()) {
    return { step: "credentials", brand: null, error: "Brand and password do not match." };
  }

  const normalizedBrand = normalizeBrand(brandInput);

  let hasCatalogItems: boolean;
  try {
    hasCatalogItems = await brandExistsInCatalog(normalizedBrand);
  } catch {
    return { step: "credentials", brand: null, error: "Something went wrong verifying that brand. Please try again." };
  }

  if (!hasCatalogItems) {
    return { step: "credentials", brand: null, error: "No catalog items found for that brand." };
  }

  let otpCode: number;
  try {
    otpCode = await issueOtp(normalizedBrand);
  } catch {
    return { step: "credentials", brand: null, error: "Could not generate a verification code. Please try again." };
  }

  if (process.env.NODE_ENV !== "production") {
    // No delivery channel (email/SMS) is wired up yet — this is the only way
    // to see the code outside the brand_portal_otps table during development.
    console.log(`[brand-portal] OTP for "${normalizedBrand}": ${otpCode}`);
  }

  const pendingToken = await createPendingOtpToken(normalizedBrand);
  const cookieStore = await cookies();
  cookieStore.set(OTP_PENDING_COOKIE_NAME, pendingToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: OTP_PENDING_COOKIE_MAX_AGE,
  });

  return { step: "otp", brand: normalizedBrand, error: null };
}

export async function verifyOtp(prevState: LoginState, formData: FormData): Promise<LoginState> {
  const cookieStore = await cookies();
  const pendingToken = cookieStore.get(OTP_PENDING_COOKIE_NAME)?.value;
  const brand = await verifyPendingOtpToken(pendingToken);

  if (!brand) {
    return { step: "credentials", brand: null, error: "That code expired. Please sign in again." };
  }

  const submittedCode = String(formData.get("otp") ?? "").trim();
  if (!submittedCode) {
    return { step: "otp", brand, error: "Enter the verification code." };
  }

  let isValid: boolean;
  try {
    isValid = await verifyAndConsumeOtp(brand, submittedCode);
  } catch {
    return { step: "otp", brand, error: "Something went wrong verifying that code. Please try again." };
  }

  if (!isValid) {
    return { step: "otp", brand, error: "Incorrect or expired code." };
  }

  const sessionToken = await createSessionToken(brand);
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_COOKIE_MAX_AGE,
  });
  cookieStore.delete(OTP_PENDING_COOKIE_NAME);

  redirect("/brand");
}

/**
 * Single entry point for the client form: dispatches to the credentials
 * check or the OTP check depending on which fields were submitted, so the
 * login UI only needs one `useActionState` hook instead of juggling two.
 */
export async function submitLogin(prevState: LoginState, formData: FormData): Promise<LoginState> {
  if (formData.has("otp")) {
    return verifyOtp(prevState, formData);
  }
  return login(prevState, formData);
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  cookieStore.delete(OTP_PENDING_COOKIE_NAME);
  redirect("/brand");
}

export interface DeleteProductResult {
  error: string | null;
}

export async function deleteProduct(id: number): Promise<DeleteProductResult> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const brand = await verifySessionToken(token);

  if (!brand) {
    return { error: "Your session has expired. Please log in again." };
  }

  try {
    await deleteBrandProduct(brand, id);
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to delete item." };
  }

  revalidatePath("/brand");
  return { error: null };
}
