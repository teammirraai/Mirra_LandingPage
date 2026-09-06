-- Run this once in the Supabase SQL editor for this project.
-- Backs the /Brand login's OTP step (see lib/otp.ts).

create table if not exists public.brand_portal_otps (
  id bigint generated always as identity primary key,
  brand text not null,
  otp integer not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  consumed boolean not null default false
);

create index if not exists brand_portal_otps_brand_idx
  on public.brand_portal_otps (brand)
  where not consumed;
