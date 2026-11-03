-- Guardados del huésped en la guía pública (sin login).
--
-- 1) guest_saved_places: una fila por sitio guardado. El huésped se
--    identifica por el SHA-256 (hex) de su cookie httpOnly be_guest_key;
--    la clave en claro nunca llega a la BD.
-- 2) Caducidad: una lista (huésped + guía) caduca a los 60 días de su último
--    cambio (mismo plazo que la cookie, ver saved-places.ts). Cada cambio
--    renueva updated_at en todas sus filas y el cron diario borra las
--    caducadas. Consultar la guía no renueva nada.
-- 3) Integridad: cascada al borrar el sitio o la propiedad, y las funciones
--    solo aceptan sitios de tipo location de esa propiedad.
-- 4) Tope por lista (lo fija la app) aplicado bajo un bloqueo por lista: dos
--    peticiones simultáneas no pueden pasarse del tope.
--
-- Tabla y funciones: solo service_role, search_path vacío.

create table if not exists public.guest_saved_places (
    guest_key_hash text not null
        check (guest_key_hash ~ '^[0-9a-f]{64}$'),
    property_id uuid not null
        references public.properties(id) on delete cascade,
    place_id uuid not null
        references public.property_data(id) on delete cascade,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    primary key (guest_key_hash, property_id, place_id)
);

-- La PK cubre las lecturas por huésped + guía; estos sirven a las cascadas
-- y a la purga
create index if not exists guest_saved_places_property_id_idx
    on public.guest_saved_places (property_id);
create index if not exists guest_saved_places_place_id_idx
    on public.guest_saved_places (place_id);
create index if not exists guest_saved_places_updated_at_idx
    on public.guest_saved_places (updated_at);

alter table public.guest_saved_places enable row level security;
-- Sin políticas: solo se accede vía service role
revoke all on public.guest_saved_places from anon, authenticated;

-- Guardar un sitio. Al pasar del tope se descarta el más antiguo
create or replace function public.add_guest_saved_place(
    p_guest_key_hash text,
    p_property_id uuid,
    p_place_id uuid,
    p_max integer
) returns boolean
language plpgsql
set search_path = ''
as $$
begin
    if p_max is null or p_max <= 0 then
        return false;
    end if;

    -- Solo sitios de tipo location de esta guía
    if not exists (
        select 1 from public.property_data
        where id = p_place_id
          and property_id = p_property_id
          and type = 'location'
    ) then
        return false;
    end if;

    -- Serializa los cambios de una misma lista hasta el fin de la transacción
    perform pg_advisory_xact_lock(
        hashtextextended(p_guest_key_hash || p_property_id::text, 0)
    );

    insert into public.guest_saved_places (guest_key_hash, property_id, place_id)
    values (p_guest_key_hash, p_property_id, p_place_id)
    on conflict do nothing;

    delete from public.guest_saved_places
    where guest_key_hash = p_guest_key_hash
      and property_id = p_property_id
      and place_id in (
          select place_id from public.guest_saved_places
          where guest_key_hash = p_guest_key_hash
            and property_id = p_property_id
          order by created_at desc, place_id
          offset p_max
      );

    -- Cualquier cambio renueva la caducidad de toda la lista
    update public.guest_saved_places
    set updated_at = now()
    where guest_key_hash = p_guest_key_hash
      and property_id = p_property_id;

    return true;
end;
$$;

-- Quitar un sitio (borrado real, no lógico)
create or replace function public.remove_guest_saved_place(
    p_guest_key_hash text,
    p_property_id uuid,
    p_place_id uuid
) returns void
language plpgsql
set search_path = ''
as $$
begin
    perform pg_advisory_xact_lock(
        hashtextextended(p_guest_key_hash || p_property_id::text, 0)
    );

    delete from public.guest_saved_places
    where guest_key_hash = p_guest_key_hash
      and property_id = p_property_id
      and place_id = p_place_id;

    update public.guest_saved_places
    set updated_at = now()
    where guest_key_hash = p_guest_key_hash
      and property_id = p_property_id;
end;
$$;

-- Enlace compartido: lo recibido solo ocupa huecos libres y nunca desplaza
-- lo que ya tenía el huésped
create or replace function public.merge_guest_saved_places(
    p_guest_key_hash text,
    p_property_id uuid,
    p_place_ids uuid[],
    p_max integer
) returns void
language plpgsql
set search_path = ''
as $$
declare
    v_free integer;
begin
    if p_max is null or p_max <= 0
        or coalesce(cardinality(p_place_ids), 0) = 0 then
        return;
    end if;

    perform pg_advisory_xact_lock(
        hashtextextended(p_guest_key_hash || p_property_id::text, 0)
    );

    select p_max - count(*) into v_free
    from public.guest_saved_places
    where guest_key_hash = p_guest_key_hash
      and property_id = p_property_id;

    if v_free <= 0 then
        return;
    end if;

    insert into public.guest_saved_places (guest_key_hash, property_id, place_id)
    select p_guest_key_hash, p_property_id, pd.id
    from public.property_data pd
    where pd.id = any (p_place_ids)
      and pd.property_id = p_property_id
      and pd.type = 'location'
      and not exists (
          select 1 from public.guest_saved_places g
          where g.guest_key_hash = p_guest_key_hash
            and g.property_id = p_property_id
            and g.place_id = pd.id
      )
    order by array_position(p_place_ids, pd.id)
    limit v_free;

    if found then
        update public.guest_saved_places
        set updated_at = now()
        where guest_key_hash = p_guest_key_hash
          and property_id = p_property_id;
    end if;
end;
$$;

-- Purga de listas caducadas
create or replace function public.delete_expired_guest_saved_places()
returns void
language sql
set search_path = ''
as $$
    delete from public.guest_saved_places
    where updated_at < now() - interval '60 days';
$$;

-- Solo service_role puede ejecutar estas funciones (la purga la lanza cron)
revoke execute on function public.add_guest_saved_place(text, uuid, uuid, integer) from public, anon, authenticated;
revoke execute on function public.remove_guest_saved_place(text, uuid, uuid) from public, anon, authenticated;
revoke execute on function public.merge_guest_saved_places(text, uuid, uuid[], integer) from public, anon, authenticated;
revoke execute on function public.delete_expired_guest_saved_places() from public, anon, authenticated;

grant execute on function public.add_guest_saved_place(text, uuid, uuid, integer) to service_role;
grant execute on function public.remove_guest_saved_place(text, uuid, uuid) to service_role;
grant execute on function public.merge_guest_saved_places(text, uuid, uuid[], integer) to service_role;

-- Diario a las 3:30 UTC, lejos de los envíos de email (9:00 y 10:00)
select cron.schedule(
  'purge-guest-saved-places',
  '30 3 * * *',
  $$ select public.delete_expired_guest_saved_places(); $$
);
