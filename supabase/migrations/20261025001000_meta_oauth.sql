-- SHIELD: Meta Ads OAuth state and token storage.
-- Access tokens are intentionally inaccessible to authenticated clients; only Edge Functions use service_role.

create table if not exists public.meta_oauth_states (
  state_hash text primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.meta_oauth_states enable row level security;
-- No RLS policies: browser clients cannot read or mutate OAuth state.

create table if not exists public.meta_connections (
  user_id uuid primary key references auth.users(id) on delete cascade,
  meta_user_id text,
  meta_user_name text,
  access_token text not null,
  token_type text not null default 'bearer',
  expires_at timestamptz,
  scopes text[] not null default '{}',
  connected_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.meta_connections enable row level security;
-- No RLS policies: access tokens must never be readable by browser clients.
