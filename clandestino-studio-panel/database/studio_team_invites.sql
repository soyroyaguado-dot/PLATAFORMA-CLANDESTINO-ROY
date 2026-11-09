create table public.studio_team_settings(id text primary key check(id='clandestino'),enabled boolean not null default false);
alter table public.studio_team_settings enable row level security;
revoke all on public.studio_team_settings from anon,authenticated;
grant select on public.studio_team_settings to authenticated;
create policy direction_team_settings on public.studio_team_settings for select to authenticated using (exists(select 1 from public.studio_operators where email=(select auth.jwt()->>'email')));
insert into public.studio_team_settings(id) values('clandestino');
create table public.studio_invites(email text primary key,person_index integer not null,user_id uuid,status text not null check(status in ('sending','sent','failed')),sent_at timestamptz,attempt_at timestamptz not null default now(),attempt_id uuid not null);
alter table public.studio_invites enable row level security;
revoke all on public.studio_invites from anon,authenticated;
grant select on public.studio_invites to authenticated;
create policy direction_invites_read on public.studio_invites for select to authenticated using (exists(select 1 from public.studio_operators where email=(select auth.jwt()->>'email')));
create function public.studio_claim_invite(target_email text,target_person integer) returns uuid language plpgsql security invoker set search_path='' as $$
declare claim_id uuid:=gen_random_uuid(); claimed uuid;
begin
insert into public.studio_invites as i(email,person_index,status,attempt_id,attempt_at) values(lower(target_email),target_person,'sending',claim_id,now())
on conflict(email) do update set person_index=excluded.person_index,status='sending',attempt_id=excluded.attempt_id,attempt_at=now() where i.attempt_at<now()-interval '60 seconds' returning attempt_id into claimed;
return claimed;
end $$;
revoke all on function public.studio_claim_invite(text,integer) from public,anon,authenticated;
grant execute on function public.studio_claim_invite(text,integer) to service_role;
