create table translation_usage (
  id          uuid default gen_random_uuid() primary key,
  month       text not null unique,
  chars_used  integer default 0,
  calls_used  integer default 0,
  paused      boolean default false,
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

alter table translation_usage enable row level security;

grant all on translation_usage to service_role;