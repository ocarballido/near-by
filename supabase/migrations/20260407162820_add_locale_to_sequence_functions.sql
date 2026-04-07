-- Función 1: usuarios sin propiedad
drop function if exists get_users_without_property(int);

create function get_users_without_property(days_offset int default 0)
returns table (
  id                  uuid,
  email               text,
  days_since_register int,
  locale              text
)
language sql
security definer
as $$
  select
    au.id,
    au.email,
    extract(day from (now() + (days_offset || ' days')::interval) - au.created_at)::int as days_since_register,
    coalesce(pr.locale, 'en') as locale
  from auth.users au
  left join public.properties p on p.user_id = au.id
  left join public.profiles pr on pr.user_id = au.id
  where p.user_id is null
    and (pr.email_opt_out is null or pr.email_opt_out = false)
$$;

-- Función 2: propiedades incompletas
drop function if exists get_incomplete_properties(int);

create function get_incomplete_properties(days_offset int default 0)
returns table (
  property_id        uuid,
  property_name      text,
  user_id            uuid,
  email              text,
  days_since_created int,
  locale             text
)
language sql
security definer
as $$
  select
    p.id as property_id,
    p.name as property_name,
    p.user_id,
    au.email,
    extract(day from (now() + (days_offset || ' days')::interval) - p.created_at)::int as days_since_created,
    coalesce(pr.locale, 'en') as locale
  from public.properties p
  join auth.users au on au.id = p.user_id
  left join public.profiles pr on pr.user_id = p.user_id
  left join public.property_data pd on pd.property_id = p.id
  where (pr.email_opt_out is null or pr.email_opt_out = false)
  group by p.id, p.name, p.user_id, au.email, p.created_at, days_offset, pr.locale
  having
    bool_or(pd.type = 'info') = false
    or bool_or(pd.type = 'location') = false
$$;

-- Función 3: propiedades sin localizaciones etiquetadas
drop function if exists get_properties_without_featured(int);

create function get_properties_without_featured(days_offset int default 0)
returns table (
  property_id        uuid,
  property_name      text,
  user_id            uuid,
  email              text,
  days_since_created int,
  locale             text
)
language sql
security definer
as $$
  select distinct
    p.id as property_id,
    p.name as property_name,
    p.user_id,
    au.email,
    extract(day from (now() + (days_offset || ' days')::interval) - p.created_at)::int as days_since_created,
    coalesce(pr.locale, 'en') as locale
  from public.properties p
  join auth.users au on au.id = p.user_id
  left join public.profiles pr on pr.user_id = p.user_id
  join public.property_data pd on pd.property_id = p.id
    and pd.type = 'location'
  where (pr.email_opt_out is null or pr.email_opt_out = false)
    and not exists (
      select 1
      from public.property_data pd2
      where pd2.property_id = p.id
        and (pd2.featured = true or pd2.must_visit = true)
    )
$$;