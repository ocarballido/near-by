-- Enable write policies for property_data (owner = properties.user_id)

alter table public.property_data enable row level security;

-- INSERT: allow if the property belongs to the current user
drop policy if exists "property_data_insert_own" on public.property_data;
create policy "property_data_insert_own"
on public.property_data
for insert
to public
with check (
  exists (
    select 1
    from public.properties p
    where p.id = property_data.property_id
      and p.user_id = auth.uid()
  )
);

-- UPDATE: allow if the property belongs to the current user
drop policy if exists "property_data_update_own" on public.property_data;
create policy "property_data_update_own"
on public.property_data
for update
to public
using (
  exists (
    select 1
    from public.properties p
    where p.id = property_data.property_id
      and p.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.properties p
    where p.id = property_data.property_id
      and p.user_id = auth.uid()
  )
);

-- DELETE: allow if the property belongs to the current user
drop policy if exists "property_data_delete_own" on public.property_data;
create policy "property_data_delete_own"
on public.property_data
for delete
to public
using (
  exists (
    select 1
    from public.properties p
    where p.id = property_data.property_id
      and p.user_id = auth.uid()
  )
);