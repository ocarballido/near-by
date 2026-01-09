-- supabase/seed/catalog.sql
-- Reference data for categories and sub_categories
-- Safe to run multiple times (idempotent)

begin;

-- =========================================================
-- CATEGORIES
-- =========================================================

-- =========================================================
-- SUB CATEGORIES
-- =========================================================

-- Sub-category: Aparcamientos
insert into public.sub_categories (
  id,
  category_id,
  name,
  type,
  order_index
)
values (
  '9e2a6f5d-7c42-4f8c-b7ef-6c4c3e4c2a71', -- fixed UUID
  'f97d7e65-87f5-471e-a120-c04c26394b54', -- Servicios
  'Aparcamientos',
  'location'::public.property_data_type,
  7
)
on conflict (id) do update
set
  category_id = excluded.category_id,
  name        = excluded.name,
  type        = excluded.type,
  order_index = excluded.order_index,
  updated_at  = now();

-- Sub-category: Tiendas veganas
insert into public.sub_categories (
  id,
  category_id,
  name,
  type,
  order_index
)
values (
  '6c2f2c8b-3f5d-4a3e-9a0b-6c3a6e8e9f42', -- fixed UUID
  'e9781151-e27a-4c60-9819-49c095f03cd8', -- Compras
  'Tiendas veganas',
  'location'::public.property_data_type,
  7
)
on conflict (id) do update
set
  category_id = excluded.category_id,
  name        = excluded.name,
  type        = excluded.type,
  order_index = excluded.order_index,
  updated_at  = now();


commit;
