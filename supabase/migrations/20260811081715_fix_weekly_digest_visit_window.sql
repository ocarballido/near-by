drop function if exists public.get_users_for_weekly_digest();

create function public.get_users_for_weekly_digest()
 returns table(user_id uuid, email text, frequency text, total_visits bigint, property_count bigint, last_digest_sent_at timestamptz)
 language sql
 security definer
 set search_path to 'public', 'auth'
as $function$
  with user_visits as (
    select
      p.user_id,
      count(pv.id) as visits_this_week
    from public.properties p
    left join public.property_visits pv
      on pv.property_id = p.id
      and pv.visited_at >= now() - interval '7 days'
    group by p.user_id
  ),
  user_properties as (
    select
      p.user_id,
      count(distinct p.id) as property_count
    from public.properties p
    group by p.user_id
  ),
  incomplete_users as (
    select distinct p.user_id
    from public.properties p
    left join public.property_data pd on pd.property_id = p.id
    group by p.id, p.user_id
    having
      bool_or(pd.type = 'info') = false
      or bool_or(pd.type = 'location') = false
  ),
  last_digest as (
    select user_id, max(sent_at) as last_sent_at
    from public.email_sequence_log
    where type = 'weekly_digest'
    group by user_id
  )
  select
    au.id as user_id,
    au.email,
    case
      when coalesce(uv.visits_this_week, 0) > 0 then 'weekly'
      else 'monthly'
    end as frequency,
    coalesce(uv.visits_this_week, 0) as total_visits,
    coalesce(up.property_count, 0) as property_count,
    ld.last_sent_at as last_digest_sent_at
  from auth.users au
  join user_properties up on up.user_id = au.id
  left join user_visits uv on uv.user_id = au.id
  left join public.profiles pr on pr.user_id = au.id
  left join last_digest ld on ld.user_id = au.id
  where up.property_count > 0
  and au.id not in (select user_id from incomplete_users)
  and (pr.email_opt_out is null or pr.email_opt_out = false)
  order by ld.last_sent_at asc nulls first
$function$;