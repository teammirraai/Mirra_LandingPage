import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "./env";

let cachedClient: SupabaseClient | null = null;

// Service-role Supabase client. This has full read/write access to the
// database and must never be imported from client components or route code
// that could end up in the browser bundle — only Server Components, Server
// Actions, and Route Handlers should touch this module.
export function getSupabaseAdmin(): SupabaseClient {
  if (!cachedClient) {
    cachedClient = createClient(getSupabaseUrl(), getSupabaseServiceRoleKey(), {
      auth: { persistSession: false },
    });
  }
  return cachedClient;
}
