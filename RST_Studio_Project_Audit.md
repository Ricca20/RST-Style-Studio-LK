# RST Style Studio LK — Project Audit & Inspection Prompt
### Paste this into a new Claude conversation with your codebase attached or pasted in sections.

---

> **How to use this:**
> Open a new Claude conversation. Paste this entire prompt first.
> Then share your code — either paste individual files, upload your project zip,
> or share specific files Claude asks for. Claude will audit everything systematically.

---

## THE PROMPT

---

You are a senior full-stack Next.js developer and code reviewer. I need you to perform a **complete, detailed audit** of my web application called **RST Style Studio LK** — a professional music studio portfolio, customer engagement platform, and admin dashboard built with Next.js 14, TypeScript, Tailwind CSS, shadcn/ui, Supabase, and Prisma.

I have been building this for several days and I am approximately 80% complete. I need you to inspect every aspect of what has been implemented so far and give me:

1. A detailed status report on every feature and page
2. Technical issues, bugs, or missing implementations
3. What is complete, what is incomplete, and what is missing entirely
4. Specific code-level feedback and fixes where needed
5. A prioritized list of what to finish next

Be thorough, honest, and specific. Do not give vague feedback. Point to exact files, functions, and line numbers where possible.

---

## Project Context

**Studio:** RST Style Studio LK — Sri Lankan home music studio producing Sinhala, English, and Italian songs.

**Tech Stack:**
- Framework: Next.js 14 with App Router
- Language: TypeScript (strict mode)
- Styling: Tailwind CSS + shadcn/ui
- Database: PostgreSQL via Supabase
- ORM: Prisma
- Auth: Supabase Auth (roles: SUPER_ADMIN, ADMIN)
- Storage: Supabase Storage (photos, audio previews)
- i18n: next-intl (locales: si, en, it)
- Email: Resend
- Hosting target: Cloudflare Pages
- Social APIs: YouTube Data API v3, Facebook Graph API, Spotify Web API
- WhatsApp: Click-to-Chat deep-link

**Intended features (full scope):**
- Public portfolio site (songs, contributors, projects, services, contact)
- Multi-step quotation wizard → WhatsApp deep-link
- Admin dashboard with full CRUD
- Social media feed integration with caching
- Three-language support (Sinhala/English/Italian)
- Honorary mentions system
- Role-based admin access (SUPER_ADMIN vs ADMIN)

---

## AUDIT SECTION 1 — Project Structure

Inspect my folder and file structure. Check:

- [ ] Is the App Router folder structure correct for Next.js 14?
- [ ] Are all public routes inside `app/[locale]/`?
- [ ] Are all admin routes inside `app/admin/` (no locale prefix)?
- [ ] Is there a root `app/layout.tsx` and a locale `app/[locale]/layout.tsx`?
- [ ] Is `middleware.ts` present at the `src/` root level?
- [ ] Is `i18n.ts` present and configured?
- [ ] Are all three message files present: `messages/si.json`, `messages/en.json`, `messages/it.json`?
- [ ] Is `prisma/schema.prisma` present?
- [ ] Is `.env.example` present with all required variables?
- [ ] Is `vercel.json` or `wrangler.toml` present for deployment config?
- [ ] Are there any orphaned files or folders that don't belong?
- [ ] Is `next.config.ts` properly configured?

Report: list every present file/folder, flag anything missing, flag anything incorrectly placed.

---

## AUDIT SECTION 2 — Prisma Schema

Inspect `prisma/schema.prisma`. Check every model:

**Required models — verify each exists and is complete:**

- [ ] `User` — fields: id, email, role (Role enum), createdAt
- [ ] `Song` — fields: id, title (Json), slug, description (Json), releaseDate, genre, language (SongLanguage enum), youtubeUrl, spotifyUrl, audioPreview, coverImage, featured, contributions, honoraryMentions, createdAt, updatedAt
- [ ] `Contributor` — fields: id, name, slug, bio (Json), photo, roles (ContribRole[]), socialLinks (Json), contributions, honoraryMentions, createdAt
- [ ] `Contribution` — fields: id, songId, contributorId, role (ContribRole), instrument, note — with onDelete: Cascade on both relations
- [ ] `Project` — fields: id, title (Json), slug, type (ProjectType enum), description (Json), youtubeUrl, facebookUrl, thumbnail, publishedAt, featured, createdAt
- [ ] `HonoraryMention` — fields: id, songId, contributorId, message, featured, createdAt — with Cascade deletes
- [ ] `Service` — fields: id, title (Json), description (Json), basePrice, icon, active, sortOrder
- [ ] `PricingConfig` — fields: id, serviceType (unique), baseMin, baseMax, perInstrumentFee, musicVideoAddon, languageMultiplierSi, languageMultiplierEn, languageMultiplierIt, rangeMarginPercent
- [ ] `QuotationRequest` — fields: id, name, email, phone, serviceType (enum), songLanguage, melodyType, instruments (String[]), needsMusicVideo, needsLyrics, additionalNotes, estimatedMin, estimatedMax, status (enum), createdAt
- [ ] `SocialCache` — fields: id, platform (Platform enum), externalId, title, description, thumbnail, url, publishedAt, cachedAt — with @@unique([platform, externalId])
- [ ] `StudioSettings` — fields: id, whatsappNumber, youtubeChannelId, facebookPageId, spotifyArtistId, studioName (Json), studioTagline (Json), studioDescription (Json), contactEmail, contactAddress (Json), updatedAt

**Required enums — verify each exists with all values:**
- [ ] `Role`: SUPER_ADMIN, ADMIN
- [ ] `SongLanguage`: SINHALA, ENGLISH, ITALIAN, MIXED
- [ ] `ContribRole`: LYRICIST, MELODY_COMPOSER, MUSIC_PRODUCER, VOCALIST, INSTRUMENTALIST, MUSIC_VIDEO_DIRECTOR, MIXING_ENGINEER, MASTERING_ENGINEER, CHOREOGRAPHER, OTHER
- [ ] `ProjectType`: MUSIC_VIDEO, COVER_SONG, BTS_VIDEO, TUTORIAL, LIVE_PERFORMANCE, OTHER
- [ ] `QuotationService`: ORIGINAL_SONG, COVER_SONG, MUSIC_VIDEO, MIXING_MASTERING, INSTRUMENTAL, OTHER
- [ ] `QuotationStatus`: PENDING, SEEN, IN_DISCUSSION, COMPLETED, REJECTED
- [ ] `Platform`: YOUTUBE, FACEBOOK, SPOTIFY

**Schema quality checks:**
- [ ] Does the datasource use both `url` and `directUrl` (required for Supabase)?
- [ ] Are all Json fields used correctly (title, description, bio, socialLinks, etc.)?
- [ ] Are all cascade deletes configured on Contribution and HonoraryMention?
- [ ] Is the @@unique constraint on SocialCache [platform, externalId]?
- [ ] Is the generator set to `prisma-client-js`?

Report: list every model status (complete / incomplete / missing), list any field mismatches, flag any relations that are incorrectly defined.

---

## AUDIT SECTION 3 — Environment Variables

Inspect `.env.example` (or `.env.local` if shared). Check every required variable is present:

**Supabase:**
- [ ] DATABASE_URL
- [ ] DIRECT_URL
- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY

**Auth:**
- [ ] NEXTAUTH_SECRET
- [ ] NEXTAUTH_URL

**Social APIs:**
- [ ] YOUTUBE_API_KEY
- [ ] FACEBOOK_SYSTEM_USER_TOKEN
- [ ] FACEBOOK_PAGE_ID
- [ ] SPOTIFY_CLIENT_ID
- [ ] SPOTIFY_CLIENT_SECRET

**Email:**
- [ ] RESEND_API_KEY
- [ ] RESEND_FROM_EMAIL

**Cron / Security:**
- [ ] CRON_SECRET

**Studio config:**
- [ ] STUDIO_WHATSAPP_NUMBER

Report: list which are present, which are missing, flag any that are hardcoded in source code (security risk).

---

## AUDIT SECTION 4 — Core Library Files

Inspect `src/lib/`. Check every helper file:

**`src/lib/db.ts`**
- [ ] Uses Prisma singleton pattern (prevents multiple instances in dev hot-reload)?
- [ ] Exported as `db` or `prisma`?
- [ ] Works with both `DATABASE_URL` and `DIRECT_URL`?

**`src/lib/supabase.ts`**
- [ ] Exports `supabaseBrowser` (anon key, for client components)?
- [ ] Exports `supabaseServer` (service role key, for server components/API routes)?
- [ ] Are both using correct env vars?

**`src/lib/t.ts`**
- [ ] Function signature: `t(field: unknown, locale: string): string`?
- [ ] Falls back to English (`en`) if the requested locale key is missing?
- [ ] Falls back to empty string if neither locale nor English exist?
- [ ] Handles null/undefined field gracefully (no crashes)?

**`src/lib/budget.ts`**
- [ ] Takes `QuotationOptions` and `PricingConfig` as parameters?
- [ ] Returns `{ min: number, max: number }` in LKR?
- [ ] Applies per-instrument fee multiplied by instrument count?
- [ ] Applies music video add-on if selected?
- [ ] Applies language multiplier?
- [ ] Applies range margin (±%) to produce min/max?
- [ ] Does NOT use any hardcoded prices?

**`src/lib/whatsapp.ts`**
- [ ] Builds `https://wa.me/[number]?text=[encoded]` format correctly?
- [ ] Reads WhatsApp number from StudioSettings DB (not hardcoded)?
- [ ] Encodes the message with `encodeURIComponent`?
- [ ] Message includes all form selections (service, language, instruments, needs, budget range, name, phone)?

**`src/lib/youtube.ts`**
- [ ] Uses `YOUTUBE_API_KEY` env var?
- [ ] Returns typed array of video objects?
- [ ] Handles API errors gracefully (try/catch)?
- [ ] Returns: externalId, title, description, thumbnail, url, publishedAt?

**`src/lib/spotify.ts`**
- [ ] Implements Client Credentials flow (fetches token internally)?
- [ ] Uses `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`?
- [ ] Handles token refresh?
- [ ] Returns typed track/artist objects?

**`src/lib/facebook.ts`**
- [ ] Uses `FACEBOOK_SYSTEM_USER_TOKEN` env var?
- [ ] Has a comment explaining the System User token requirement?
- [ ] Returns typed post objects?
- [ ] Handles API errors gracefully?

**`src/lib/utils.ts`**
- [ ] Exports `cn()` function using `clsx` + `tailwind-merge`?

**`src/lib/slugify.ts`**
- [ ] Handles Sinhala Unicode (strips non-ASCII or transliterates)?
- [ ] Produces URL-safe kebab-case output?
- [ ] Handles edge cases (empty string, special characters)?

Report: for each file — complete / incomplete / missing. Quote specific issues.

---

## AUDIT SECTION 5 — TypeScript Types

Inspect `src/types/`. Check:

- [ ] `song.ts` — exports: `Song`, `SongWithContributions`, `Contribution`, `ContribRole`
- [ ] `contributor.ts` — exports: `Contributor`, `ContributorWithSongs`
- [ ] `project.ts` — exports: `Project`, `ProjectType`
- [ ] `quotation.ts` — exports: `QuotationRequest`, `QuotationService`, `QuotationStatus`, `QuotationFormData`, `QuotationOptions`
- [ ] `index.ts` — re-exports everything from all type files
- [ ] Are all types aligned with the Prisma schema? (no field mismatches)
- [ ] Are Json fields typed as `Record<string, string>` or similar, not `any`?
- [ ] Is `ContribRole` typed as a union or const enum, not just `string`?

Report: list what's present, what's missing, flag any type that uses `any` where a specific type is possible.

---

## AUDIT SECTION 6 — i18n Setup

Inspect `src/i18n.ts`, `src/middleware.ts`, and all message files.

**`src/i18n.ts`**
- [ ] Configured with locales: `['si', 'en', 'it']`?
- [ ] Default locale set to `'si'`?
- [ ] Exports the config correctly for next-intl?

**`src/middleware.ts`**
- [ ] Uses next-intl `createMiddleware` for locale routing?
- [ ] Protects all `/admin/*` routes (redirects to `/admin/login` if no session)?
- [ ] Does NOT protect any public routes?
- [ ] Handles the Supabase session cookie correctly?
- [ ] Has correct `matcher` config (excludes `_next`, `api`, static files)?

**`messages/en.json`**
- [ ] Has keys for: navigation (home, songs, contributors, projects, services, quote, contact)?
- [ ] Has keys for: hero (title, tagline, cta_primary, cta_secondary)?
- [ ] Has keys for: songs page (title, subtitle, search_placeholder, filter_all)?
- [ ] Has keys for: quote wizard (all 4 steps — labels, buttons, placeholders)?
- [ ] Has keys for: admin navigation (all sidebar items)?
- [ ] Has keys for: footer (copyright, tagline)?
- [ ] Has keys for: common UI (loading, error, empty_state, save, cancel, delete, edit)?

**`messages/si.json`**
- [ ] Has the exact same keys as `en.json`?
- [ ] All values are in Sinhala Unicode (not English)?
- [ ] No keys missing compared to `en.json`?

**`messages/it.json`**
- [ ] Has the exact same keys as `en.json`?
- [ ] All values are in Italian?
- [ ] No keys missing compared to `en.json`?

Report: list which keys are missing per file, flag any key mismatch between the three files.

---

## AUDIT SECTION 7 — Layouts & Fonts

**`src/app/layout.tsx` (root layout)**
- [ ] Loads `Noto Sans Sinhala` via `next/font/google`?
- [ ] Loads `Orbitron` via `next/font/google`?
- [ ] Loads `Rajdhani` via `next/font/google`?
- [ ] Loads `Inter` via `next/font/google`?
- [ ] Root layout is minimal — no `<Navbar>` or `<Footer>` here?
- [ ] Sets no `lang` attribute (locale layout handles this)?

**`src/app/[locale]/layout.tsx` (locale layout)**
- [ ] Sets `<html lang={locale}>`?
- [ ] Applies `Noto Sans Sinhala` font class when `locale === 'si'`?
- [ ] Wraps children in `NextIntlClientProvider`?
- [ ] Passes `messages` to `NextIntlClientProvider`?
- [ ] Includes `<Navbar />` and `<Footer />`?
- [ ] Exports `generateStaticParams` returning `[{locale:'si'},{locale:'en'},{locale:'it'}]`?

**`src/app/admin/layout.tsx` (admin layout)**
- [ ] Checks authentication server-side?
- [ ] Redirects to `/admin/login` if not authenticated?
- [ ] Renders `<AdminSidebar />` + main content area?
- [ ] Has NO locale prefix or i18n logic?

Report: flag any missing font, incorrect HTML structure, missing auth check.

---

## AUDIT SECTION 8 — Public Pages

For each page, check: exists / renders correctly / uses correct data fetching / handles loading + error states / is responsive / uses i18n translations.

**Home Page (`src/app/[locale]/page.tsx`)**
- [ ] Is an async server component?
- [ ] Fetches featured songs from DB (where featured = true)?
- [ ] Fetches featured projects from DB?
- [ ] Fetches stats (song count, contributor count, project count) from DB?
- [ ] Fetches latest YouTube videos from SocialCache table?
- [ ] Fetches featured honorary mentions from DB?
- [ ] Hero section: logo, title, tagline, typewriter text, two CTA buttons?
- [ ] Stats bar: 4 stat cards with real data?
- [ ] Featured songs: card grid, "View All" link?
- [ ] Latest projects: grid with filter?
- [ ] Contributors spotlight section?
- [ ] Honorary mentions carousel?
- [ ] Services overview grid?
- [ ] YouTube feed grid?
- [ ] CTA banner at bottom?
- [ ] Uses `useTranslations` or `getTranslations` for all text?
- [ ] Has `generateMetadata()` with OG tags?

**Songs Page (`src/app/[locale]/songs/page.tsx`)**
- [ ] Fetches all songs from DB?
- [ ] Has search functionality (at minimum client-side filter)?
- [ ] Has language filter chips (All/Sinhala/English/Italian)?
- [ ] Has genre filter?
- [ ] Song cards show: cover image, title, year, language badge, genre, contributor count?
- [ ] Pagination or "load more"?
- [ ] Has `generateMetadata()`?

**Song Detail Page (`src/app/[locale]/songs/[slug]/page.tsx`)**
- [ ] Fetches song by slug with all contributions + contributors?
- [ ] Fetches honorary mentions for this song?
- [ ] Shows YouTube embed?
- [ ] Shows Spotify embed (if URL exists)?
- [ ] Shows cover image with 3D tilt (or at minimum the image)?
- [ ] Shows audio preview player (if audio file exists)?
- [ ] Shows contributors grouped by role?
- [ ] Each contributor card links to `/contributors/[slug]`?
- [ ] Shows honorary mentions section?
- [ ] Has `generateMetadata()` with OG title + OG image (cover art)?
- [ ] Has `generateStaticParams()` for all song slugs?
- [ ] Returns 404 if slug not found?

**Contributors Page (`src/app/[locale]/contributors/page.tsx`)**
- [ ] Fetches all contributors from DB?
- [ ] Shows role filter chips?
- [ ] Contributor cards: photo, name, role, song count?
- [ ] Links to individual contributor profiles?

**Contributor Profile Page (`src/app/[locale]/contributors/[slug]/page.tsx`)**
- [ ] Fetches contributor with all their contributions + songs?
- [ ] Shows photo, name, bio (in current locale via `t()`), roles?
- [ ] Shows social links?
- [ ] Shows discography grid (all songs they contributed to)?
- [ ] Shows honorary mentions received?
- [ ] Has `generateMetadata()`?
- [ ] Has `generateStaticParams()`?
- [ ] Returns 404 if slug not found?

**Projects Page (`src/app/[locale]/projects/page.tsx`)**
- [ ] Fetches all projects from DB?
- [ ] Has type filter tabs (All/Music Videos/Cover Songs/BTS/Tutorials)?
- [ ] Shows bento/grid layout?
- [ ] Each card shows thumbnail, type badge, title, date?

**Project Detail Page (`src/app/[locale]/projects/[slug]/page.tsx`)**
- [ ] Fetches project by slug?
- [ ] Shows YouTube embed?
- [ ] Shows description, contributors?
- [ ] Shows related projects?
- [ ] Has `generateMetadata()`?
- [ ] Returns 404 if not found?

**Services Page (`src/app/[locale]/services/page.tsx`)**
- [ ] Fetches active services from DB?
- [ ] Shows service cards with icon, name, description, price?
- [ ] Shows "How We Work" process timeline?
- [ ] CTA banner at bottom?

**Contact Page (`src/app/[locale]/contact/page.tsx`)**
- [ ] Shows studio address, WhatsApp number (from DB settings), social links?
- [ ] Has contact form (with Resend email sending)?
- [ ] WhatsApp number is fetched from StudioSettings, NOT hardcoded?
- [ ] Contact form shows success/error feedback?

Report: for each page — complete / partially implemented / missing. Note every specific gap.

---

## AUDIT SECTION 9 — Quotation Wizard

This is the most critical public feature. Inspect `src/app/[locale]/quote/` and `src/components/quote/`.

**QuoteWizard component**
- [ ] Is a client component (`'use client'` at top)?
- [ ] Has 4 distinct steps with state management?
- [ ] Step progress indicator shows current step correctly?
- [ ] Step 1: 6 service type selection cards, selection state works?
- [ ] Step 2: Language chips, melody type dropdown, lyrics toggle, instrument multi-select (10 instruments), music video toggle — all work?
- [ ] Step 3: Name (required), phone (required), email (optional), notes (optional) inputs with validation?
- [ ] Step 4: Budget estimate card with real calculation (not hardcoded)?
- [ ] Budget calculation calls `calculateBudget()` from `lib/budget.ts`?
- [ ] Budget calculation reads pricing from DB (via API call), not hardcoded?
- [ ] "Open WhatsApp" opens `wa.me/` link with all form data pre-filled?
- [ ] WhatsApp number comes from StudioSettings API, not hardcoded?
- [ ] Confirmation modal appears before opening WhatsApp?
- [ ] On confirm: POSTs to `/api/quotations` to save the request?
- [ ] On confirm: opens WhatsApp in new tab?
- [ ] Toast notification on success?
- [ ] Form validation: required fields prevent moving to next step?
- [ ] Back button works on all steps?
- [ ] "Start Over" resets all state?

Report: step-by-step status of each wizard step. Flag any hardcoded prices or phone numbers.

---

## AUDIT SECTION 10 — API Routes

Inspect `src/app/api/`. Check each route:

**`/api/songs` (GET + POST)**
- [ ] GET: returns all songs, supports `?featured=true` filter?
- [ ] GET: supports `?search=` query param?
- [ ] POST: validates request body with Zod?
- [ ] POST: auto-generates slug from title?
- [ ] POST: saves to DB via Prisma?
- [ ] POST: requires authentication?
- [ ] Both return proper JSON with correct HTTP status codes?

**`/api/contributors` (GET + POST)**
- [ ] Same pattern as songs?
- [ ] POST requires auth?

**`/api/projects` (GET + POST)**
- [ ] Same pattern?

**`/api/quotations` (GET + POST)**
- [ ] GET: requires authentication (admin only)?
- [ ] GET: supports `?status=` filter?
- [ ] POST: public (no auth required)?
- [ ] POST: validates with Zod?
- [ ] POST: saves estimatedMin and estimatedMax?

**`/api/services` (GET)**
- [ ] Returns active services + pricing configs?

**`/api/sync/youtube` (GET)**
- [ ] Protected with `CRON_SECRET` header check?
- [ ] Calls YouTube API with channel ID from StudioSettings?
- [ ] Upserts results into SocialCache?
- [ ] Handles YouTube API errors gracefully?

**`/api/sync/facebook` (GET)**
- [ ] Protected with `CRON_SECRET`?
- [ ] Uses `FACEBOOK_SYSTEM_USER_TOKEN`?
- [ ] Upserts into SocialCache?

**`/api/sync/spotify` (GET)**
- [ ] Protected with `CRON_SECRET`?
- [ ] Handles Spotify Client Credentials token?
- [ ] Upserts into SocialCache?

**General API quality:**
- [ ] Every POST/PUT/DELETE route checks authentication before processing?
- [ ] Every route uses try/catch and returns errors as JSON?
- [ ] No route exposes raw Prisma errors to the client?
- [ ] No secrets (API keys, tokens) appear in route responses?

Report: status of each route. Flag any routes that are missing auth, missing Zod validation, or returning raw errors.

---

## AUDIT SECTION 11 — Admin Dashboard

Inspect `src/app/admin/`. Check each admin page:

**Admin Dashboard Home (`/admin/page.tsx`)**
- [ ] Shows 4 KPI metric cards (total songs, contributors, pending quotations, last sync)?
- [ ] Queries are real DB queries, not hardcoded numbers?
- [ ] Recent quotations table (last 5–8)?
- [ ] Quick action buttons?

**Admin Songs List (`/admin/songs/page.tsx`)**
- [ ] Fetches all songs from DB?
- [ ] Data table with columns: thumbnail, title, language badge, genre, contributor count, date, featured toggle, edit/delete actions?
- [ ] Search/filter works?
- [ ] "Add New Song" button links to `/admin/songs/new`?

**Admin Song Form (`/admin/songs/new/page.tsx` + `/admin/songs/[id]/edit/page.tsx`)**
- [ ] Multilingual title inputs (SI / EN / IT)?
- [ ] Multilingual description textareas (SI / EN / IT)?
- [ ] Genre input + language select?
- [ ] Release date picker?
- [ ] Featured toggle?
- [ ] Cover image upload to Supabase Storage?
- [ ] Audio preview upload to Supabase Storage?
- [ ] YouTube URL input?
- [ ] Spotify URL input?
- [ ] Contributor search and linking (with role + instrument + note)?
- [ ] Form submission POSTs to `/api/songs`?
- [ ] Edit page pre-fills existing data?
- [ ] Delete confirmation modal?

**Admin Contributors (`/admin/contributors/page.tsx`)**
- [ ] Table with photo, name, roles, song count, actions?
- [ ] "Add New Contributor" form (name, bio SI/EN/IT, photo upload, roles multi-select, social links)?

**Admin Projects (`/admin/projects/page.tsx`)**
- [ ] Table or card list of projects?
- [ ] Add/edit/delete functionality?

**Admin Quotations (`/admin/quotations/page.tsx`)**
- [ ] Status filter tabs (All/Pending/Seen/In Discussion/Completed/Rejected)?
- [ ] Shows all quotation details (name, phone, selections, budget estimate)?
- [ ] Status can be updated from the inbox?
- [ ] "Open WhatsApp" button per quotation?

**Admin Services (`/admin/services/page.tsx`)**
- [ ] Lists all services?
- [ ] Editable title (SI/EN/IT), description (SI/EN/IT), price, icon, active status?
- [ ] PricingConfig rows editable?

**Admin Honorary Mentions (`/admin/honorary/page.tsx`)**
- [ ] Lists all honorary mentions?
- [ ] Can add new mention (select song, select contributor, write message, set featured)?
- [ ] Can delete?

**Admin Social Sync (`/admin/social/sync/page.tsx`)**
- [ ] Shows YouTube, Facebook, Spotify sync panels?
- [ ] Shows last cached timestamp?
- [ ] "Sync Now" triggers the relevant `/api/sync/` route?
- [ ] Shows count of cached items?

**Admin Settings (`/admin/settings/page.tsx`)**
- [ ] Only accessible to SUPER_ADMIN role?
- [ ] Shows/edits: WhatsApp number, YouTube channel ID, Facebook page ID, Spotify artist ID?
- [ ] Shows/edits: studio name (SI/EN/IT), tagline (SI/EN/IT)?
- [ ] Shows/edits: PricingConfig table (all service types, base prices, add-ons)?
- [ ] Admin user management (view accounts, change roles)?

**Admin Auth (`/admin/login/page.tsx`)**
- [ ] Login form with email + password?
- [ ] Uses Supabase Auth to sign in?
- [ ] Redirects to `/admin` on success?
- [ ] Shows error on invalid credentials?

**Admin sidebar / layout:**
- [ ] Active route is highlighted?
- [ ] Pending quotations badge shows real count?
- [ ] Settings link only visible to SUPER_ADMIN?
- [ ] Logout button works (calls Supabase signOut)?

Report: status of each admin page. Flag any page that is just a placeholder or has no real functionality.

---

## AUDIT SECTION 12 — Components

Inspect `src/components/`. Check key components:

**`components/layout/Navbar.tsx`**
- [ ] Transparent on hero, frosted glass on scroll (scroll listener)?
- [ ] All nav links present and correct?
- [ ] Language switcher functional (changes locale, preserves path)?
- [ ] Mobile hamburger menu works?
- [ ] Active route is highlighted?

**`components/layout/Footer.tsx`**
- [ ] Studio name, social links, navigation columns?
- [ ] WhatsApp link, YouTube, Facebook, Spotify links?
- [ ] Language switcher in footer?

**`components/layout/AdminSidebar.tsx`**
- [ ] All nav items present with correct icons?
- [ ] Pending quotations badge?
- [ ] Active route highlighted?
- [ ] Logout functionality?

**`components/shared/LocaleSwitcher.tsx`**
- [ ] Switches locale on click?
- [ ] Preserves current path (doesn't go to home)?
- [ ] Shows SI / EN / IT options?

**`components/songs/SongCard.tsx`**
- [ ] Cover image, title, year, language badge, genre tag?
- [ ] Hover effects (lift, glow)?
- [ ] Links to correct song detail page?

**`components/contributors/ContributorCard.tsx`**
- [ ] Photo (circular), name, role, song count?
- [ ] Links to contributor profile?

**`components/quote/QuoteWizard.tsx`**
- [ ] See Section 9 checks above

Report: for each component — complete / partially built / missing / has bugs.

---

## AUDIT SECTION 13 — Security Checks

These are critical. Check across the entire codebase:

- [ ] Are there any hardcoded secrets (API keys, tokens, passwords) anywhere in the code?
- [ ] Is the WhatsApp number hardcoded anywhere (should only come from StudioSettings DB)?
- [ ] Is any pricing hardcoded anywhere (should only come from PricingConfig DB)?
- [ ] Do all admin API routes verify authentication before processing?
- [ ] Is the Supabase service role key used ONLY in server-side code (never in client components)?
- [ ] Is `NEXT_PUBLIC_SUPABASE_ANON_KEY` the only Supabase key in client-facing code?
- [ ] Are cron endpoints (`/api/sync/*`) protected with `CRON_SECRET` header?
- [ ] Is `.env.local` in `.gitignore`?
- [ ] Are there any `console.log` statements that print sensitive data?
- [ ] Is there an `error.tsx` in each route group to prevent raw error exposure?
- [ ] Are Zod schemas validating all API POST bodies?

Report: flag every security issue found with the file path and line number.

---

## AUDIT SECTION 14 — Performance & SEO

- [ ] Does every dynamic public page have `generateMetadata()` with at least `title` and `description`?
- [ ] Do song detail pages have `og:image` set to the song's cover art?
- [ ] Do contributor profile pages have `og:image`?
- [ ] Is there a `sitemap.ts` or `sitemap.xml` generated for all songs, contributors, projects?
- [ ] Is there a `robots.txt` that allows indexing of public pages?
- [ ] Is there a `not-found.tsx` file for 404 handling?
- [ ] Are all images using Next.js `<Image>` component (not plain `<img>`)?
- [ ] Are allowed image domains configured in `next.config.ts`?
- [ ] Is `loading.tsx` present for heavy pages (songs, projects)?
- [ ] Are Prisma queries using `select` to fetch only needed fields (not fetching entire rows always)?
- [ ] Is there any client-side data fetching that should be server-side?

Report: list every SEO gap, every performance issue found.

---

## AUDIT SECTION 15 — Deployment Readiness

- [ ] Is `next.config.ts` configured for Cloudflare Pages (or Vercel)?
- [ ] Is there a `.github/workflows/keepalive.yml` for Supabase keep-alive ping?
- [ ] Does `package.json` have correct `build` and `start` scripts?
- [ ] Is `prisma/seed.ts` present and functional?
- [ ] Does `package.json` have `"prisma": { "seed": "tsx prisma/seed.ts" }`?
- [ ] Are all required packages in `dependencies` (not just `devDependencies`)?
- [ ] Is `@prisma/client` in `dependencies`?
- [ ] Is the Prisma client generated in the build step (`prisma generate`)?
- [ ] For Cloudflare Pages: is `@cloudflare/next-on-pages` installed and configured?
- [ ] Is there a `wrangler.toml` if deploying to Cloudflare?
- [ ] Are there any Node.js-specific APIs used that are incompatible with the Edge runtime?

Report: list everything needed before a production deploy.

---

## AUDIT SECTION 16 — Missing Pages & Features (Final Check)

Cross-reference the full intended feature list. Check if these exist at all:

**Public pages — does each route exist?**
- [ ] `/[locale]` — Home
- [ ] `/[locale]/songs` — Songs listing
- [ ] `/[locale]/songs/[slug]` — Song detail
- [ ] `/[locale]/contributors` — Contributors directory
- [ ] `/[locale]/contributors/[slug]` — Contributor profile
- [ ] `/[locale]/projects` — Projects listing
- [ ] `/[locale]/projects/[slug]` — Project detail
- [ ] `/[locale]/services` — Services
- [ ] `/[locale]/quote` — Quotation wizard
- [ ] `/[locale]/contact` — Contact

**Admin pages — does each route exist?**
- [ ] `/admin` — Dashboard home
- [ ] `/admin/login` — Login
- [ ] `/admin/songs` — Songs list
- [ ] `/admin/songs/new` — Add song
- [ ] `/admin/songs/[id]/edit` — Edit song
- [ ] `/admin/contributors` — Contributors list
- [ ] `/admin/contributors/new` — Add contributor
- [ ] `/admin/projects` — Projects list
- [ ] `/admin/quotations` — Quotation inbox
- [ ] `/admin/services` — Services manager
- [ ] `/admin/honorary` — Honorary mentions
- [ ] `/admin/social/sync` — Social sync
- [ ] `/admin/settings` — Settings (Super Admin)

**Required standalone files:**
- [ ] `src/app/not-found.tsx`
- [ ] `src/app/[locale]/not-found.tsx`
- [ ] `src/app/[locale]/loading.tsx`
- [ ] `src/app/[locale]/error.tsx`
- [ ] `src/app/admin/error.tsx`
- [ ] `public/logo.png` — RST logo file
- [ ] `public/hero-video.mp4` — Hero background video (or reference to it)
- [ ] `public/hero-poster.jpg` — Static fallback for mobile hero

Report: list everything that exists, everything that is missing entirely.

---

## FINAL OUTPUT FORMAT

After completing all 16 audit sections above, produce your final report in this exact format:

---

### OVERALL PROJECT STATUS

> Give a single sentence summary: "X% complete — [brief description of state]"

---

### ✅ FULLY IMPLEMENTED (list everything that is done and working correctly)

### ⚠️ PARTIALLY IMPLEMENTED (list everything that exists but is incomplete or has issues — include specific gaps)

### ❌ NOT IMPLEMENTED (list everything that is entirely missing)

### 🔒 SECURITY ISSUES (list every security problem — ranked by severity)

### 🐛 BUGS FOUND (list specific bugs with file path and description)

### 📋 PRIORITY ACTION LIST (ordered 1–N — what to fix/complete first)

Each item in the priority list must include:
- What needs to be done
- Which file(s) to edit
- Rough estimate (quick fix / 30 min / half day / full day)

---

*RST Style Studio LK · Project Audit Prompt v1.0 · August 2026*
