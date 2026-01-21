alter table public.property_data
add column if not exists must_visit boolean not null default false;
