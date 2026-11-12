# ELT Speed Reader

An English reading-skills challenge for practising skimming and scanning.

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` to your Supabase project values. Existing setups using `VITE_SUPABASE_ANON_KEY` are also supported.
3. Run `supabase/schema.sql` in your Supabase SQL Editor. It is safe to run again after schema changes and creates the auth profile trigger used by signup.
4. Start the app with `npm run dev`.

The app also starts without Supabase credentials and displays a setup notice instead of a blank page. Sign-in, registration, and saving results require the Supabase variables. For a deployed site, configure both variables in the hosting provider's environment settings and rebuild.
