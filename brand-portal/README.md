# Brand Partner Portal

A standalone internal tool, served at `/Brand`, for brand partners to view and
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

Then open `http://localhost:3000/Brand`.

## Auth model

Login is brand name vs. brand name (case-insensitive) — there is no real
password. See the comment in `app/Brand/actions.ts` for the security caveat:
this only protects the catalog as long as the `/Brand` URL itself stays
unshared.

## Structure

- `app/Brand/page.tsx` — checks the session cookie, renders the login form or dashboard.
- `app/Brand/actions.ts` — Server Actions: login, logout, delete (all brand-scoped).
- `lib/products.ts` — all Supabase queries, always scoped to the session's brand via `ilike`.
- `lib/session.ts` — signs/verifies the HttpOnly session cookie (HS256 JWT via `jose`).
