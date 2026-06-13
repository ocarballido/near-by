begin;

insert into public.categories (id, name, icon, order_index, type)
values (
  '4581a08a-3e78-4800-b16c-575f5da81cba',
  'El Alojamiento',
  'IconApartment',
  1,
  'info'::public.property_data_type
)
on conflict (id) do update
set
  name        = excluded.name,
  icon        = excluded.icon,
  order_index = excluded.order_index,
  type        = excluded.type;

insert into public.sub_categories (id, category_id, name, type, order_index)
values (
  'e34d65fd-18a4-4fca-9522-5585593fe28d',
  '4581a08a-3e78-4800-b16c-575f5da81cba',
  'Explora los detalles',
  'info'::public.property_data_type,
  6
)
on conflict (id) do update
set
  category_id = excluded.category_id,
  name        = excluded.name,
  type        = excluded.type,
  order_index = excluded.order_index,
  updated_at  = now();

commit;