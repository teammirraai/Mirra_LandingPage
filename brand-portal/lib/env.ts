import "server-only";
import path from "node:path";
import { config as loadDotenv } from "dotenv";

// brand-portal/ has no .env of its own — it reads the credentials that already
// live in the repo-root .env (shared with the Python scraping pipeline this
// project lives alongside). This loads that file into process.env once.
let envLoaded = false;
function ensureEnvLoaded() {
  if (envLoaded) return;
  envLoaded = true;
  loadDotenv({ path: path.resolve(process.cwd(), "..", ".env") });
}

function requireEnv(name: string): string {
  ensureEnvLoaded();
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set (expected in the repo root .env)`);
  }
  return value;
}

export function getSupabaseUrl(): string {
  return requireEnv("SUPABASE_URL");
}

export function getSupabaseServiceRoleKey(): string {
  return requireEnv("SUPABASE_SERVICE_ROLE_KEY");
}

export function getSessionSecret(): string {
  ensureEnvLoaded();
  // Prefer a dedicated secret; fall back to the service role key so the app
  // still works if BRAND_PORTAL_SESSION_SECRET hasn't been provisioned yet.
  return process.env.BRAND_PORTAL_SESSION_SECRET || getSupabaseServiceRoleKey();
}

/** The single shared password every brand logs in with (see security note in app/Brand/actions.ts). */
export function getSharedPassword(): string {
  return requireEnv("BRAND_PORTAL_SHARED_PASSWORD");
}
