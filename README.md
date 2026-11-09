# Architect Vault

Personal learning hub for system design, LLD and DSA.
Next.js 15 (App Router) + Supabase (Postgres, Auth) + Vercel.

## Run locally

```bash
cp .env.example .env.local   # fill in the Supabase URL and publishable key
npm install
npm run dev                  # http://localhost:3000
```

Without the env vars the app still runs, with sign-in turned off.

## Database

Run `supabase/migrations/0001_init.sql` once in Supabase → SQL Editor.
It creates `profiles` (with RLS and a sign-up trigger) and the `health()` function.

## Structure

```
src/
  app/
    (app)/            signed-in pages inside the shell (dashboard, plan, dsa, …)
    login/            magic-link sign-in
    auth/callback     magic-link landing route
    auth/signout      POST to sign out
    api/health        DB connectivity check
  components/shell/   sidebar, top bar, mobile drawer + bottom bar, theme toggle
  lib/nav.ts          sidebar groups and items
  lib/supabase/       browser, server and middleware clients
supabase/migrations/  SQL migrations
```

## Checks

- `GET /api/health` → `{ "ok": true, "db": "connected" }` when the database is reachable.
