create table property_translations (
  id                uuid default gen_random_uuid() primary key,
  property_id       uuid not null references properties(id) on delete cascade,
  lang              text not null,
  field_key         text not null,  -- 'name' | 'description' | 'summary' | 'access_instructions'
  translated_value  text,
  source_lang       text,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now(),

  unique(property_id, lang, field_key)
);

create index on property_translations(property_id);
create index on property_translations(lang);

alter table property_translations enable row level security;

-- Lectura pública (huéspedes)
create policy "Lectura pública"
  on property_translations for select
  using (true);

grant select on property_translations to anon, authenticated;
grant insert, update, delete on property_translations to authenticated;
grant all on property_translations to service_role;