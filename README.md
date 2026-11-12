# ELT Speed Reader

An English reading-skills challenge for practising skimming and scanning.

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to your Supabase project values. Existing setups using `VITE_SUPABASE_ANON_KEY` are also supported.
3. Run `supabase/schema.sql` in your Supabase SQL Editor. It is safe to run again after schema changes and creates the auth profile trigger used by signup.
4. Start the app with `npm run dev`.

The app also starts without Supabase credentials and displays a setup notice instead of a blank page. Sign-in, registration, and saving results require the Supabase variables. For a deployed site, configure both variables in the hosting provider's environment settings and rebuild.

## Signup confirmation redirects

Signup emails redirect to the origin currently serving the app. In Supabase, open **Authentication → URL Configuration**, set **Site URL** to your deployed website address, and add that address to **Redirect URLs**. Keep your local development URL in the allowlist if you also test signups locally.

## Teacher access

1. Create the teacher's account in Supabase Authentication, or have them register through the app first.
2. In the Supabase SQL Editor, assign the teacher role to that account:

   ```sql
   update public.profiles
   set role = 'teacher'
   where id = (
     select id
     from auth.users
     where email = 'teacher@example.com'
   );
   ```

3. The teacher signs in through the app's **Teacher login** option. The app checks that the profile has the `teacher` role before opening the private dashboard. Public student registration always creates a student role, and student accounts are rejected by Teacher login.
