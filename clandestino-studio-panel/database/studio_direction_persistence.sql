create table public.studio_operators (
 email text primary key check (email = lower(email)),
 role text not null default 'direction' check(role='direction')
);
alter table public.studio_operators enable row level security;
revoke all on public.studio_operators from anon, authenticated;
grant select on public.studio_operators to authenticated;
create policy operator_self_read on public.studio_operators for select to authenticated
 using (email = (select auth.jwt()->>'email') and (select auth.uid()) is not null);
insert into public.studio_operators(email) values ('direccion@example.com');

create table public.studio_state (
 id text primary key check(id='clandestino'),
 schema_version integer not null default 1 check(schema_version=1),
 revision bigint not null default 1 check(revision>0),
 payload jsonb not null check(jsonb_typeof(payload)='object'),
 updated_at timestamptz not null default now()
);
alter table public.studio_state enable row level security;
revoke all on public.studio_state from anon, authenticated;
grant select, insert, update on public.studio_state to authenticated;
create policy direction_read on public.studio_state for select to authenticated
 using (exists(select 1 from public.studio_operators where email=(select auth.jwt()->>'email')));
create policy direction_insert on public.studio_state for insert to authenticated
 with check (exists(select 1 from public.studio_operators where email=(select auth.jwt()->>'email')));
create policy direction_update on public.studio_state for update to authenticated
 using (exists(select 1 from public.studio_operators where email=(select auth.jwt()->>'email')))
 with check (exists(select 1 from public.studio_operators where email=(select auth.jwt()->>'email')));

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values('studio-private','studio-private',false,262144000,array['image/jpeg','image/png','image/webp','image/gif','video/mp4','video/webm','video/quicktime']);
create policy studio_asset_read on storage.objects for select to authenticated
 using (bucket_id='studio-private' and exists(select 1 from public.studio_operators where email=(select auth.jwt()->>'email')));
create policy studio_asset_insert on storage.objects for insert to authenticated
 with check (bucket_id='studio-private' and (storage.foldername(name))[1]='clandestino' and exists(select 1 from public.studio_operators where email=(select auth.jwt()->>'email')));
