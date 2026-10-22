-- Fase 1 de 2: unicidad de lugares POR PROPIEDAD.
--
-- unique_location_entry (name, latitude, longitude, sub_category_id) no
-- incluye property_id: el upsert de generate-auto-locations / magic-search
-- (cliente admin, ON CONFLICT DO UPDATE) reasigna a otra propiedad la fila
-- de un anfitrión que ya tenía ese mismo lugar.
--
-- Esta migración solo CREA el índice nuevo. El antiguo se mantiene hasta
-- que el código con el nuevo onConflict esté desplegado (fase 2), para que
-- ni el código viejo ni el nuevo fallen durante el despliegue. Mientras
-- convivan, un choque entre propiedades da error en vez de reasignar.
--
-- No parcial a propósito: el onConflict de supabase-js no admite el
-- predicado de un índice parcial. Las filas 'info' tienen lat/lng NULL y
-- no colisionan (NULL es distinto de NULL en un índice único).
-- Es menos restrictivo que el actual: ninguna fila existente puede violarlo.

create unique index if not exists unique_location_entry_per_property
    on public.property_data (property_id, name, latitude, longitude, sub_category_id);
