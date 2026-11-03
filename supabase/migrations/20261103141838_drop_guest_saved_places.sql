-- Retira los guardados del huésped en la BD (migraciones 20261103100627 y
-- 20261103130858): la lista pasa a una cookie httpOnly escrita por el
-- servidor y la BD no guarda nada. La purga de property_visits
-- (20261103100653) se queda.
--
-- Sin "if exists" ni "cascade" a propósito: las firmas están comprobadas en
-- local y en prod (types.ts). Si algo no cuadra, el push debe fallar en vez
-- de pasar en silencio o arrastrar otros objetos.

-- 1) El cron primero: es quien llama a la función de purga
select cron.unschedule('purge-guest-saved-places');

-- 2) Funciones, con sus firmas actuales
drop function public.add_guest_saved_place(text, uuid, uuid, integer, integer);
drop function public.merge_guest_saved_places(text, uuid, uuid[], integer, integer);
drop function public.remove_guest_saved_place(text, uuid, uuid);
drop function public.delete_expired_guest_saved_places();

-- 3) Tabla (sus índices se van con ella)
drop table public.guest_saved_places;
