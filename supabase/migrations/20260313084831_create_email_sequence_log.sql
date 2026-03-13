-- Create email_sequence_log table
-- Tracks which sequence emails have been sent to each user
-- Prevents duplicate sends across all email types

create table public.email_sequence_log (
  id         uuid        default gen_random_uuid() primary key,
  user_id    uuid        not null references auth.users(id) on delete cascade,
  type       text        not null,
  step       integer     not null,
  ref_id     uuid        null,
  sent_at    timestamptz not null default now(),

  -- Prevents sending the same email twice to the same user
  -- ref_id is included for type 'incomplete_property' (property id)
  -- ref_id is null for types 'no_property' and 'feature'
  unique (user_id, type, step, ref_id)
);

-- RLS
alter table public.email_sequence_log enable row level security;

-- Only service role can read and write this table
-- Regular users never interact with it directly
create policy "Service role only"
on public.email_sequence_log
for all
to service_role
using (true)
with check (true);