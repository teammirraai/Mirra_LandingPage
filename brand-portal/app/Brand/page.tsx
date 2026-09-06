import { cookies } from "next/headers";
import {
  OTP_PENDING_COOKIE_NAME,
  SESSION_COOKIE_NAME,
  verifyPendingOtpToken,
  verifySessionToken,
} from "@/lib/session";
import { LoginForm } from "./login-form";
import { Dashboard } from "./dashboard";

// This route (/Brand) is a standalone, unlinked internal tool for brand
// partners. It is intentionally not referenced from anywhere else in this
// project — see brand-portal/README.md.
export default async function BrandPage(props: PageProps<"/Brand">) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const brand = await verifySessionToken(token);

  if (!brand) {
    const pendingToken = cookieStore.get(OTP_PENDING_COOKIE_NAME)?.value;
    const pendingBrand = await verifyPendingOtpToken(pendingToken);
    return <LoginForm initialStep={pendingBrand ? "otp" : "credentials"} initialBrand={pendingBrand} />;
  }

  const searchParams = await props.searchParams;

  const rawCategory = firstValue(searchParams.category);
  const rawSubCategory = firstValue(searchParams.subCategory);
  const rawPage = firstValue(searchParams.page);

  const category = rawCategory && rawCategory !== "all" ? rawCategory : null;
  const subCategory = rawSubCategory && rawSubCategory !== "all" ? rawSubCategory : null;
  const page = Math.max(1, Number.parseInt(rawPage ?? "1", 10) || 1);

  return (
    <Dashboard brand={brand} category={category} subCategory={subCategory} page={page} />
  );
}

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}
