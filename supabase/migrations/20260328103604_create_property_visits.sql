-- Tabla
create table public.property_visits (
  id uuid default gen_random_uuid() primary key,
  property_id uuid not null references public.properties(id) on delete cascade,
  visited_at timestamp with time zone default now() not null
);

-- Índices
create index property_visits_property_id_idx on public.property_visits (property_id);
create index property_visits_visited_at_idx on public.property_visits (visited_at);

-- RLS
alter table public.property_visits enable row level security;

-- Solo service_role puede insertar (el tracking lo hacemos desde servidor)
-- No necesitamos policy de select para usuarios normales
-- El dashboard consulta via RPC con service_role

-- Retención: eliminar registros de más de 90 días automáticamente
create or replace function public.delete_old_property_visits()
returns void
language sql
security definer
as $$
  delete from public.property_visits
  where visited_at < now() - interval '90 days';
$$;

-- RPC para el dashboard: visitas agrupadas por semana
create or replace function public.get_property_visits_by_user(p_user_id uuid)
returns table (
  week_label text,
  week_start date,
  week_end date,
  visit_count bigint
)
language sql
security definer
as $$
  with weeks as (
    select
      0 as week_offset,
      date_trunc('week', now())::date as week_start,
      (date_trunc('week', now()) + interval '6 days')::date as week_end
    union all
    select
      1,
      (date_trunc('week', now()) - interval '7 days')::date,
      (date_trunc('week', now()) - interval '1 day')::date
    union all
    select
      2,
      (date_trunc('week', now()) - interval '14 days')::date,
      (date_trunc('week', now()) - interval '8 days')::date
  ),
  user_properties as (
    select id from public.properties where user_id = p_user_id
  ),
  visits as (
    select
      pv.visited_at,
      pv.property_id
    from public.property_visits pv
    inner join user_properties up on up.id = pv.property_id
    where pv.visited_at >= (date_trunc('week', now()) - interval '14 days')
  )
  select
    case w.week_offset
      when 0 then 'this_week'
      when 1 then 'last_week'
      when 2 then 'two_weeks_ago'
    end as week_label,
    w.week_start,
    w.week_end,
    count(v.visited_at) as visit_count
  from weeks w
  left join visits v on v.visited_at::date between w.week_start and w.week_end
  group by w.week_offset, w.week_start, w.week_end
  order by w.week_offset asc;
$$;