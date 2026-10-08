# Clubhouse

A simple shared school-club sign-up app built with Next.js and Supabase. Students can sign up without accounts, and the roster is publicly viewable.

## Run locally

1. Install Node.js 20.9 or later.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a Supabase project at [supabase.com](https://supabase.com).
4. In the Supabase SQL Editor, run [`supabase/schema.sql`](./supabase/schema.sql).
5. Copy `.env.example` to `.env.local`, then set:
   - `NEXT_PUBLIC_SUPABASE_URL` to your Supabase project URL.
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the project's public anon/publishable API key.
6. Start the app:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000).

Without Supabase configuration, the app displays setup guidance and does not save sign-ups.

## Clubs

The starter clubs and descriptions are in [`src/lib/clubs.ts`](./src/lib/clubs.ts). If you change the club names, update the allowed names in `supabase/schema.sql` as well so the form and database stay in sync.

## Public roster and data

This version intentionally has no sign-in. Anyone who can access the app can read names, student IDs, and club memberships, and can submit a registration. The form and roster show this clearly. Use it only if the school has approved making this information public. Do not use a Supabase service-role key in the app; only the public anon/publishable key belongs in `.env.local`.

The database rejects duplicate sign-ups for the same student ID and club while allowing a student to join more than one club. It grants only read and insert access to the public roles; updating and deleting registrations are not exposed by this app.

## Checks

```bash
npm run lint
npm run typecheck
npm run build
```
