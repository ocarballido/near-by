-- Normalize uid() -> auth.uid() across policies (except todo_list)

-- ai_usage
alter table public.ai_usage enable row level security;
drop policy if exists "Allow user to read their own usage" on public.ai_usage;
create policy "Allow user to read their own usage"
on public.ai_usage
for select
to public
using (auth.uid() = user_id);

-- feedback_messages
alter table public.feedback_messages enable row level security;
drop policy if exists "Users can insert their own feedback" on public.feedback_messages;
create policy "Users can insert their own feedback"
on public.feedback_messages
for insert
to authenticated
with check (user_id = auth.uid());

-- location_groups (there are two insert policies)
alter table public.location_groups enable row level security;

drop policy if exists "Allow authenticated inserts" on public.location_groups;
create policy "Allow authenticated inserts"
on public.location_groups
for insert
to public
with check (auth.uid() is not null);

drop policy if exists "Allow authenticated inserts on location_groups" on public.location_groups;
create policy "Allow authenticated inserts on location_groups"
on public.location_groups
for insert
to authenticated
with check (auth.uid() is not null);

-- locations
alter table public.locations enable row level security;
drop policy if exists "Allow insert for authenticated" on public.locations;
create policy "Allow insert for authenticated"
on public.locations
for insert
to authenticated
with check (auth.uid() is not null);

-- properties
alter table public.properties enable row level security;

drop policy if exists "Users can view their own properties" on public.properties;
create policy "Users can view their own properties"
on public.properties
for select
to public
using (user_id = (select auth.uid() as uid));

drop policy if exists "Users can insert their own properties" on public.properties;
create policy "Users can insert their own properties"
on public.properties
for insert
to public
with check (user_id = (select auth.uid() as uid));

drop policy if exists "Users can update their own properties" on public.properties;
create policy "Users can update their own properties"
on public.properties
for update
to public
using (user_id = (select auth.uid() as uid));

drop policy if exists "Users can delete their own properties" on public.properties;
create policy "Users can delete their own properties"
on public.properties
for delete
to public
using (user_id = (select auth.uid() as uid));

-- property_data (SELECT policy only, keep same name)
alter table public.property_data enable row level security;
drop policy if exists "property_data_select_own" on public.property_data;
create policy "property_data_select_own"
on public.property_data
for select
to public
using (
  exists (
    select 1
    from public.properties p
    where p.id = property_data.property_id
      and p.user_id = auth.uid()
  )
);