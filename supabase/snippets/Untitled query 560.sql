create policy "property_data_select_own"
on public.property_data
for select
to public
using (
  exists (
    select 1
    from public.properties p
    where p.id = property_data.property_id
      and p.user_id = auth.uid()
  )
);