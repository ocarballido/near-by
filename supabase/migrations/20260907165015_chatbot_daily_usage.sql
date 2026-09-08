-- Límite diario de mensajes que escalan a LLM, por huésped (anon_id) y
-- propiedad. Exclusivo del chatbot.
create table if not exists public.chatbot_daily_usage (
    property_id uuid not null references public.properties(id) on delete cascade,
    anon_id text not null,
    usage_date date not null default current_date,
    message_count int not null default 0,
    primary key (property_id, anon_id, usage_date)
);

alter table public.chatbot_daily_usage enable row level security;
-- Sin políticas públicas: solo se accede vía service role, igual que
-- ai_monthly_cost.

-- Incremento atómico en un único paso. A diferencia de
-- increment_ai_monthly_cost (que se llama DESPUÉS del LLM, con el coste
-- real ya conocido), este se llama ANTES: aquí solo hay un recuento de
-- mensajes, no un coste que calcular todavía.
create or replace function public.increment_chatbot_daily_usage(
    p_property_id uuid,
    p_anon_id text
) returns int
language plpgsql
security definer
as $$
declare
    new_count int;
begin
    insert into public.chatbot_daily_usage (property_id, anon_id, usage_date, message_count)
    values (p_property_id, p_anon_id, current_date, 1)
    on conflict (property_id, anon_id, usage_date)
    do update set message_count = chatbot_daily_usage.message_count + 1
    returning message_count into new_count;

    return new_count;
end;
$$;