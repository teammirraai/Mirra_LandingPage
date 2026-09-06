# Brand Partner Portal

A standalone internal tool, served at `/brand`, for brand partners to view and
delete their own rows in the `unique_products` catalog table. It is **not**
linked from anywhere else in this project (which is otherwise a Python
scraping pipeline) — it's only reachable by typing the URL directly.

## Setup

This app has no `.env` of its own. It reads Supabase credentials from the
repo-root `.env` (one level up from this folder):

```
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
BRAND_PORTAL_SESSION_SECRET=...   # signs the session cookie; falls back to
                                  # SUPABASE_SERVICE_ROLE_KEY if unset
```

The service role key is only ever read server-side (`lib/env.ts`,
`lib/supabase-admin.ts`) — Server Components, Server Actions, and Route
Handlers — and is never sent to the client bundle.

```bash
npm install
npm run dev
```

Then open `http://localhost:3000/brand`.

## Auth model

Two-step login: (1) brand name + a shared password (`BRAND_PORTAL_SHARED_PASSWORD`
in the root `.env`, same for every brand), then (2) a 6-digit one-time code
generated server-side and stored in the `brand_portal_otps` table (see
`brand-portal/supabase/otp_table.sql` — run once in the Supabase SQL editor).
There's no delivery channel (email/SMS) wired up yet, so the code is only
visible in that table, or in the server console during `npm run dev`. See the
comment in `app/brand/actions.ts` for the full security caveat.

## Structure

- `app/brand/page.tsx` — checks the session cookie, renders the login form or dashboard.
- `app/brand/actions.ts` — Server Actions: login, logout, delete (all brand-scoped).
- `lib/products.ts` — all Supabase queries, always scoped to the session's brand via `ilike`.
- `lib/session.ts` — signs/verifies the HttpOnly session cookie (HS256 JWT via `jose`).
