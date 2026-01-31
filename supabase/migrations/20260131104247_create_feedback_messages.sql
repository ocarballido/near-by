create table if not exists public.feedback_messages (
  id uuid primary key default extensions.uuid_generate_v4(),
  created_at timestamptz not null default now(),

  user_id uuid not null references auth.users(id) on delete cascade,
  user_email text null,

  status text not null default 'new'
    check (status in ('new', 'triaged', 'planned', 'resolved', 'dismissed')),

  category text not null default 'other'
    check (category in ('question', 'suggestion', 'unclear', 'bug', 'other')),

  message text not null,

  metadata jsonb not null default '{}'::jsonb,

  source_area text not null
    check (source_area in ('create_property', 'create_location', 'create_info', 'dashboard', 'subscription')),

  context_type text null
    check (context_type in ('property', 'location', 'info', 'none')),

  context_id uuid null,

  flow_name text null,
  page_path text null,
  locale text null
);

-- Indexes
create index if not exists feedback_messages_created_at_idx
  on public.feedback_messages (created_at desc);

create index if not exists feedback_messages_user_id_idx
  on public.feedback_messages (user_id);

create index if not exists feedback_messages_status_idx
  on public.feedback_messages (status);

create index if not exists feedback_messages_source_area_idx
  on public.feedback_messages (source_area);

create index if not exists feedback_messages_context_idx
  on public.feedback_messages (context_type, context_id);

-- RLS
alter table public.feedback_messages enable row level security;

-- Allow authenticated users to insert their own feedback
create policy "Users can insert their own feedback"
on public.feedback_messages
for insert
to authenticated
with check (user_id = auth.uid());
