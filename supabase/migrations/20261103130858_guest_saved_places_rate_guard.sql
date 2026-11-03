-- Cortacircuitos de guest_saved_places (revisión de seguridad, hallazgo S1).
--
-- El endpoint es público: sin límite, un script podría crear claves sin fin
-- (y hasta 50 filas por petición con el merge). Si en la última hora se han
-- creado en toda la app tantas filas como el umbral que fija la app, no se
-- crean listas nuevas; quien ya tiene lista sigue guardando y quitando.
--
-- add y merge pasan a devolver un estado en texto. Cambiar el tipo de
-- retorno obliga a recrearlas; el código de producción aún no las usa.

-- Cuenta acotada de las filas de la última hora
create index if not exists guest_saved_places_created_at_idx
    on public.guest_saved_places (created_at);

drop function if exists public.add_guest_saved_place(text, uuid, uuid, integer);
drop function if exists public.merge_guest_saved_places(text, uuid, uuid[], integer);

-- Guardar un sitio: 'added', 'not_found' (no es un sitio de tipo location de
-- esta guía) o 'limited' (lista nueva con el cortacircuitos activado). Al
-- pasar del tope se descarta el más antiguo
create function public.add_guest_saved_place(
    p_guest_key_hash text,
    p_property_id uuid,
    p_place_id uuid,
    p_max integer,
    p_hourly_limit integer
) returns text
language plpgsql
set search_path = ''
as $$
begin
    if p_max is null or p_max <= 0
        or p_hourly_limit is null or p_hourly_limit <= 0 then
        raise exception 'p_max y p_hourly_limit deben ser mayores que 0';
    end if;

    if not exists (
        select 1 from public.property_data
        where id = p_place_id
          and property_id = p_property_id
          and type = 'location'
    ) then
        return 'not_found';
    end if;

    -- Serializa los cambios de una misma lista hasta el fin de la transacción
    perform pg_advisory_xact_lock(
        hashtextextended(p_guest_key_hash || p_property_id::text, 0)
    );

    -- Lista nueva: cortacircuitos. La subconsulta con limit acota el recuento
    -- aunque haya un ataque en curso
    if not exists (
        select 1 from public.guest_saved_places
        where guest_key_hash = p_guest_key_hash
          and property_id = p_property_id
    ) and (
        select count(*) from (
            select 1 from public.guest_saved_places
            where created_at > now() - interval '1 hour'
            limit p_hourly_limit
        ) recent
    ) >= p_hourly_limit then
        return 'limited';
    end if;

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

    return 'added';
end;
$$;

-- Enlace compartido: 'merged' o 'limited'. Lo recibido solo ocupa huecos
-- libres y nunca desplaza lo que ya tenía el huésped
create function public.merge_guest_saved_places(
    p_guest_key_hash text,
    p_property_id uuid,
    p_place_ids uuid[],
    p_max integer,
    p_hourly_limit integer
) returns text
language plpgsql
set search_path = ''
as $$
declare
    v_free integer;
begin
    if p_max is null or p_max <= 0
        or p_hourly_limit is null or p_hourly_limit <= 0 then
        raise exception 'p_max y p_hourly_limit deben ser mayores que 0';
    end if;

    if coalesce(cardinality(p_place_ids), 0) = 0 then
        return 'merged';
    end if;

    perform pg_advisory_xact_lock(
        hashtextextended(p_guest_key_hash || p_property_id::text, 0)
    );

    select p_max - count(*) into v_free
    from public.guest_saved_places
    where guest_key_hash = p_guest_key_hash
      and property_id = p_property_id;

    -- Lista nueva (sin filas): cortacircuitos, igual que en add
    if v_free = p_max and (
        select count(*) from (
            select 1 from public.guest_saved_places
            where created_at > now() - interval '1 hour'
            limit p_hourly_limit
        ) recent
    ) >= p_hourly_limit then
        return 'limited';
    end if;

    if v_free <= 0 then
        return 'merged';
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

    return 'merged';
end;
$$;

-- Solo service_role puede ejecutarlas
revoke execute on function public.add_guest_saved_place(text, uuid, uuid, integer, integer) from public, anon, authenticated;
revoke execute on function public.merge_guest_saved_places(text, uuid, uuid[], integer, integer) from public, anon, authenticated;

grant execute on function public.add_guest_saved_place(text, uuid, uuid, integer, integer) to service_role;
grant execute on function public.merge_guest_saved_places(text, uuid, uuid[], integer, integer) to service_role;
