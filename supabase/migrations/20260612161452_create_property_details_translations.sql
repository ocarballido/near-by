create table public.property_details_translations (
  id                      uuid default gen_random_uuid() primary key,
  property_detail_id      uuid not null references public.property_details(id) on delete cascade,
  lang                    text not null,
  field_key               text not null,
  translated_value        text,
  source_lang             text,
  created_at              timestamptz default now(),
  updated_at              timestamptz default now(),

  unique(property_detail_id, lang, field_key)
);

create index on public.property_details_translations(property_detail_id);
create index on public.property_details_translations(lang);

alter table public.property_details_translations enable row level security;

create policy "Lectura pública"
  on public.property_details_translations for select
  using (true);

grant select on public.property_details_translations to anon, authenticated;
grant insert, update, delete on public.property_details_translations to authenticated;
grant all on public.property_details_translations to service_role;