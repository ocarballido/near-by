create table property_details (
  id             uuid default gen_random_uuid() primary key,
  property_id    uuid not null references properties(id) on delete cascade,
  name           text not null,
  instructions   text,
  guidelines     text,
  image_url      text,
  predefined_key text,
  order_index    integer not null default 0,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

create index on property_details(property_id);

alter table property_details enable row level security;

create policy "Lectura pública"
  on property_details for select
  using (true);

grant select on property_details to anon, authenticated;
grant insert, update, delete on property_details to authenticated;
grant all on property_details to service_role;