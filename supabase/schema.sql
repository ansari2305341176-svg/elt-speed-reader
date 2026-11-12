-- ELT Speed Reader: Supabase setup

create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text not null,
    student_id text,
    role text not null default 'student' check (role in ('student', 'teacher')),
    created_at timestamptz not null default now()
);

create index if not exists profiles_student_id_idx
    on public.profiles (student_id);

create table if not exists public.submissions (
    student_id uuid primary key references public.profiles(id) on delete cascade,
    total_score integer not null check (total_score between 0 and 6),
    skimming_score integer not null check (skimming_score between 0 and 3),
    scanning_score integer not null check (scanning_score between 0 and 3),
    answers jsonb not null check (
        jsonb_typeof(answers) = 'array'
        and jsonb_array_length(answers) = 6
    ),
    notice_answers jsonb not null,
    feedback text not null default '',
    revision_completed boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint submissions_score_total_matches
        check (total_score = skimming_score + scanning_score)
);

create or replace function public.is_teacher()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1
        from public.profiles
        where id = (select auth.uid())
          and role = 'teacher'
    );
$$;

revoke all on function public.is_teacher() from public;
grant execute on function public.is_teacher() to authenticated;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
    insert into public.profiles (id, full_name, student_id, role)
    values (
        new.id,
        coalesce(
            nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
            nullif(split_part(coalesce(new.email, ''), '@', 1), ''),
            'Student'
        ),
        nullif(trim(new.raw_user_meta_data ->> 'student_id'), ''),
        'student'
    )
    on conflict (id) do update
        set full_name = excluded.full_name,
            student_id = excluded.student_id;
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

insert into public.profiles (id, full_name, student_id, role)
select
    u.id,
    coalesce(
        nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''),
        nullif(split_part(coalesce(u.email, ''), '@', 1), ''),
        'Student'
    ),
    nullif(trim(u.raw_user_meta_data ->> 'student_id'), ''),
    'student'
from auth.users as u
on conflict (id) do nothing;

create or replace function public.set_submission_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists set_submission_updated_at on public.submissions;
create trigger set_submission_updated_at
    before update on public.submissions
    for each row execute function public.set_submission_updated_at();

alter table public.profiles enable row level security;
alter table public.submissions enable row level security;

drop policy if exists "Users and teachers can read profiles"
    on public.profiles;
create policy "Users and teachers can read profiles"
    on public.profiles
    for select
    to authenticated
    using (id = (select auth.uid()) or (select public.is_teacher()));

drop policy if exists "Users and teachers can read submissions"
    on public.submissions;
create policy "Users and teachers can read submissions"
    on public.submissions
    for select
    to authenticated
    using (student_id = (select auth.uid()) or (select public.is_teacher()));

drop policy if exists "Students can insert their own submission"
    on public.submissions;
create policy "Students can insert their own submission"
    on public.submissions
    for insert
    to authenticated
    with check (student_id = (select auth.uid()));

drop policy if exists "Students can update their own submission"
    on public.submissions;
create policy "Students can update their own submission"
    on public.submissions
    for update
    to authenticated
    using (student_id = (select auth.uid()))
    with check (student_id = (select auth.uid()));

revoke all on public.profiles from anon;
revoke all on public.submissions from anon;
grant select on public.profiles to authenticated;
grant select, insert, update on public.submissions to authenticated;

drop view if exists public.teacher_results;
create view public.teacher_results
with (security_invoker = true)
as
select
    p.id as student_uuid,
    p.full_name,
    p.student_id as student_code,
    s.total_score,
    s.skimming_score,
    s.scanning_score,
    coalesce(s.revision_completed, false) as revision_completed,
    (s.student_id is not null) as submitted,
    s.answers,
    s.feedback,
    coalesce(s.updated_at, p.created_at) as updated_at
from public.profiles as p
left join public.submissions as s on s.student_id = p.id
where p.role = 'student';

grant select on public.teacher_results to authenticated;
