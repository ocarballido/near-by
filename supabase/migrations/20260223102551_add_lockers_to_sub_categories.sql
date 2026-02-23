begin;

insert into public.sub_categories (id, category_id, name, type, order_index)
values (
  '2d77f5a2-83e8-4d1e-a4f8-1f4c9f2bd7a1',
  'f97d7e65-87f5-471e-a120-c04c26394b54',
  'Taquillas',
  'location'::public.property_data_type,
  8
)
on conflict (id) do update
set
  category_id = excluded.category_id,
  name        = excluded.name,
  type        = excluded.type,
  order_index = excluded.order_index,
  updated_at  = now();

commit;