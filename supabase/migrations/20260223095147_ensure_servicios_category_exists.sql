begin;

insert into public.categories (id, name, icon, order_index, type)
values (
  'f97d7e65-87f5-471e-a120-c04c26394b54',
  'Servicios',
  'IconLocalAtm',
  7,
  'location'::public.property_data_type
)
on conflict (id) do update
set
  name        = excluded.name,
  icon        = excluded.icon,
  order_index = excluded.order_index,
  type        = excluded.type;

commit;