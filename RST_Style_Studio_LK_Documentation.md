# 🎵 RST Style Studio LK

> **Project Documentation** · Full-Stack Web Application Blueprint · v1.0

| Property | Detail |
|---|---|
| Studio name | RST Style Studio LK |
| Primary language | Sinhala + English + Italian |
| Song catalog | 100+ songs |
| Platforms | YouTube · Facebook · Spotify |
| Target domain | `rststylestudio.lk` via AC.lk (~$15/yr) |
| Admin access | Father (ADMIN) + Developer (SUPER_ADMIN) |
| Quotation flow | Multi-step wizard → budget estimate → WhatsApp deep-link |
| Est. monthly cost | $0 (free tiers) |
| Est. build time | ~10 weeks |

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Database Schema](#3-database-schema)
4. [Page Map](#4-page-map)
5. [Feature Specifications](#5-feature-specifications)
6. [Social Integrations](#6-social-integrations)
7. [Quotation Wizard Flow](#7-quotation-wizard-flow)
8. [Internationalization (i18n)](#8-internationalization-i18n)
9. [Admin Dashboard](#9-admin-dashboard)
10. [Critical Issues & Warnings](#10-critical-issues--warnings)
11. [Build Phases & Timeline](#11-build-phases--timeline)
12. [Hosting & Deployment](#12-hosting--deployment)
13. [Project Folder Structure](#13-project-folder-structure)

---

## 1. Project Overview

**Goal:** Build a professional portfolio + customer engagement platform for RST Style Studio LK — a home music studio in Sri Lanka — with an admin dashboard for full content management.

**What the app does:**
- Showcases 100+ songs and music projects
- Displays individual contributor portfolios (lyricists, vocalists, instrumentalists, directors, etc.)
- Shows honorary mentions for contributors on each song/project
- Fetches live content from YouTube, Facebook, and Spotify
- Allows visitors to request a quotation via a multi-step wizard that opens WhatsApp
- Gives the studio admin full control over all content without touching code

---

## 2. Tech Stack

> 💡 **Why Next.js 14?** It handles SSR for SEO, has built-in API routes (no separate backend needed), supports i18n natively, and deploys to Vercel for free with zero configuration.

| Layer | Technology | Why chosen | Cost |
|---|---|---|---|
| Framework | **Next.js 14** (App Router) | SSR + API routes + i18n built-in | Free |
| Language | **TypeScript** | Type safety, fewer runtime bugs | Free |
| Styling | **Tailwind CSS** + shadcn/ui | Fast, consistent, professional UI | Free |
| Fonts | **Noto Sans Sinhala** + Inter | Sinhala script rendering support | Free |
| i18n | **next-intl** | Sinhala / English / Italian routing | Free |
| Database | **PostgreSQL** via Supabase | Free tier, scalable, real-time | Free |
| ORM | **Prisma** | Type-safe queries, easy migrations | Free |
| Auth | **Supabase Auth** | Role-based access, easy setup | Free |
| Storage | **Supabase Storage** | Photos, audio previews (1GB free) | Free |
| Email | **Resend** | 3,000 emails/month free | Free |
| YouTube | **YouTube Data API v3** | 10k units/day free, official | Free |
| Facebook | **Facebook Graph API** | Page posts/videos, requires token setup | Free |
| Spotify | **Spotify Web API** | Artist tracks, no user login needed | Free |
| WhatsApp | **Click-to-Chat API** | Pre-filled quotation messages | Free |
| Hosting | **Vercel** (free) | Native Next.js, auto CI/CD from GitHub | Free |
| Domain | **.lk via AC.lk** | Local Sri Lankan credibility | ~$15/yr |

> ✅ **Total monthly cost: $0** — The entire stack runs on free tiers. The only cost is the domain (~$15/year one-time). Upgrade to paid plans only when traffic significantly grows.

---

## 3. Database Schema

> All models use Prisma ORM connected to a PostgreSQL database on Supabase. Multilingual text fields (title, description, bio) are stored as JSON with keys `si`, `en`, `it`.

### Song model

```prisma
model Song {
  id               String          @id @default(cuid())
  title            Json            // { si: "...", en: "...", it: "..." }
  slug             String          @unique
  description      Json            // multilingual JSON
  releaseDate      DateTime
  genre            String
  language         SongLanguage
  youtubeUrl       String?
  spotifyUrl       String?
  audioPreview     String?         // Supabase Storage URL (max 60s clip)
  coverImage       String?         // Supabase Storage URL
  featured         Boolean         @default(false)
  contributions    Contribution[]
  honoraryMentions HonoraryMention[]
  createdAt        DateTime        @default(now())
  updatedAt        DateTime        @updatedAt
}

enum SongLanguage { SINHALA  ENGLISH  ITALIAN  MIXED }
```

### Contributor model

```prisma
model Contributor {
  id            String         @id @default(cuid())
  name          String
  slug          String         @unique
  bio           Json?          // multilingual JSON
  photo         String?        // Supabase Storage URL
  roles         ContribRole[]
  socialLinks   Json?          // { facebook, youtube, instagram, spotify }
  contributions Contribution[]
  honoraryMentions HonoraryMention[]
  createdAt     DateTime       @default(now())
}

enum ContribRole {
  LYRICIST
  MELODY_COMPOSER
  MUSIC_PRODUCER
  VOCALIST
  INSTRUMENTALIST
  MUSIC_VIDEO_DIRECTOR
  MIXING_ENGINEER
  MASTERING_ENGINEER
  CHOREOGRAPHER
  OTHER
}
```

### Contribution model (Song ↔ Contributor link)

```prisma
model Contribution {
  id            String      @id @default(cuid())
  song          Song        @relation(fields: [songId], references: [id])
  songId        String
  contributor   Contributor @relation(fields: [contributorId], references: [id])
  contributorId String
  role          ContribRole
  instrument    String?     // e.g. "Violin", "Guitar" if INSTRUMENTALIST
  note          String?     // e.g. "Lead vocalist", "Harmony section"
}
```

### Project model

```prisma
model Project {
  id          String      @id @default(cuid())
  title       Json
  slug        String      @unique
  type        ProjectType
  description Json?
  youtubeUrl  String?
  facebookUrl String?
  thumbnail   String?
  publishedAt DateTime?
  featured    Boolean     @default(false)
  createdAt   DateTime    @default(now())
}

enum ProjectType {
  MUSIC_VIDEO
  COVER_SONG
  BTS_VIDEO
  TUTORIAL
  LIVE_PERFORMANCE
  OTHER
}
```

### HonoraryMention model

```prisma
model HonoraryMention {
  id            String      @id @default(cuid())
  song          Song        @relation(fields: [songId], references: [id])
  songId        String
  contributor   Contributor @relation(fields: [contributorId], references: [id])
  contributorId String
  message       String      // personal dedication/thank-you message
  featured      Boolean     @default(false)  // show on homepage?
  createdAt     DateTime    @default(now())
}
```

### Service model

```prisma
model Service {
  id          String   @id @default(cuid())
  title       Json
  description Json
  basePrice   Float?
  icon        String?
  active      Boolean  @default(true)
  sortOrder   Int      @default(0)
}
```

### QuotationRequest model

```prisma
model QuotationRequest {
  id              String          @id @default(cuid())
  name            String
  email           String?
  phone           String?
  serviceType     QuotationService
  songLanguage    String?
  melodyType      String?
  instruments     String[]        // ["violin", "guitar", "tabla"]
  needsMusicVideo Boolean         @default(false)
  needsLyrics     Boolean         @default(false)
  additionalNotes String?
  estimatedBudget Float?          // calculated by system
  status          QuotationStatus @default(PENDING)
  createdAt       DateTime        @default(now())
}

enum QuotationService {
  ORIGINAL_SONG
  COVER_SONG
  MUSIC_VIDEO
  MIXING_MASTERING
  INSTRUMENTAL
  OTHER
}

enum QuotationStatus {
  PENDING
  SEEN
  IN_DISCUSSION
  COMPLETED
  REJECTED
}
```

### SocialCache model

```prisma
model SocialCache {
  id          String    @id @default(cuid())
  platform    Platform
  externalId  String    // YouTube video ID / FB post ID / Spotify track ID
  title       String?
  description String?
  thumbnail   String?
  url         String
  publishedAt DateTime?
  cachedAt    DateTime  @default(now())
}

enum Platform { YOUTUBE  FACEBOOK  SPOTIFY }
```

### User (admin) model

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  role      Role     @default(ADMIN)
  createdAt DateTime @default(now())
}

enum Role {
  SUPER_ADMIN   // Developer — full access
  ADMIN         // Father — content management only
}
```

### Multilingual field helper

```typescript
// lib/t.ts
export function t(field: unknown, locale: string): string {
  return (field as Record<string, string>)[locale]
    ?? (field as Record<string, string>)['en']
    ?? '';
}

// Usage in a component
const title = t(song.title, locale); // "මගේ ගීතය" or "My Song" or "La Mia Canzone"
```

---

## 4. Page Map

### Public pages

| Route | Page | Description |
|---|---|---|
| `/` | Home | Hero, featured songs, studio stats, social feed preview |
| `/songs` | All songs | Grid with filters: genre, language, year |
| `/songs/[slug]` | Song detail | YouTube embed, contributor list, honorary mentions |
| `/contributors` | Contributors | Directory of all collaborators with roles |
| `/contributors/[slug]` | Contributor profile | Bio, photo, all songs worked on, social links |
| `/projects` | Projects | Music videos, BTS, covers, tutorials — filterable |
| `/projects/[slug]` | Project detail | Embedded video, description, contributors |
| `/services` | Services | What the studio offers, price ranges |
| `/quote` | Quotation wizard | Multi-step form → budget estimate → WhatsApp link |
| `/contact` | Contact | Studio address, WhatsApp, social links |

### Admin dashboard (protected — `/admin`)

| Route | Page | Access |
|---|---|---|
| `/admin` | Dashboard overview | Both |
| `/admin/songs` | Songs list + CRUD | Both |
| `/admin/songs/new` | Add song | Both |
| `/admin/songs/[id]/edit` | Edit song + manage contributors | Both |
| `/admin/contributors` | Contributors CRUD | Both |
| `/admin/projects` | Projects CRUD | Both |
| `/admin/quotations` | Quotation inbox | Both |
| `/admin/services` | Services + pricing config | Both |
| `/admin/honorary` | Honorary mentions | Both |
| `/admin/social/sync` | Re-fetch social platform data | Both |
| `/admin/settings` | Studio info, WhatsApp number | Super Admin only |

---

## 5. Feature Specifications

### Song detail page — what a visitor sees

- YouTube video embed (full song)
- Spotify player embed (if track exists on Spotify)
- 30–60 second audio preview (hosted on Supabase Storage)
- Song cover image, title, release date, genre, language
- Full contributor list grouped by role:
  - Lyricist
  - Melody Composer
  - Music Producer
  - Vocalist(s)
  - Instrumentalists (with instrument name)
  - Music Video Director
  - Mixing & Mastering Engineer
- Each contributor shows a mini-card: photo + name + role → click goes to full profile
- Honorary mentions section with personalized messages
- Open Graph tags so WhatsApp/FB sharing shows the correct thumbnail and title
- Share button for the song page

### Contributor profile page — individual portfolio

- Full photo, name, short bio (shown in the visitor's current language)
- All roles they perform (e.g. Lyricist + Vocalist)
- Social links (Facebook, YouTube, Instagram, Spotify)
- Complete discography: all songs and projects they contributed to
- Filter by the role they played in each project
- All honorary mentions they have received

### Honorary mentions system

- Admin can add a personalized thank-you message for any contributor on any song
- Admin can mark specific mentions as "featured" to appear on the homepage
- On each song detail page, a dedicated "Honorary Mentions" section displays all messages
- Featured mentions appear in a rotating spotlight on the homepage hero section

---

## 6. Social Integrations

| Platform | Method | What we fetch | Cache strategy |
|---|---|---|---|
| **YouTube** | YouTube Data API v3 | Channel videos, playlists, thumbnails, view counts | Store in `SocialCache` DB table, re-fetch daily via Vercel Cron |
| **Facebook** | Graph API + oEmbed | Page posts, video posts | System User Token (never expires). Cache daily. |
| **Spotify** | Spotify Web API (Client Credentials) | Artist profile, top tracks, album art, popularity | Cache in DB, re-fetch weekly. No user login needed. |

> ⚠️ **Facebook token warning:** Regular Page Access Tokens expire every 60 days. You must set up a **Facebook System User** inside Facebook Business Manager to get a non-expiring token. This is a one-time setup. Without this, your Facebook integration will silently break every 2 months.

> ℹ️ **Caching strategy:** Never call social APIs on every page load. Store all fetched data in the `SocialCache` table and serve from DB. A Vercel Cron job (free) re-fetches data once per day. This keeps the site fast and avoids hitting API rate limits.

---

## 7. Quotation Wizard Flow

> The quotation page is a multi-step interactive form. No backend is called until the user opens WhatsApp — all budget calculation happens in the browser. The completed request is saved to the DB at submission time.

**Step 1 — Choose service type**

Options: Original Song / Cover Song / Music Video / Mixing & Mastering / Instrumental

**Step 2 — Configure options**

- Song language: Sinhala / English / Italian / Mixed
- Melody type: Pop / Classical / Baila / Rap / Folk / Rock / Other
- Need lyrics? Yes / No / Already have them
- Live instruments (multi-select): Violin, Guitar, Piano, Tabla, Flute, Drums, Bass, Keyboard...
- Need music video? Yes / No

**Step 3 — Enter contact info**

Name, phone number, optional email

**Step 4 — System calculates budget estimate**

Based on base prices configured in the admin dashboard. Displayed as a range, e.g. **LKR 45,000 – 65,000**. Always shown as an estimate, never a fixed quote.

**Step 5 — Confirmation modal**

> "Ready to discuss this further with our team?"
> 
> [Cancel] [Open WhatsApp →]

**Step 6 — WhatsApp deep-link**

Opens WhatsApp with a pre-filled message containing all form selections and the estimated budget. Simultaneously, the request is saved to the `QuotationRequest` table for the admin to review.

### WhatsApp URL format

```typescript
// lib/whatsapp.ts
export function buildWhatsAppUrl(data: QuotationData, waNumber: string): string {
  const message = `
Hi RST Style Studio! I'm interested in a quote.

Service: ${data.serviceType}
Language: ${data.songLanguage}
Melody type: ${data.melodyType}
Instruments: ${data.instruments.join(', ')}
Need lyrics: ${data.needsLyrics ? 'Yes' : 'No'}
Music video: ${data.needsMusicVideo ? 'Yes' : 'No'}
Estimated budget shown: LKR ${data.minBudget.toLocaleString()} – ${data.maxBudget.toLocaleString()}

My name: ${data.name}
My phone: ${data.phone}
  `.trim();

  return `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;
}
```

### Budget calculation logic

```
Final estimate = Base price (per service type)
              + (Number of live instruments × per-instrument fee)
              + (Music video add-on fee, if selected)
              + (Language complexity multiplier)

Display range = calculated value ± 15%
```

> All prices are stored in the database and editable from the admin dashboard. **Never hardcode pricing in the codebase.**

---

## 8. Internationalization (i18n)

The site supports three languages using `next-intl`. URLs are prefixed by locale: `/si/`, `/en/`, `/it/`.

| Locale | Language | Font | Translation source |
|---|---|---|---|
| `si` | Sinhala 🇱🇰 | Noto Sans Sinhala (Google Fonts) | Manually written by father / family |
| `en` | English 🇬🇧 | Inter | Default — developer writes this |
| `it` | Italian 🇮🇹 | Inter | DeepL API (auto) as starting point, manually reviewed |

### Multilingual DB field strategy

Store multilingual content as JSON in a single column — not as separate rows per language. This is critical at 100+ songs.

```json
// DB column: title (Json type in Prisma)
{
  "si": "මගේ ගීතය",
  "en": "My Song",
  "it": "La Mia Canzone"
}
```

### UI string translation files

```
messages/
├── si.json    // Sinhala UI labels, navigation, buttons
├── en.json    // English
└── it.json    // Italian
```

> ⚠️ **Sinhala rendering:** Always load `Noto Sans Sinhala` from Google Fonts. Test all admin input fields with Sinhala Unicode characters before launch. Some UI libraries break with Sinhala text if the font isn't explicitly set in the CSS.

---

## 9. Admin Dashboard

> 🔒 The `/admin` route is fully protected by Next.js middleware. Any unauthenticated request is redirected to `/admin/login`. All admin API routes also verify the session server-side.

### Role permissions

| Feature | ADMIN (Father) | SUPER_ADMIN (Developer) |
|---|---|---|
| Manage songs, projects, contributors | ✅ | ✅ |
| View & manage quotation inbox | ✅ | ✅ |
| Manage services & pricing | ✅ | ✅ |
| Add honorary mentions | ✅ | ✅ |
| Trigger social sync | ✅ | ✅ |
| Edit studio settings, WhatsApp number | ❌ | ✅ |
| Manage admin user accounts | ❌ | ✅ |

### Dashboard overview stats (home screen)

- Total songs, contributors, and projects in the system
- New quotation requests (last 7 days)
- Count of pending / unseen quotations
- Last social sync timestamps (YouTube / Facebook / Spotify)
- Quick action buttons: Add New Song, Add Contributor

### Quotation inbox

- Lists all incoming quotation requests
- Filter by status: Pending / Seen / In Discussion / Completed / Rejected
- Shows all submitted details (service type, instruments, budget shown, contact info)
- Admin can update the status of each request

---

## 10. Critical Issues & Warnings

### ⚠️ 1. Facebook System User Token — highest priority

**Problem:** Regular Facebook Page Access Tokens expire every 60 days. If you use these, the Facebook feed will silently break every 2 months without any warning or error message.

**Solution:** Set up a Facebook System User in Facebook Business Manager. System User tokens never expire. This is a one-time setup that must be done during the Facebook integration phase. Document the exact steps carefully for future reference.

### ⚠️ 2. Audio & storage management

- Never host full audio files — use YouTube or Spotify embeds for full songs
- Audio previews: maximum 60 seconds, compressed MP3, target under 1MB per file
- Supabase free tier: 1GB storage — at 100 songs with previews + contributor photos, you have room but monitor usage over time
- Use Next.js `<Image>` component for all images — it auto-compresses and serves WebP format

### ⚠️ 3. Vercel serverless function limits

- Free tier: 100GB bandwidth/month, function timeout: 10 seconds
- Social sync (YouTube / Facebook / Spotify API calls) must run as **Vercel Cron Jobs** — not triggered on page load
- Cron jobs are free on Vercel and can run on a daily schedule
- If a cron job approaches the timeout, break the sync into smaller batches

### ⚠️ 4. SEO & Open Graph tags

- Every song page must have proper OG meta tags — when shared on WhatsApp or Facebook it must show the correct song thumbnail and title
- Use Next.js `generateMetadata()` function in each dynamic route
- Sinhala text in OG tags is supported — test with the Facebook Sharing Debugger tool
- Generate a `sitemap.xml` at `/sitemap.xml` for Google indexing of all 100+ song pages

### ⚠️ 5. WhatsApp number management

The WhatsApp number used in the quotation wizard must be stored in the database (admin settings table), **not hardcoded in the source code**. This allows your father to change the number without requiring a new code deployment.

### ⚠️ 6. Budget estimation pricing

- Always display budgets as a **range** (e.g. LKR 40,000 – 60,000), never a fixed number
- The pricing config must be fully editable from the admin dashboard
- Display range = calculated value ± 15%
- If your father changes prices, users see updated estimates immediately with no code change

---

## 11. Build Phases & Timeline

| Phase | What to build | Estimate |
|---|---|---|
| **1** | Supabase setup, Prisma schema + migrations, Supabase Auth, admin login, middleware route protection, basic admin shell layout | ~1 week |
| **2** | Full admin CRUD for Songs, Contributors, Projects. File upload to Supabase Storage. Contributor-song linking UI. | ~1.5 weeks |
| **3** | Public portfolio pages: Home, /songs, /songs/[slug], /contributors, /contributors/[slug], /projects. Full design. | ~1.5 weeks |
| **4** | Quotation wizard (multi-step form), budget calculator, confirmation modal, WhatsApp deep-link, DB save, admin quotation inbox. | ~1 week |
| **5** | YouTube Data API v3 integration, Spotify Web API, SocialCache DB storage, Vercel Cron daily refresh, admin sync trigger. | ~1 week |
| **6** | Facebook System User token setup, Graph API page feed fetch, oEmbed for posts, cache strategy, admin sync page. | ~1 week |
| **7** | next-intl setup, locale URL routing, translation JSON files for UI strings, multilingual DB field rendering, Noto Sans Sinhala font loading. | ~1 week |
| **8** | generateMetadata() for all pages, Open Graph tags, sitemap.xml, image optimization, Lighthouse audit, mobile responsiveness testing. | ~3–4 days |
| **9** | Enter all 100+ songs + contributor data into admin. Full browser + mobile testing. Domain setup (rststylestudio.lk). Go live. | ~1 week |

> ✅ **Total estimated timeline: ~9–10 weeks** building solo at a comfortable pace alongside university studies.

---

## 12. Hosting & Deployment

| Service | What it hosts | Free tier limit |
|---|---|---|
| **Vercel** | Next.js app (frontend + all API routes) | 100GB bandwidth/month, unlimited deploys |
| **Supabase** | PostgreSQL database | 500MB database storage |
| **Supabase Storage** | Contributor photos, audio previews | 1GB file storage |
| **GitHub** | Source code repository | Unlimited private repos |
| **AC.lk** | Domain registrar for .lk domain | ~$15/year |

### Deployment workflow

1. Push code to **GitHub** (main branch)
2. **Vercel** auto-detects the push and starts a build
3. Build completes → automatically deployed to `rststylestudio.lk`
4. Every pull request gets a **preview URL** — test before merging to main

### Environment variables

Store all secrets in Vercel's dashboard under Project → Settings → Environment Variables:

```
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
YOUTUBE_API_KEY=
FACEBOOK_SYSTEM_USER_TOKEN=
FACEBOOK_PAGE_ID=
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
RESEND_API_KEY=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
STUDIO_WHATSAPP_NUMBER=
```

> 🔑 **Never commit secrets to the GitHub repo.** Always use environment variables.

---

## 13. Project Folder Structure

```
rst-style-studio/
├── app/
│   ├── [locale]/                      # i18n locale prefix (si, en, it)
│   │   ├── page.tsx                   # Home page
│   │   ├── songs/
│   │   │   ├── page.tsx               # All songs (filterable grid)
│   │   │   └── [slug]/page.tsx        # Song detail page
│   │   ├── contributors/
│   │   │   ├── page.tsx               # All contributors directory
│   │   │   └── [slug]/page.tsx        # Contributor portfolio page
│   │   ├── projects/
│   │   │   ├── page.tsx               # All projects
│   │   │   └── [slug]/page.tsx        # Project detail
│   │   ├── services/page.tsx          # Services offered
│   │   ├── quote/page.tsx             # Quotation wizard
│   │   └── contact/page.tsx           # Contact page
│   ├── admin/                         # Protected dashboard (no locale prefix)
│   │   ├── page.tsx                   # Dashboard overview & stats
│   │   ├── songs/
│   │   │   ├── page.tsx               # Songs list
│   │   │   ├── new/page.tsx           # Add song
│   │   │   └── [id]/edit/page.tsx     # Edit song
│   │   ├── contributors/
│   │   │   ├── page.tsx
│   │   │   └── new/page.tsx
│   │   ├── projects/page.tsx
│   │   ├── quotations/page.tsx        # Quotation inbox
│   │   ├── services/page.tsx          # Services + pricing config
│   │   ├── honorary/page.tsx          # Honorary mentions
│   │   ├── social/sync/page.tsx       # Social platform sync
│   │   └── settings/page.tsx          # Studio settings (Super Admin only)
│   └── api/                           # Next.js API routes
│       ├── songs/route.ts
│       ├── contributors/route.ts
│       ├── projects/route.ts
│       ├── quotations/route.ts
│       ├── services/route.ts
│       ├── honorary/route.ts
│       ├── sync/youtube/route.ts      # YouTube cron endpoint
│       ├── sync/facebook/route.ts     # Facebook cron endpoint
│       └── sync/spotify/route.ts      # Spotify cron endpoint
├── components/
│   ├── ui/                            # shadcn/ui base components
│   ├── songs/                         # SongCard, SongGrid, SongDetail
│   ├── contributors/                  # ContributorCard, ContributorProfile
│   ├── projects/                      # ProjectCard, ProjectGrid
│   ├── quote/                         # WizardStep1..5, BudgetDisplay, Modal
│   └── admin/                         # AdminLayout, DataTable, Forms
├── lib/
│   ├── db.ts                          # Prisma client singleton
│   ├── youtube.ts                     # YouTube Data API v3 helper
│   ├── facebook.ts                    # Facebook Graph API helper
│   ├── spotify.ts                     # Spotify Web API helper
│   ├── whatsapp.ts                    # WhatsApp URL builder
│   ├── budget.ts                      # Budget estimation logic
│   └── t.ts                           # Multilingual field extractor
├── messages/
│   ├── si.json                        # Sinhala UI strings
│   ├── en.json                        # English UI strings
│   └── it.json                        # Italian UI strings
├── middleware.ts                      # Auth + i18n routing middleware
├── prisma/
│   └── schema.prisma                  # Complete database schema
├── public/
│   └── fonts/                         # Noto Sans Sinhala (self-hosted backup)
├── .env.local                         # Local environment variables (never commit)
├── .env.example                       # Template for env vars (safe to commit)
├── next.config.ts                     # Next.js config (i18n, image domains)
└── package.json
```

---

> 🎶 **You're ready to start building.** Begin with Phase 1 — Supabase project setup, Prisma schema initialization, and the admin authentication shell. Everything else builds on top of that foundation.
>
> **First commands to run:**
> ```bash
> npx create-next-app@latest rst-style-studio --typescript --tailwind --app
> cd rst-style-studio
> npm install prisma @prisma/client next-intl next-auth @supabase/supabase-js
> npm install -D @types/node
> npx prisma init
> ```

---

*RST Style Studio LK · Documentation v1.0 · April 2026*
