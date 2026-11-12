
-- =====================================================
-- ELT SPEED READER: SUPABASE DATABASE SETUP
-- =====================================================

-- 1. Teacher accounts
create table if not exists public.teacher_profiles (
    user_id uuid primary key references auth.users(id) on delete cascade,
    full_name text not null,
    created_at timestamptz not null default now()
);

-- 2. Student assessment results
create table if not exists public.student_results (
    id uuid primary key default gen_random_uuid(),

    student_name text not null
        check (char_length(trim(student_name)) between 2 and 100),

    student_id text not null
        check (char_length(trim(student_id)) between 2 and 40),

    total_score integer not null
        check (total_score between 0 and 6),

    skimming_score integer not null
        check (skimming_score between 0 and 3),

    scanning_score integer not null
        check (scanning_score between 0 and 3),

    answers jsonb not null
        check (
            jsonb_typeof(answers) = 'array'
            and jsonb_array_length(answers) = 6
        ),

    revision_completed boolean not null default false,

    created_at timestamptz not null default now(),

    constraint score_total_matches
        check (total_score = skimming_score + scanning_score)
);

-- 3. Indexes for teacher dashboard searches
create index if not exists student_results_student_id_idx
    on public.student_results (student_id);

create index if not exists student_results_created_at_idx
    on public.student_results (created_at desc);

-- 4. Teacher verification function
create or replace function public.is_teacher()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
    select exists (
        select 1
        from public.teacher_profiles
        where user_id = (select auth.uid())
    );
$$;

-- Only authenticated users need to execute this function
revoke all on function public.is_teacher() from public;
grant execute on function public.is_teacher() to authenticated;

-- 5. Enable Row Level Security
alter table public.teacher_profiles enable row level security;
alter table public.student_results enable row level security;

-- 6. Teacher can read their own teacher profile
drop policy if exists "Teacher can read own profile"
    on public.teacher_profiles;

create policy "Teacher can read own profile"
on public.teacher_profiles
for select
to authenticated
using (user_id = (select auth.uid()));

-- 7. Students can submit results
-- They cannot read, update or delete results.
drop policy if exists "Allow assessment result submission"
    on public.student_results;

create policy "Allow assessment result submission"
on public.student_results
for insert
to anon, authenticated
with check (
    char_length(trim(student_name)) between 2 and 100
    and char_length(trim(student_id)) between 2 and 40
    and total_score between 0 and 6
    and skimming_score between 0 and 3
    and scanning_score between 0 and 3
    and total_score = skimming_score + scanning_score
    and jsonb_typeof(answers) = 'array'
    and jsonb_array_length(answers) = 6
);

-- 8. Only registered teachers can read student results
drop policy if exists "Teachers can read all student results"
    on public.student_results;

create policy "Teachers can read all student results"
on public.student_results
for select
to authenticated
using ((select public.is_teacher()));

-- 9. Table permissions
grant insert on public.student_results to anon, authenticated;
grant select on public.student_results to authenticated;
grant select on public.teacher_profiles to authenticated;

-- No public access to teacher profiles
revoke all on public.teacher_profiles from anon;

-- No student update or delete permissions
revoke update, delete on public.student_results from anon, authenticated;

-- =====================================================
-- END OF SETUP
-- =====================================================
