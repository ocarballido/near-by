create table property_data_translations (
  id                uuid default gen_random_uuid() primary key,
  property_data_id  uuid not null references property_data(id) on delete cascade,
  lang              text not null,
  field_key         text not null,
  translated_value  text,
  source_lang       text,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now(),

  unique(property_data_id, lang, field_key)
);

create index on property_data_translations(property_data_id);
create index on property_data_translations(lang);

alter table property_data_translations enable row level security;

create policy "Lectura pública"
  on property_data_translations for select
  using (true);

grant select on property_data_translations to anon, authenticated;
grant insert, update, delete on property_data_translations to authenticated;
grant all on property_data_translations to service_role;