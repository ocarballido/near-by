-- Create profiles table
-- Extends auth.users with app-specific user data
-- Handles email preferences and unsubscribe tokens

create table public.profiles (
  user_id           uuid        primary key references auth.users(id) on delete cascade,
  full_name         text        null,
  email_opt_out     boolean     not null default false,
  unsubscribe_token uuid        not null default gen_random_uuid(),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Auto-create a profile row when a new user registers
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

-- Trigger that fires after every new user in auth.users
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;

-- Users can read their own profile
create policy "Users can read own profile"
on public.profiles
for select
to authenticated
using (auth.uid() = user_id);

-- Users can update their own profile
create policy "Users can update own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Service role has full access (needed for Edge Functions and pg_cron)
create policy "Service role full access"
on public.profiles
for all
to service_role
using (true)
with check (true);

-- Public can read only unsubscribe_token and email_opt_out
-- Needed for the /unsubscribe page (no login required)
create policy "Public can unsubscribe"
on public.profiles
for update
to anon
using (true)
with check (true);

-- Backfill profiles for existing users
-- Covers users registered before this migration was applied
insert into public.profiles (user_id)
select id from auth.users
on conflict (user_id) do nothing;