-- SHIELD: persistência inicial do workspace
-- Execute este arquivo no Supabase SQL Editor do projeto SHIELD.

create table if not exists public.workspace_assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider text not null check (provider in ('Meta Ads','Google Ads','TikTok Ads','WhatsApp','Telegram','Mercado Livre','Outro')),
  name text not null check (char_length(trim(name)) between 1 and 80),
  reference text,
  state text not null default 'pending' check (state in ('pending','connected','attention')),
  created_at timestamptz not null default now()
);

create index if not exists workspace_assets_user_created_idx
  on public.workspace_assets (user_id, created_at desc);

alter table public.workspace_assets enable row level security;

drop policy if exists "Users can read own workspace assets" on public.workspace_assets;
create policy "Users can read own workspace assets"
  on public.workspace_assets for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can create own workspace assets" on public.workspace_assets;
create policy "Users can create own workspace assets"
  on public.workspace_assets for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own workspace assets" on public.workspace_assets;
create policy "Users can update own workspace assets"
  on public.workspace_assets for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete own workspace assets" on public.workspace_assets;
create policy "Users can delete own workspace assets"
  on public.workspace_assets for delete to authenticated
  using ((select auth.uid()) = user_id);

create table if not exists public.workspace_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text not null default 'Minha operação' check (char_length(trim(name)) between 1 and 48),
  updated_at timestamptz not null default now()
);

alter table public.workspace_settings enable row level security;

drop policy if exists "Users can read own workspace settings" on public.workspace_settings;
create policy "Users can read own workspace settings"
  on public.workspace_settings for select to authenticated
  using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert own workspace settings" on public.workspace_settings;
create policy "Users can insert own workspace settings"
  on public.workspace_settings for insert to authenticated
  with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update own workspace settings" on public.workspace_settings;
create policy "Users can update own workspace settings"
  on public.workspace_settings for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
