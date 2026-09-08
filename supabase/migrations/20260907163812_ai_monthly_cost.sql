-- supabase/migrations/20260907130000_ai_monthly_cost.sql

-- Presupuesto mensual compartido: lo usa tanto el chatbot de huéspedes como
-- la generación de contenido de propietarios (ver decisión: tope por
-- propiedad COMPARTIDO entre ambas features). scope_id vale 'global' para
-- el techo de toda la plataforma, o el property_id (como texto) para el
-- techo individual de esa propiedad.
create table if not exists public.ai_monthly_cost (
    scope_id text not null,
    month date not null,
    cost_usd numeric(10, 6) not null default 0,
    primary key (scope_id, month)
);

alter table public.ai_monthly_cost enable row level security;
-- Sin políticas públicas: solo se escribe/lee vía service role
-- (createServerAdminClient), igual que el resto de tablas de uso interno.

-- Incremento atómico de las dos filas (global + propiedad) en una sola
-- llamada, para no depender de dos round-trips separados desde la app.
-- Solo se llama DESPUÉS de la respuesta del LLM, con el coste real
-- calculado a partir de los tokens que devuelve la propia API — nunca con
-- una estimación previa.
create or replace function public.increment_ai_monthly_cost(
    p_property_id uuid,
    p_amount_usd numeric
) returns table (global_cost_usd numeric, property_cost_usd numeric)
language plpgsql
security definer
as $$
declare
    v_month date := date_trunc('month', current_date)::date;
    v_global numeric;
    v_property numeric;
begin
    insert into public.ai_monthly_cost (scope_id, month, cost_usd)
    values ('global', v_month, p_amount_usd)
    on conflict (scope_id, month)
    do update set cost_usd = ai_monthly_cost.cost_usd + p_amount_usd
    returning cost_usd into v_global;

    insert into public.ai_monthly_cost (scope_id, month, cost_usd)
    values (p_property_id::text, v_month, p_amount_usd)
    on conflict (scope_id, month)
    do update set cost_usd = ai_monthly_cost.cost_usd + p_amount_usd
    returning cost_usd into v_property;

    return query select v_global, v_property;
end;
$$;