-- Tokens de traducciones lanzadas por procesos del operador (scripts de
-- migración de traducciones). Solo contador global: no hay anfitrión al que
-- imputarlos y no reservan cuota (un backfill de idioma agotaría el cupo
-- mensual de todos los anfitriones).
--
-- A diferencia de record_translation_tokens, aquí no hay una reserva previa
-- que garantice la fila del mes: se crea si no existe.
--
-- Solo service_role y search_path vacío, como el resto de funciones de
-- traducción.

create or replace function public.record_system_translation_tokens(
    p_input_tokens integer,
    p_output_tokens integer
) returns void
language plpgsql
set search_path = ''
as $$
declare
    v_month text := to_char(now() at time zone 'utc', 'YYYY-MM');
begin
    insert into public.translation_usage as u (month, input_tokens, output_tokens)
    values (v_month, p_input_tokens, p_output_tokens)
    on conflict (month) do update
    set input_tokens = u.input_tokens + excluded.input_tokens,
        output_tokens = u.output_tokens + excluded.output_tokens,
        updated_at = now();
end;
$$;

revoke execute on function public.record_system_translation_tokens(integer, integer) from public, anon, authenticated;
grant execute on function public.record_system_translation_tokens(integer, integer) to service_role;
