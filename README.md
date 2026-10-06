# New Temizlik — Fullstack

Website, admin panel and API for **New Temizlik Hizmetleri**, a Soma/Manisa-based company specialising in industrial solar power plant (GES) panel cleaning, maintenance monitoring, autonomous cleaning-robot sales and vegetation (weed) control.

The project is a single monorepo containing a **Next.js** public site + admin panel, a **NestJS** REST API, and the full production **Docker Compose** stack (PostgreSQL, Redis, nginx, self-hosted Umami analytics) that is deployed to a VPS by GitHub Actions.

> The public site content is in **Turkish** (`tr-TR`); code, comments and this documentation are a mix of English and Turkish.

---

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Repository structure](#repository-structure)
  - [`backend/`](#backend--nestjs-api)
  - [`frontend/`](#frontend--nextjs-app)
  - [`nginx/`](#nginx)
  - [`.github/workflows/`](#githubworkflows)
- [Routes](#routes)
- [API overview](#api-overview)
- [Getting started (local development)](#getting-started-local-development)
- [Environment variables](#environment-variables)
- [Testing](#testing)
- [Database & migrations](#database--migrations)
- [Deployment](#deployment)
- [Security notes](#security-notes)
- [Scheduled jobs & data retention](#scheduled-jobs--data-retention)
- [Conventions & gotchas](#conventions--gotchas)

---

## Features

**Public site**
- Server-rendered marketing site: home, corporate, services (panel cleaning, maintenance monitoring, robot sales, weed control), "why us" detail pages, references, FAQ, blog, contact, KVKK (Turkish data-protection) page.
- Blog, FAQ and references are managed from the admin panel and served through **ISR** (`revalidate: 3600` plus on-demand tag revalidation).
- SEO: per-page metadata helper, JSON-LD (`Service`, `FAQPage`, `ContactPage`, …), dynamic `sitemap.xml`, `robots.txt`.
- Hero quote form and contact form feeding the admin quote inbox.
- AI chatbot widget (Groq LLM) that qualifies leads and routes visitors to a quote request.
- Page-transition overlay and route loaders.
- Umami + GA4 analytics.

**Admin panel** (`/nt-panel`)
- Cookie-based JWT login with optional **TOTP two-factor authentication** (QR setup).
- CRUD + drag-and-drop ordering for blog posts (Tiptap rich-text editor, cover/inline image upload), FAQs and references (logo upload).
- Quote-request inbox with status workflow and filters.
- Analytics dashboard (proxied from Umami), chatbot dashboard (leads, ratings, funnel), application log viewer, security page (credentials, 2FA).

**Backend**
- Validated configuration (Joi), TypeORM migrations, Redis-backed JWT blacklist, rate limiting, upload hardening (magic-byte sniffing, sharp re-encoding), HTML sanitisation, Sentry, scheduled retention jobs.

---

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | Next.js 16 (App Router, `output: 'standalone'`), React 19, TypeScript 6, Tailwind CSS 4, Tiptap 3, dnd-kit, lucide-react |
| Backend | NestJS 11, TypeScript 5, TypeORM 0.3, Passport JWT, class-validator, `@nestjs/throttler`, `@nestjs/schedule`, Sentry |
| Data | PostgreSQL 16, Redis 7 (AOF enabled) |
| LLM | Groq OpenAI-compatible API (`openai/gpt-oss-120b`, fallback `gpt-oss-20b`) |
| Analytics | Self-hosted [Umami](https://umami.is) 3.1.0 (image pinned by digest) + GA4 |
| Edge | nginx (unprivileged) behind a host-level nginx / TLS |
| CI/CD | GitHub Actions → SSH deploy to VPS with Docker Compose |
| Tests | Jest 30 + Supertest (backend unit & e2e), Vitest 5 (frontend `lib/`) |
| Runtime | Node.js 22, npm 11 |

---

## Architecture

```
                         Internet (TLS terminated at host nginx / Certbot)
                                      │
                                      ▼
                        host nginx ──► 127.0.0.1:8081
                                      │
                ┌─────────────────────▼──────────────────────┐
                │ nginx container (this repo: nginx/)         │
                │  • real-client-IP restoration               │
                │  • security headers + CSP                   │
                │  • rate limiting (limit_req) + gzip         │
                │  • static caching                           │
                └───┬───────────────┬─────────────────┬──────┘
          /api/*    │   /uploads/*  │   everything    │
                    ▼               ▼   else          ▼
            ┌──────────────┐               ┌────────────────────┐
            │ backend:3001 │               │ next:3000          │
            │ NestJS API   │◄──────────────│ SSR / ISR + admin  │
            └──┬────────┬──┘  server-side  └────────────────────┘
               │        │     fetch (API_URL)        ▲
               ▼        ▼                            │ POST /revalidate
        ┌──────────┐ ┌───────┐                       │ (on content change)
        │ postgres │ │ redis │───────────────────────┘
        └──────────┘ └───────┘   (JWT blacklist, LLM budget, rate state)

        Umami (127.0.0.1:3003 → analytics.* subdomain via host nginx) + its own Postgres
```

Key points:

- **One Next.js app** serves both the public site (`app/(site)`) and the admin panel (`app/nt-panel`); there is no separate admin SPA.
- The **browser** talks to the API through the same origin (`NEXT_PUBLIC_API_URL=/api`, proxied by nginx). The **Next.js server** talks to the API directly over the Docker network (`API_URL=http://backend:3001/api`).
- When an admin changes a blog post / FAQ / reference, the backend busts its 60 s in-process cache and fires a webhook to Next's `/revalidate` route so the change appears immediately instead of after the 1-hour ISR window.
- Containers publish to `127.0.0.1` only; ports are chosen not to collide with the sibling project (`renel-enerji`) running on the same VPS (Umami `3003`, nginx `8081`).

---

## Repository structure

```
newtemizlik-fullstack/
├── backend/                   NestJS API (see below)
├── frontend/                  Next.js site + admin panel (see below)
├── nginx/                     Edge nginx config used by docker-compose
│   ├── nginx.conf.template    Reverse proxy, rate limits, cache rules, real-IP handling
│   └── security-headers.conf  HSTS, CSP, X-Frame-Options, Permissions-Policy, …
├── .github/workflows/
│   └── deploy.yml             CI (lint/test/build) → SSH deploy → health check → ISR sweep
├── docker-compose.yml         Production stack: db, redis, backend, next, nginx, umami, umami-db
├── .env.example               Variables consumed by docker-compose.yml
└── .gitignore
```

### `backend/` — NestJS API

```
backend/
├── Dockerfile                 Multi-stage build (builder → slim production image, non-root user)
├── nest-cli.json · tsconfig.json · eslint.config.mjs · .nvmrc · .env.example
├── test/                      End-to-end specs (Jest + Supertest, run in band against a throwaway DB/Redis)
│   ├── setup-e2e.ts           Test DB (5433) / Redis (6380) bootstrap
│   ├── e2e-utils.ts           Shared helpers (app factory, login, …)
│   └── *.e2e-spec.ts          auth, twofa, guards, quote, upload, cache, slug, reorder,
│                              published, analytics, admin-filters
└── src/
    ├── main.ts                Bootstrap: CORS, Swagger, static /uploads, DB logger, listen
    ├── app.module.ts          Root module; Joi env schema (the env inventory), TypeORM,
    │                          throttler, schedule, Sentry, logging middleware
    ├── configure-app.ts       Shared HTTP setup (helmet, cookie-parser, ValidationPipe, /api prefix)
    │                          — reused by main.ts and the e2e tests
    ├── instrument.ts          Sentry initialisation
    ├── data-source.ts         TypeORM DataSource for the migration CLI
    ├── seed.ts                Seeds blog posts / FAQs / references migrated from the old Vite site
    ├── health.controller.ts   GET /api/health (used by Docker healthcheck and deploy)
    │
    ├── auth/                  Login, logout, /me, credential change, TOTP 2FA (setup/confirm/verify/remove)
    │                          JwtStrategy, JwtAuthGuard, admin_config entity + service
    ├── blog/                  Blog posts (public list/detail by slug, admin CRUD, reorder)
    ├── faq/                   FAQ entries (public list, admin CRUD, reorder)
    ├── references/            Customer references / logos (public list, admin CRUD, reorder)
    ├── quote/                 Quote requests (public submit, admin list/status/delete)
    │                          + 12-month retention job
    ├── chat/                  Chatbot: LLM conversation, summary, ratings, events, leads, funnel stats,
    │                          prompts (chat-prompts.ts), abuse guards (chat-guards.ts), retention job
    ├── llm/                   LlmService (Groq client with key rotation + fallback model) and
    │                          a daily LLM health check
    ├── upload/                Blog cover / inline image and reference logo uploads, magic-byte
    │                          validation, sharp processing, weekly orphaned-file cleanup
    ├── analytics/             Authenticated proxy to the Umami API (stats, pageviews, pages, metrics)
    ├── logs/                  DB-backed application logger, admin log viewer, 04:30 daily retention
    ├── redis/                 Global Redis module (ioredis)
    ├── common/                Shared building blocks:
    │   ├── base-content.service.ts   Generic CRUD/reorder base for ordered content
    │   ├── public-cache.{module,service}.ts   60 s in-process cache for public GETs
    │   ├── revalidation.service.ts   Fire-and-forget webhook to Next.js ISR
    │   ├── encryption.service.ts     AES-256-GCM encryption for TOTP secrets (APP_ENCRYPTION_KEY)
    │   ├── html-sanitize.ts / text-sanitize.ts   sanitize-html wrappers
    │   ├── cors-origins.ts · date-range.ts · pagination.ts · slugify.ts · reserved-slugs.ts
    │   ├── fetch-with-timeout.ts · media-fetch.ts · redact.ts · errors.ts · reorder.ts
    │   └── logging.middleware.ts
    └── migrations/            TypeORM migrations (Baseline, ChatTables, AddLokasyonToQuote)
```

Each feature module follows the same layout: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `entities/`, `dto/`, and a `test/` folder with unit specs (`*.spec.ts`).

**Database tables:** `admin_config`, `blog_posts`, `faqs`, `references`, `quote_requests`, `chat_leads`, `chat_ratings`, `chat_daily_stats`, `app_logs`.

### `frontend/` — Next.js app

```
frontend/
├── Dockerfile                 Multi-stage build → standalone server, non-root user
├── next.config.mjs            standalone output, WebP-only image optimiser, /uploads rewrite for local dev
├── proxy.ts                   Next 16 "proxy" (ex-middleware): optimistic cookie check for /nt-panel/*
├── vitest.config.mts · eslint.config.mjs · postcss.config.mjs · tsconfig.json · .nvmrc
├── app/
│   ├── layout.tsx · globals.css · not-found.tsx · robots.ts · sitemap.ts
│   ├── revalidate/route.ts    POST webhook: revalidateTag() guarded by REVALIDATE_SECRET
│   ├── admin/page.tsx         Decoy route (the real panel lives under /nt-panel)
│   ├── (site)/                Public site (shared Navbar/Footer/analytics/chat widget layout)
│   │   ├── page.tsx           Home
│   │   ├── kurumsal/          About the company
│   │   ├── hizmetlerimiz/     Services index + panel-temizlik, panel-bakim, robot-satisi, ot-temizligi
│   │   ├── neden-biz/         "Why us" pages: 7-24-izleme, isg-otonom-teknoloji, periyodik-bakim-plani,
│   │   │                      sertifikali-uzman-kadro, su-tasarrufu, veri-odakli-roi-analizi
│   │   ├── panel-kirlilik-rehberi/   Soiling guide
│   │   ├── referanslarimiz/   References
│   │   ├── sss/               FAQ
│   │   ├── blog/ · blog/[slug]/      Blog index and article
│   │   ├── iletisim/          Contact
│   │   └── kvkk/              Privacy notice
│   └── nt-panel/              Admin panel
│       ├── layout.tsx
│       ├── (auth)/giris/      Login (+ 2FA step)
│       └── (korumali)/        Protected area (layout verifies session via GET /api/auth/me)
│           ├── analitik/ · blog/ (yeni, [id]/duzenle) · referanslar/ (yeni, [id]/duzenle)
│           ├── sss/ · teklif-talepleri/ · chatbot/ · loglar/ · guvenlik/
├── components/
│   ├── sections/              Page sections: Navbar, Hero, HeroQuoteForm, Services, Process, WhyUs,
│   │                          KirProblemleri, ProductGallery, Referanslar, SSS, Contact, Footer
│   ├── ui/                    Shared UI: PageHero, SectionHeader, CtaBand, FaqAccordion, JsonLd,
│   │                          BlogArticleLayout, ChatWidget, TrackedLink, PageLoader,
│   │                          PageTransitionOverlay
│   └── panel/                 Admin UI: AdminShell, AdminTabs, AdminPager, AdminDateRange,
│                              AdminStatCard, AreaChart, MetricBars, BlogForm, ReferansForm, SSSForm,
│                              RichTextEditor (Tiptap), SortableList (dnd-kit),
│                              ConfirmProvider, ToastProvider
├── lib/                       api.ts (server fetch + ISR tags), apiClient.ts / panelApi.ts (browser),
│                              chatApi.ts, seo.ts, analytics.ts, phone.ts, date.ts, readTime.ts,
│                              quoteStatus.ts, companyStats.ts, errors.ts, adminPaging.ts,
│                              useDndReorder.ts, useLatestFetch.ts, usePageTransitionOverlay.ts
│                              + *.test.ts (Vitest)
├── types/api.ts               Shared API response types
└── public/                    Static assets: logos, hero poster/video, service & blog imagery,
                               og.jpg, Google site-verification file
```

### `nginx/`

- `nginx.conf.template` — loaded by the `nginxinc/nginx-unprivileged` image as a template. Routes `/api/auth/*` (strict `10 r/min` zone), `/api/*` (`10 r/s` zone), `/uploads/*` (backend, 30-day cache), `/_next/*` (immutable, 1-year cache), static files, `/sitemap.xml` and everything else to Next.js. Also restores the real client IP (Cloudflare ranges + `X-Forwarded-For` from the host nginx / Docker bridge) and uses Docker DNS with variable `proxy_pass` so restarts of upstream containers don't leave stale IPs.
- `security-headers.conf` — HSTS, `nosniff`, `X-Frame-Options: DENY`, COOP, Referrer-Policy, Permissions-Policy and the Content-Security-Policy (allows GA4 and the Umami subdomain).

### `.github/workflows/`

- `deploy.yml` — on push to `master`: **test** job (Node 22, npm 11, Postgres + Redis service containers: backend lint → unit → e2e → build, frontend lint → test → build) then **deploy** job (SSH to the VPS, `git reset --hard origin/master`, `docker compose up -d --build`, force-restart nginx, poll `/api/health`, then trigger an ISR sweep with `tags: ["all"]`). Actions are pinned by commit SHA; deploys are queued, never cancelled.

---

## Routes

| Area | Path | Notes |
| --- | --- | --- |
| Public | `/`, `/kurumsal`, `/hizmetlerimiz[/…]`, `/neden-biz/…`, `/panel-kirlilik-rehberi`, `/referanslarimiz`, `/sss`, `/blog[/slug]`, `/iletisim`, `/kvkk` | ISR, 1 h + on-demand tags |
| Admin | `/nt-panel/giris` | Login |
| Admin | `/nt-panel/{analitik,blog,referanslar,sss,teklif-talepleri,chatbot,loglar,guvenlik}` | Requires `admin_token` cookie |
| Decoy | `/admin` | Not the real panel |
| Webhook | `POST /revalidate` | `x-revalidate-secret` header; body `{ "tags": ["blog" \| "faq" \| "references" \| "all"] }` |

---

## API overview

All endpoints are prefixed with `/api`. Routes marked 🔒 require a valid admin JWT (httpOnly cookie).

| Module | Endpoints |
| --- | --- |
| Health | `GET /health` |
| Auth | `POST /auth/login`, `POST /auth/2fa/verify`, 🔒 `POST /auth/logout`, 🔒 `GET /auth/me`, 🔒 `PATCH /auth/credentials`, 🔒 `GET /auth/2fa/status`, 🔒 `GET /auth/2fa/setup`, 🔒 `POST /auth/2fa/setup/confirm`, 🔒 `DELETE /auth/2fa/setup` |
| Blog | `GET /blog`, `GET /blog/:slug`, 🔒 `GET /blog/admin/all`, 🔒 `POST /blog`, 🔒 `PATCH /blog/reorder`, 🔒 `PATCH /blog/:id`, 🔒 `DELETE /blog/:id` |
| FAQ | `GET /faq`, 🔒 `GET /faq/admin/all`, 🔒 `POST /faq`, 🔒 `PATCH /faq/reorder`, 🔒 `PATCH /faq/:id`, 🔒 `DELETE /faq/:id` |
| References | `GET /references`, 🔒 `GET /references/admin/all`, 🔒 `POST`, `PATCH /reorder`, `PATCH /:id`, `DELETE /:id` |
| Quote | `POST /quote`, 🔒 `GET /quote/admin/all`, 🔒 `PATCH /quote/admin/:id/status`, 🔒 `DELETE /quote/admin/:id` |
| Chat | `POST /chat`, `POST /chat/summary`, `POST /chat/rating`, `POST /chat/event`, 🔒 `GET /chat/rating/admin/all`, 🔒 `DELETE /chat/rating/admin/:id`, 🔒 `GET /chat/lead/admin/all`, 🔒 `DELETE /chat/lead/admin/:id`, 🔒 `GET /chat/lead/admin/funnel` |
| Upload | 🔒 `POST /upload/blog/:id/cover`, 🔒 `POST /upload/blog/content-image`, 🔒 `POST /upload/references/:id/logo` |
| Analytics | 🔒 `GET /dash/stats`, `/dash/pageviews`, `/dash/pages`, `/dash/metrics` |
| Logs | 🔒 `GET /logs/admin/all` |
| Static | `GET /uploads/*` (served by the backend, cached by nginx) |

Per-route throttles are declared with `@Throttle` (e.g. login 5/min, 2FA verify 10/min, quote 10/min, chat 20/min); the global default is 60 requests/min per IP.

---

## Getting started (local development)

### Prerequisites

- Node.js **22** (see `.nvmrc`) and npm **11** (`npm install -g npm@11` — the lockfiles are generated with npm 11)
- Docker (for PostgreSQL and Redis)

### 1. Start PostgreSQL and Redis

The root `docker-compose.yml` is the production stack and does not publish database ports. For local work, run throwaway containers:

```bash
docker run -d --name nt_dev_pg -p 5440:5432 \
  -e POSTGRES_USER=newtemizlik -e POSTGRES_PASSWORD=devpass -e POSTGRES_DB=newtemizlik \
  postgres:16-alpine

docker run -d --name nt_dev_redis -p 6390:6379 redis:7-alpine
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env — at minimum: DB_PORT=5440, DB_PASS, JWT_SECRET, APP_ENCRYPTION_KEY (64 hex chars),
# ADMIN_PASSWORD_HASH (bcrypt), REDIS_URL=redis://localhost:6390, UMAMI_PASS, FRONTEND_URL

# Handy generators:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"        # JWT_SECRET / APP_ENCRYPTION_KEY
node -e "require('bcrypt').hash('YOUR_PASSWORD',10).then(console.log)"          # ADMIN_PASSWORD_HASH

npm ci
npm run start:dev          # http://localhost:3001/api  (pending migrations run on boot)
npm run seed               # optional: import the original blog posts, FAQs and references
```

### 3. Frontend

```bash
cd frontend
cp .env.example .env.local       # API_URL=http://localhost:3001/api, NEXT_PUBLIC_API_URL=http://localhost:3001/api
npm ci
npm run dev                      # http://localhost:3000
```

Open `http://localhost:3000/nt-panel/giris` and sign in with `ADMIN_USERNAME` and the password you hashed.

### Optional services

- **Umami**: `docker compose up -d umami-db umami` (requires `UMAMI_DB_PASS` / `UMAMI_APP_SECRET` in the root `.env`), then open `http://localhost:3003`, log in (`admin` / `umami`), change the password and create a website to obtain `UMAMI_WEBSITE_ID`.
- **Chatbot**: set `LLM_CHAT_KEYS` (comma-separated Groq keys). When empty, chat endpoints return `503` and the widget shows a static fallback message.

### Full stack with Docker Compose

```bash
cp .env.example .env     # fill in every value; note the "$" → "$$" escaping rule for ADMIN_PASSWORD_HASH
docker compose up -d --build
curl http://localhost:8081/api/health
```

---

## Environment variables

The Joi schema in `backend/src/app.module.ts` is the authoritative inventory of backend variables. Highlights:

| Variable | Used by | Description |
| --- | --- | --- |
| `DB_HOST/PORT/USER/PASS/NAME` | backend | PostgreSQL connection (`DB_HOST=db` inside Compose) |
| `JWT_SECRET`, `JWT_EXPIRES_IN` | backend | JWT signing secret and lifetime (default `8h`) |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH` | backend | Initial admin account (bcrypt hash only) |
| `APP_ENCRYPTION_KEY` | backend | 64-hex-char key that encrypts TOTP secrets |
| `REDIS_URL`, `REDIS_PASS` | backend / redis | JWT blacklist, LLM daily budget |
| `FRONTEND_URL`, `CORS_ORIGINS` | backend | Allowed origins (`www` variant derived when `CORS_ORIGINS` is empty) |
| `REVALIDATE_URL`, `REVALIDATE_SECRET` | backend + frontend | ISR webhook target and shared secret |
| `UMAMI_URL`, `UMAMI_USER`, `UMAMI_PASS`, `UMAMI_WEBSITE_ID` | backend | Server-side Umami API access for the analytics dashboard |
| `LLM_CHAT_KEYS`, `LLM_DAILY_LIMIT` | backend | Groq API keys (priority order) and daily call budget |
| `SENTRY_DSN` | backend | Optional error tracking |
| `API_URL` | frontend (server) | Backend URL used by SSR/ISR fetches |
| `NEXT_PUBLIC_API_URL` | frontend (browser) | `/api` in production (same-origin via nginx) |
| `NEXT_PUBLIC_UMAMI_URL`, `NEXT_PUBLIC_UMAMI_WEBSITE_ID` | frontend | Umami tracking script; **baked in at build time** (passed as Docker build args) |
| `DB_PASS`, `UMAMI_DB_PASS`, `UMAMI_APP_SECRET` | compose | Database passwords and Umami app secret |

Never reuse the same secret across `JWT_SECRET`, `APP_ENCRYPTION_KEY` and `UMAMI_APP_SECRET`.

---

## Testing

```bash
# Backend (from backend/)
npm run lint
npm test                 # unit tests (Jest, src/**/*.spec.ts)
npm run test:e2e         # e2e tests; expects Postgres on :5433 and Redis on :6380 (see test/setup-e2e.ts)
npm run test:cov

# Frontend (from frontend/)
npm run lint
npm test                 # Vitest, lib/**/*.test.ts
npm run build
```

CI runs all of the above on every push to `master` and blocks deployment on failure.

---

## Database & migrations

`synchronize` is **never** enabled. The schema is managed exclusively by TypeORM migrations in `backend/src/migrations/`, and pending migrations run automatically on application start (`migrationsRun: true`).

```bash
cd backend
npm run migration:show
npm run migration:generate --name=AddSomething
npm run migration:run
npm run migration:revert
```

---

## Deployment

1. Push to `master`.
2. GitHub Actions runs lint / tests / e2e / builds.
3. On success it SSHes to the VPS (`VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` repository secrets), hard-resets the checkout to `origin/master`, rebuilds with `docker compose up -d --build`, and prunes images.
4. nginx is **always restarted** — its config files are bind-mounted, so editing them does not recreate the container on its own.
5. The workflow polls `http://localhost:8081/api/health` (10 × 5 s) and prints backend logs on failure.
6. An ISR sweep (`POST /revalidate` with `tags: ["all"]`) refreshes pages that were statically generated at build time while the backend was still down.

The VPS also runs a **host-level nginx** that terminates TLS (Certbot) and proxies `www.newtemizlik.com` to `127.0.0.1:8081` and the analytics subdomain to `127.0.0.1:3003`. That host configuration lives outside this repository.

Persistent Docker volumes: `pgdata`, `redisdata`, `uploads`, `umami_pgdata`, `next_cache` (Next image-optimiser / ISR cache — keeps cold-cache image resizes from timing out after deploys).

---

## Security notes

- **Auth**: bcrypt-hashed admin password, short-lived JWT in an httpOnly cookie, `tokenVersion` + Redis blacklist for logout/revocation, optional TOTP 2FA with encrypted secrets.
- **Defence in depth**: nginx `limit_req` zones in front of NestJS `ThrottlerGuard`; helmet; strict DTO validation (`whitelist` + `forbidNonWhitelisted`); HTML sanitisation of rich-text content.
- **Uploads**: size limits, magic-byte file-type detection, re-encoding through sharp, non-root container user, weekly cleanup of orphaned files.
- **Headers/CSP**: HSTS, `X-Frame-Options: DENY`, `nosniff`, Permissions-Policy and a CSP. `'unsafe-inline'` is currently required by GA4/Umami inline snippets; a nonce-based CSP has been evaluated and consciously deferred.
- **Real client IP**: restored in nginx from Cloudflare ranges / `X-Forwarded-For`; keep the IP range lists in `nginx.conf.template` in sync with <https://www.cloudflare.com/ips/>.
- **Supply chain**: GitHub Actions pinned by SHA, Umami image pinned by digest, `npm ci` with committed lockfiles, `overrides` for patched transitive dependencies.
- **Admin panel hiding**: `/admin` is a decoy; the real panel is under `/nt-panel`. This is obscurity, not a security boundary — real protection is the cookie + JWT verification in the protected layout and the backend guards.

---

## Scheduled jobs & data retention

| Schedule (server time) | Job |
| --- | --- |
| `30 4 * * *` | Application logs retention (`logs.service.ts`) |
| `0 5 * * *` | Delete quote requests older than **12 months** (KVKK commitment) |
| `0 6 * * *` | Delete chat leads / ratings older than **12 months** |
| `0 9 * * *` | LLM health check (verifies the configured Groq models are still available) |
| `0 5 * * 0` | Weekly cleanup of uploaded files no longer referenced in the database |

---

## Conventions & gotchas

- **Next.js 16**: `middleware.ts` is now `proxy.ts`; APIs differ from older versions. Read the bundled docs in `frontend/node_modules/next/dist/docs/` before changing framework-level code (see `frontend/AGENTS.md`).
- **Build without a backend**: `next build` must not require the API. `lib/api.ts` falls back to empty data at build time; the post-deploy ISR sweep fills in real content.
- **`NEXT_PUBLIC_*` values are compile-time**: changing them requires rebuilding the `next` image (they are passed as Docker build args).
- **bcrypt hashes in the root `.env`**: Docker Compose interpolates `$`; escape every `$` as `$$` or the hash is silently corrupted. (`backend/.env` is read by dotenv and needs no escaping.)
- **Images**: AVIF is intentionally disabled — sharp's AVIF encoding was slow enough on the VPS to cause nginx 504s; WebP only.
- **Service list duplication**: the list of services is hand-duplicated in several places (`components/sections/Services.tsx`, `Navbar.tsx`, `Footer.tsx`, `app/(site)/hizmetlerimiz/page.tsx`, `app/sitemap.ts`, and the chatbot prompt in `backend/src/chat/chat-prompts.ts`). Update all of them when adding or renaming a service.
- **Memory limits**: every container has a `mem_limit` sized for the shared 5.8 GB VPS; keep that in mind when adding services.
- **Zombie reaping**: the `umami` service runs with `init: true` because its PID 1 (`pnpm`) does not reap child processes.
