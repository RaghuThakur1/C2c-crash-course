create extension if not exists pgcrypto;

create table if not exists public.club_signups (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (length(trim(full_name)) between 1 and 100),
  student_id text not null check (length(trim(student_id)) between 1 and 50),
  club_name text not null check (
    club_name in (
      'Art',
      'Chess',
      'Debate',
      'Drama',
      'Robotics',
      'Student Council'
    )
  ),
  created_at timestamptz not null default now(),
  unique (student_id, club_name)
);

alter table public.club_signups enable row level security;

revoke all on public.club_signups from anon, authenticated;
revoke all on public.club_signups from public;
grant select, insert on public.club_signups to anon, authenticated;

drop policy if exists "Anyone can view club signups" on public.club_signups;
create policy "Anyone can view club signups"
  on public.club_signups
  for select
  to anon, authenticated
  using (true);

drop policy if exists "Anyone can add club signups" on public.club_signups;
create policy "Anyone can add club signups"
  on public.club_signups
  for insert
  to anon, authenticated
  with check (
    length(trim(full_name)) between 1 and 100
    and length(trim(student_id)) between 1 and 50
    and club_name in (
      'Art',
      'Chess',
      'Debate',
      'Drama',
      'Robotics',
      'Student Council'
    )
  );
