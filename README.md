# RST Style Studio LK

Portfolio, quotation and admin platform for RST Style Studio LK, a home music studio in Sri Lanka.

- **Public site** in Sinhala (default), English and Italian: song/project portfolio, contributor profiles, services, contact, and a Music Arcade with monthly leaderboards.
- **Quotation wizard**: visitors pick collaborators per role, get a ±15% estimate (plus tax, if configured), and the request is saved and optionally sent via WhatsApp.
- **Artist portal** (`/portal`): contributors edit their profile and claim credits on songs.
- **Admin dashboard** (`/admin`): manage songs, videos, profiles, collaborators and prices, quotations, claims, media, games, settings, team roles, audit logs and backups.

See [RST_Style_Studio_LK_Documentation.md](RST_Style_Studio_LK_Documentation.md) for the full product spec.

## Stack

Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · next-intl · Prisma 7 + PostgreSQL (Supabase) · Supabase Auth & Storage · Resend + Nodemailer · Vercel (hosting and cron).

> Next.js 16 has breaking changes from earlier versions, e.g. `middleware.ts` is now `src/proxy.ts`. Check `node_modules/next/dist/docs/` before relying on older patterns.

## Getting started

```bash
npm install
cp .env.example .env        # fill in the values; see comments in the file
npx prisma migrate deploy   # apply migrations (see "Database" below for existing DBs)
npx prisma db seed          # optional sample data
npm run dev
```

Open http://localhost:3000 (redirects to the Sinhala locale). The admin dashboard is at `/admin`.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Generate the Prisma client and build for production |
| `npm start` | Run the production build |
| `npm run lint` | ESLint |
| `npm test` | Vitest unit tests |

## Database

The schema lives in [prisma/schema.prisma](prisma/schema.prisma) and migrations in `prisma/migrations/`. The seed command is configured in [prisma.config.ts](prisma.config.ts).

**Existing database created with `db push`:** mark the baseline as already applied, then deploy the remaining migrations:

```bash
npx prisma migrate resolve --applied 0_init
npx prisma migrate deploy
```

The `enable_row_level_security` migration turns on Postgres RLS for every table. Supabase exposes the `public` schema through its REST API with the public anon key; the app only reads data through Prisma (as the table owner), so RLS with no policies blocks that REST access without affecting the app.

For schema changes, use `npx prisma migrate dev --name <change>` rather than `db push`, so the change is recorded.

## Roles and access

| Role | Access |
|---|---|
| `SUPER_ADMIN` | Everything, including settings, pricing config, team roles and backups |
| `ADMIN` | All content and inbox management in `/admin` |
| `EDITOR` | Dashboard, songs, videos, profiles and the media library |
| `VIEWER` | Dashboard only |
| `CONTRIBUTOR` | Default for any new sign-in; `/portal` only |

Which roles can open each admin page is defined once in [src/lib/auth/admin-access.js](src/lib/auth/admin-access.js) (used by the sidebar and the admin layout). API routes check roles with `requireRole()` from [src/lib/auth/server-auth.js](src/lib/auth/server-auth.js).

## Music Arcade

Players register with an email and username and verify by email (links expire after 24h). Each game issues a signed round token when it starts; submissions must present it, which lets the server check the player, the questions served and the real time taken. Trivia, Theory Master and Name That Tune are scored on the server; Pitch Match and Rhythm Tap are capped at their maximum possible score and minimum play time. Trivia questions and Name That Tune clips are managed under Admin → Arcade Games.

## Scheduled jobs

- **Vercel Cron** ([vercel.json](vercel.json)) syncs YouTube and Facebook daily and Spotify weekly into the `SocialCache` table. Requests are authenticated with `CRON_SECRET` (cron requests are refused if it is unset). Admins can also sync on demand from Admin → Social Sync, and the latest YouTube videos appear on the Media page.
- **GitHub Actions** ([.github/workflows/keep-supabase-alive.yml](.github/workflows/keep-supabase-alive.yml)) pings Supabase twice a week so the free-tier project is not paused.
