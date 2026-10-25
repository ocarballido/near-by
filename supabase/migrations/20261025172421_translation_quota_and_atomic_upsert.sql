-- Cuota de traducción con IA y guardado atómico de traducciones.
--
-- 1) translation_usage (global, mensual) gana tokens reales de entrada y
--    salida, para observar el coste real además de los caracteres.
-- 2) translation_user_daily_usage: uso por anfitrión y día (límite por
--    usuario; los límites los fija la app, ver translation-quota.ts).
-- 3) reserve_translation_quota: reserva atómica global + usuario ANTES de
--    llamar al LLM. Si no hay cupo en cualquiera de los dos, no reserva nada.
-- 4) record_translation_tokens: suma los tokens reales DESPUÉS de la llamada.
-- 5) upsert_*_translations_if_current: guarda las traducciones solo si el
--    texto original sigue siendo el que se tradujo, bloqueando la fila de
--    origen durante la comprobación y el guardado (una sola transacción).
--
-- Todas las funciones: solo service_role (sin EXECUTE para public, anon ni
-- authenticated) y search_path vacío.

-- 1) Tokens reales en el contador global
alter table public.translation_usage
    add column if not exists input_tokens bigint not null default 0,
    add column if not exists output_tokens bigint not null default 0;

-- 2) Uso por anfitrión y día
create table if not exists public.translation_user_daily_usage (
    user_id uuid not null references auth.users(id) on delete cascade,
    usage_date date not null default current_date,
    chars_used integer not null default 0,
    calls_used integer not null default 0,
    input_tokens bigint not null default 0,
    output_tokens bigint not null default 0,
    primary key (user_id, usage_date)
);

alter table public.translation_user_daily_usage enable row level security;
-- Sin políticas: solo se accede vía service role
revoke all on public.translation_user_daily_usage from anon, authenticated;

-- 3) Reserva atómica de cuota
create or replace function public.reserve_translation_quota(
    p_user_id uuid,
    p_chars integer,
    p_monthly_limit integer,
    p_daily_limit integer
) returns boolean
language plpgsql
set search_path = ''
as $$
declare
    v_month text := to_char(now() at time zone 'utc', 'YYYY-MM');
begin
    if p_chars is null or p_chars <= 0 then
        return false;
    end if;

    insert into public.translation_usage (month)
    values (v_month)
    on conflict (month) do nothing;

    -- Global: el UPDATE condicional bloquea la fila, así dos reservas
    -- simultáneas no pueden pasar ambas del límite
    -- (chars_used/calls_used admiten null en la tabla original: coalesce)
    update public.translation_usage
    set chars_used = coalesce(chars_used, 0) + p_chars,
        calls_used = coalesce(calls_used, 0) + 1,
        updated_at = now()
    where month = v_month
      and not coalesce(paused, false)
      and coalesce(chars_used, 0) + p_chars <= p_monthly_limit;

    if not found then
        return false;
    end if;

    -- Usuario: mismo patrón con INSERT ... ON CONFLICT DO UPDATE WHERE
    insert into public.translation_user_daily_usage as u
        (user_id, usage_date, chars_used, calls_used)
    select p_user_id, current_date, p_chars, 1
    where p_chars <= p_daily_limit
    on conflict (user_id, usage_date) do update
    set chars_used = u.chars_used + excluded.chars_used,
        calls_used = u.calls_used + 1
    where u.chars_used + excluded.chars_used <= p_daily_limit;

    if not found then
        -- Sin cupo de usuario: se deshace la reserva global (misma transacción)
        update public.translation_usage
        set chars_used = coalesce(chars_used, 0) - p_chars,
            calls_used = coalesce(calls_used, 0) - 1,
            updated_at = now()
        where month = v_month;
        return false;
    end if;

    return true;
end;
$$;

-- 4) Tokens reales tras la llamada
create or replace function public.record_translation_tokens(
    p_user_id uuid,
    p_input_tokens integer,
    p_output_tokens integer
) returns void
language plpgsql
set search_path = ''
as $$
declare
    v_month text := to_char(now() at time zone 'utc', 'YYYY-MM');
begin
    update public.translation_usage
    set input_tokens = input_tokens + p_input_tokens,
        output_tokens = output_tokens + p_output_tokens,
        updated_at = now()
    where month = v_month;

    update public.translation_user_daily_usage
    set input_tokens = input_tokens + p_input_tokens,
        output_tokens = output_tokens + p_output_tokens
    where user_id = p_user_id
      and usage_date = current_date;
end;
$$;

-- 5) Guardado atómico, una función por tabla de traducciones.
-- p_translations: {"en": "...", "fr": "..."} (sin el idioma original).
-- Devuelve false si el texto original ya no coincide (traducción obsoleta).

create or replace function public.upsert_property_data_translations_if_current(
    p_id uuid,
    p_field_key text,
    p_source_value text,
    p_source_lang text,
    p_translations jsonb
) returns boolean
language plpgsql
set search_path = ''
as $$
declare
    v_current text;
begin
    select case p_field_key
               when 'name' then name
               when 'description' then description
           end
    into v_current
    from public.property_data
    where id = p_id
    for update;

    if not found or v_current is distinct from p_source_value then
        return false;
    end if;

    insert into public.property_data_translations
        (property_data_id, lang, field_key, translated_value, source_lang, updated_at)
    select p_id, t.key, p_field_key, t.value, p_source_lang, now()
    from jsonb_each_text(p_translations) as t
    on conflict (property_data_id, lang, field_key) do update
    set translated_value = excluded.translated_value,
        source_lang = excluded.source_lang,
        updated_at = excluded.updated_at;

    return true;
end;
$$;

create or replace function public.upsert_property_translations_if_current(
    p_id uuid,
    p_field_key text,
    p_source_value text,
    p_source_lang text,
    p_translations jsonb
) returns boolean
language plpgsql
set search_path = ''
as $$
declare
    v_current text;
begin
    select case p_field_key
               when 'name' then name::text
               when 'description' then description
               when 'summary' then summary
               when 'access_instructions' then access_instructions
           end
    into v_current
    from public.properties
    where id = p_id
    for update;

    if not found or v_current is distinct from p_source_value then
        return false;
    end if;

    insert into public.property_translations
        (property_id, lang, field_key, translated_value, source_lang, updated_at)
    select p_id, t.key, p_field_key, t.value, p_source_lang, now()
    from jsonb_each_text(p_translations) as t
    on conflict (property_id, lang, field_key) do update
    set translated_value = excluded.translated_value,
        source_lang = excluded.source_lang,
        updated_at = excluded.updated_at;

    return true;
end;
$$;

create or replace function public.upsert_property_details_translations_if_current(
    p_id uuid,
    p_field_key text,
    p_source_value text,
    p_source_lang text,
    p_translations jsonb
) returns boolean
language plpgsql
set search_path = ''
as $$
declare
    v_current text;
begin
    select case p_field_key
               when 'name' then name
               when 'instructions' then instructions
               when 'guidelines' then guidelines
           end
    into v_current
    from public.property_details
    where id = p_id
    for update;

    if not found or v_current is distinct from p_source_value then
        return false;
    end if;

    insert into public.property_details_translations
        (property_detail_id, lang, field_key, translated_value, source_lang, updated_at)
    select p_id, t.key, p_field_key, t.value, p_source_lang, now()
    from jsonb_each_text(p_translations) as t
    on conflict (property_detail_id, lang, field_key) do update
    set translated_value = excluded.translated_value,
        source_lang = excluded.source_lang,
        updated_at = excluded.updated_at;

    return true;
end;
$$;

-- Solo service_role puede ejecutar estas funciones
revoke execute on function public.reserve_translation_quota(uuid, integer, integer, integer) from public, anon, authenticated;
revoke execute on function public.record_translation_tokens(uuid, integer, integer) from public, anon, authenticated;
revoke execute on function public.upsert_property_data_translations_if_current(uuid, text, text, text, jsonb) from public, anon, authenticated;
revoke execute on function public.upsert_property_translations_if_current(uuid, text, text, text, jsonb) from public, anon, authenticated;
revoke execute on function public.upsert_property_details_translations_if_current(uuid, text, text, text, jsonb) from public, anon, authenticated;

grant execute on function public.reserve_translation_quota(uuid, integer, integer, integer) to service_role;
grant execute on function public.record_translation_tokens(uuid, integer, integer) to service_role;
grant execute on function public.upsert_property_data_translations_if_current(uuid, text, text, text, jsonb) to service_role;
grant execute on function public.upsert_property_translations_if_current(uuid, text, text, text, jsonb) to service_role;
grant execute on function public.upsert_property_details_translations_if_current(uuid, text, text, text, jsonb) to service_role;
