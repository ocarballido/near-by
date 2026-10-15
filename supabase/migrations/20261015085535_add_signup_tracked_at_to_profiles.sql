-- Add signup_tracked_at to profiles
-- Marks when the "new_user" Mixpanel event was sent, so it fires only once per user

alter table public.profiles
  add column signup_tracked_at timestamptz null;

-- Backfill existing users so they are not tracked as new signups
update public.profiles p
set signup_tracked_at = u.created_at
from auth.users u
where u.id = p.user_id
  and p.signup_tracked_at is null;
