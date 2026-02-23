alter table public.properties
  add column if not exists check_in_date date null,
  add column if not exists check_in_time time null,
  add column if not exists check_out_date date null,
  add column if not exists check_out_time time null;