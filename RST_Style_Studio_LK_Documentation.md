# 🎵 RST Style Studio LK

> **Project Documentation** · Full-Stack Web Application Blueprint · v2.0

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
11. [Hosting & Deployment](#11-hosting--deployment)

---

## 1. Project Overview

**Goal:** Build a professional portfolio + customer engagement platform for RST Style Studio LK — a home music studio in Sri Lanka — with an admin dashboard for full content management.

**What the app does:**
- Showcases 100+ songs and music projects
- Displays individual contributor profiles (lyricists, vocalists, instrumentalists, directors, etc.)
- Fetches live content from YouTube, Facebook, and Spotify
- Allows visitors to request a quotation via a multi-step wizard that opens WhatsApp
- Gives the studio admin full control over all content without touching code
- Interactive games (Trivia, Theory, Pitch Match, Rhythm Tap) with monthly leaderboards

---

## 2. Tech Stack

> 💡 **Why Next.js 16?** It handles SSR for SEO, has built-in API routes (no separate backend needed), supports i18n natively, and deploys to Vercel for free with zero configuration.

| Layer | Technology | Why chosen | Cost |
|---|---|---|---|
| Framework | **Next.js 16** (App Router) | SSR + API routes + i18n built-in | Free |
| Language | **TypeScript / JavaScript** | Type safety, fewer runtime bugs | Free |
| Styling | **Tailwind CSS** + shadcn/ui | Fast, consistent, professional UI | Free |
| Fonts | **Noto Sans Sinhala** + Outfit + Plus Jakarta | Sinhala script rendering support | Free |
| i18n | **next-intl** | Sinhala / English / Italian routing | Free |
| Database | **PostgreSQL** via Supabase | Free tier, scalable, real-time | Free |
| ORM | **Prisma** | Type-safe queries, easy migrations | Free |
| Auth | **Supabase Auth** | Role-based access, SSR integration | Free |
| Storage | **Supabase Storage** | Photos, audio previews, video (1GB free) | Free |
| Email | **Resend** | 3,000 emails/month free | Free |
| YouTube | **YouTube Data API v3** | 10k units/day free, official | Free |
| Facebook | **Facebook Graph API** | Page posts/videos, requires token setup | Free |
| Spotify | **Spotify Web API** | Artist tracks, no user login needed | Free |
| Hosting | **Vercel** (free) | Native Next.js, auto CI/CD from GitHub | Free |

---

## 3. Database Schema

> All models use Prisma ORM connected to a PostgreSQL database on Supabase.

### Core Content Models

- **Song**: The central portfolio item. Holds metadata, URLs (YouTube/Spotify/Facebook), cover image, and soft-delete capabilities.
- **Contribution**: Links a `Song` to a `Profile`, tracking the specific role (e.g., Lyricist, Vocalist) and providing credit.
- **Profile**: Individual portfolios for contributors. Includes bios, gallery images, social links, and associated user accounts.
- **Collaborator**: Defines pricing and active roles for a `Profile` to be used in quotations.
- **Service**: Studio services offered, with base prices and multi-language descriptions.

### System Models

- **User**: Maps to Supabase Auth users, tracks Roles (SUPER_ADMIN, ADMIN, CONTRIBUTOR, etc).
- **StudioSettings**: Global configuration. Controls pricing, WhatsApp numbers, theme colors, SEO meta, analytics, and feature toggles.
- **QuotationRequest**: Submitted quote requests, tracking estimated budget, status, and selections.
- **AuditLog**: Tracks admin actions for accountability.
- **Notification**: In-app notifications for admins (e.g. new quotes, claims).

### Games & Engagement Models

- **GamePlayer**: Lightweight registration for the music arcade.
- **GameScore** & **MonthlyLeaderboard**: Tracks high scores per game type (Trivia, Pitch Match, etc.) and manages monthly prize winners.
- **TriviaQuestion**: Admin-managed question bank.

---

## 4. Page Map

### Public pages

| Route | Page | Description |
|---|---|---|
| `/` | Home | Hero, featured songs, studio stats, games preview |
| `/songs` | All songs | Grid with filters |
| `/songs/[slug]` | Song detail | YouTube embed, contributor list |
| `/contributors` | Contributors | Directory of all collaborators |
| `/contributors/[slug]` | Contributor profile | Bio, photo, discography |
| `/services` | Services | What the studio offers |
| `/quote` | Quotation wizard | Multi-step form → budget estimate → WhatsApp |
| `/contact` | Contact | Studio address, WhatsApp, map |

### Admin dashboard (protected — `/admin`)

| Route | Page | Access |
|---|---|---|
| `/admin` | Dashboard overview | Both |
| `/admin/songs` | Songs list + CRUD | Both |
| `/admin/profiles` | Profiles CRUD | Both |
| `/admin/quotations` | Quotation inbox | Both |
| `/admin/services` | Services config | Both |
| `/admin/games/*` | Games & Leaderboards mgmt | Both |
| `/admin/media` | Media storage manager | Both |
| `/admin/settings` | Studio settings | Super Admin only |
| `/admin/backup` | Database export | Super Admin only |

---

## 5. Quotation Wizard Flow

> The quotation page is a multi-step interactive form. No backend is called until the user opens WhatsApp — all budget calculation happens in the browser based on `Collaborator` and `Service` prices fetched at initialization.

1. **Step 1:** Choose service type
2. **Step 2:** Configure options (Language, Melody, Instruments, Video)
3. **Step 3:** Enter contact info
4. **Step 4:** System calculates budget estimate (displayed as a ±15% range)
5. **Step 5:** Confirmation modal to send via WhatsApp
6. **Step 6:** Opens WhatsApp with a pre-filled message, and simultaneously saves to `QuotationRequest` in the DB.

---

## 6. Social Integrations

| Platform | Cache strategy |
|---|---|
| **YouTube** | Store in `SocialCache` DB table, re-fetch via automated sync |
| **Facebook** | Uses System User Token (never expires). Stored in `SocialCache`. |
| **Spotify** | Cached in DB. |

> ⚠️ **Facebook token warning:** Regular Page Access Tokens expire every 60 days. You must use a **Facebook System User** inside Facebook Business Manager to get a non-expiring token.

---

## 7. Internationalization (i18n)

The site supports three languages using `next-intl`. URLs are prefixed by locale: `/si/`, `/en/`, `/it/`.

| Locale | Language | Translation source |
|---|---|---|
| `si` | Sinhala 🇱🇰 | Manually written |
| `en` | English 🇬🇧 | Default |
| `it` | Italian 🇮🇹 | DeepL API (auto) as starting point, manually reviewed |

---

## 8. Critical Issues & Warnings

### ⚠️ 1. Audio & storage management
- Heavy assets (like `Herovideo.MP4` and `Media/` photos) should be hosted in Supabase Storage, **not** in the Next.js `public/` folder, to avoid bloating the Vercel deployment and consuming bandwidth limits.
- Use Next.js `<Image>` component for all images — it auto-compresses and serves WebP format.

### ⚠️ 2. Vercel serverless function limits
- Free tier: 100GB bandwidth/month, function timeout: 10 seconds (sometimes up to 60s max).
- Social syncs are automated via `.github/workflows/keep-supabase-alive.yml` or Vercel Cron.

### ⚠️ 3. WhatsApp number management
The WhatsApp number used in the quotation wizard is dynamically loaded from the `StudioSettings` table. **Never hardcode pricing or contact numbers in the codebase.**

---

*RST Style Studio LK · Documentation v2.0 · August 2026*
