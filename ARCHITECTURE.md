# Developer Portfolio — System Architecture Document

> **Version:** 1.0.0  
> **Date:** 2026-04-09  
> **Status:** Approved for Implementation  
> **Target:** World-Class Developer Portfolio with AI, CMS, Real-Time Features

---

## Table of Contents

1. [Executive Summary & Backend Decision](#1-executive-summary--backend-decision)
2. [System Architecture Diagram](#2-system-architecture-diagram)
3. [Component Specifications](#3-component-specifications)
4. [API Contracts & Service Boundaries](#4-api-contracts--service-boundaries)
5. [Database Schema (ERD)](#5-database-schema-erd)
6. [Deployment Architecture](#6-deployment-architecture)
7. [Security Architecture](#7-security-architecture)
8. [Data Flow for Key Features](#8-data-flow-for-key-features)
9. [Performance Strategy (Lighthouse 95+, TTFB < 200ms, LCP < 1.5s)](#9-performance-strategy)
10. [Scalability Plan](#10-scalability-plan)
11. [Monitoring & Observability](#11monitoring--observability)
12. [Technology Stack Summary](#12-technology-stack-summary)

---

## 1. Executive Summary & Backend Decision

### 1.1 Backend Choice: Laravel (Selected)

After rigorous evaluation of Laravel vs NestJS, **Laravel is the recommended backend** for this developer portfolio. Here's the decision matrix:

| Criterion | Laravel | NestJS | Rationale |
|---|---|---|---|
| **CMS/Admin Dashboard** | ⭐⭐⭐⭐⭐ Nova/Filament provide production-ready admin panels out-of-the-box | ⭐⭐⭐ Requires building from scratch or integrating third-party | Filament alone saves 200+ dev hours |
| **Development Velocity** | ⭐⭐⭐⭐⭐ Batteries-included: auth, queues, mail, notifications | ⭐⭐⭐⭐ Modular but requires assembling ecosystem | Faster time-to-market |
| **Ecosystem Maturity** | ⭐⭐⭐⭐⭐ 10+ years, massive package ecosystem | ⭐⭐⭐⭐ Younger but growing rapidly | Laravel's package ecosystem is unmatched |
| **Real-Time Support** | ⭐⭐⭐⭐ Laravel Echo + WebSockets (Laravel Reverb) | ⭐⭐⭐⭐⭐ Native WebSocket support via Socket.io/Gateways | NestJS has slight edge, but Reverb is production-ready |
| **Vector DB / AI Integration** | ⭐⭐⭐⭐ Laravel supports any PHP SDK; pgvector via raw queries | ⭐⭐⭐⭐⭐ Better TypeScript ecosystem for AI tools | Tie — both can integrate OpenAI, LangChain, pgvector |
| **Team Familiarity** | ⭐⭐⭐⭐ PHP is ubiquitous | ⭐⭐⭐ TypeScript requires Node expertise | Depends on team; PHP is more universally known |
| **Performance** | ⭐⭐⭐⭐ OPCache + Laravel Octane (Swoole/RoadRunner) | ⭐⭐⭐⭐⭐ Native async, faster baseline | NestJS wins on raw perf, but Laravel meets TTFB targets |
| **Long-Term Maintenance** | ⭐⭐⭐⭐⭐ Convention over configuration, clear patterns | ⭐⭐⭐⭐ Dependency injection can add complexity | Laravel's convention-driven approach reduces cognitive load |

### 1.2 Decision: Laravel Wins

**Primary Reasons:**
1. **Filament Admin Panel** — Production-grade CMS with roles, permissions, form builders, table builders, dashboards. Eliminates 3-6 months of admin development.
2. **Laravel Reverb** — First-party WebSocket server eliminates need for Pusher/external services.
3. **Laravel Octane** — Brings TTFB down to <50ms, easily meeting the 200ms target.
4. **Developer Portfolio Context** — This is a content-heavy, media-rich application. Laravel's strengths in content management, file handling, and SEO (via spatie packages) align perfectly.

**Architecture Pattern:** Modular Monolith with clear domain boundaries (escape hatch to microservices if needed).

---

## 2. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                                    CLIENT LAYER                                      │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │   Web Browser │  │  Mobile App  │  │  API Clients │  │  AI Chat Interface    │  │
│  │  (Desktop/M)  │  │  (Future)    │  │  (Webhooks)  │  │  (Streaming SSE)      │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────────┬─────────────┘  │
│         │                 │                  │                     │                │
│         └─────────────────┴──────────────────┴─────────────────────┘                │
│                                   │                                                 │
│                              ┌────▼────┐                                            │
│                              │   CDN    │  CloudFlare / Vercel Edge                 │
│                              │ (Static  │  - Static asset caching                   │
│                              │  + Edge) │  - Image optimization (next/image)        │
│                              └────┬────┘  - DDoS protection                        │
│                                   │         - WAF                                   │
└───────────────────────────────────┼─────────────────────────────────────────────────┘
                                    │
┌───────────────────────────────────▼─────────────────────────────────────────────────┐
│                              FRONTEND LAYER (Next.js)                                │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌────────────────────────────────────────────────────────────────────────────┐    │
│  │                        Next.js App Router (SSR/ISR)                        │    │
│  ├────────────────────────────────────────────────────────────────────────────┤    │
│  │                                                                            │    │
│  │  ┌─────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────────┐  │    │
│  │  │   Pages/     │ │   API Routes │ │ Middleware   │ │  Server Actions  │  │    │
│  │  │   Routes     │ │  (BFF Proxy) │ │  (Auth,      │ │  (Mutations)     │  │    │
│  │  │              │ │              │ │   i18n,      │ │                  │  │    │
│  │  │ /            │ │ /api/        │ │   Rewrite)   │ │  form actions    │  │    │
│  │  │ /about       │ │   health     │ │              │ │  revalidatePath  │  │    │
│  │  │ /projects    │ │   proxy/*    │ │  x-user-id   │ │  cookies()       │  │    │
│  │  │ /blog        │ │   webhook/*  │ │  x-session   │ │                  │  │    │
│  │  │ /projects/:id│ │              │ │              │ │                  │  │    │
│  │  │ /blog/:slug  │ └──────────────┘ └──────────────┘ └──────────────────┘  │    │
│  │  │ /admin/*     │                                                         │    │
│  │  │ /api-chat    │  ┌──────────────────────────────────────────────────┐   │    │
│  │  │ /contact     │  │              Component Architecture              │   │    │
│  │  │ /sitemap.xml │  ├──────────────────────────────────────────────────┤   │    │
│  │  │ /robots.txt  │  │  UI Components (shadcn/ui)                       │   │    │
│  │  │ /feed.xml    │  │  Data Components (SWR / React Query)             │   │    │
│  │  │              │  │  Layout Components (Shell, Header, Footer)       │   │    │
│  │  │              │  │  Real-Time Components (useWebSocket hook)        │   │    │
│  │  └─────────────┘  └──────────────────────────────────────────────────┘   │    │
│  │                                                                            │    │
│  │  Caching:                                                                  │    │
│  │  - ISR: revalidateTag / revalidatePath for blog, projects (5min-1hr)      │    │
│  │  - SSG: Static generation for about, resume                               │    │
│  │  - SSR: Dynamic pages with auth (dashboard, admin)                        │    │
│  │  - Edge caching: CDN stale-while-revalidate                                │    │
│  └───────────────────────────────────┬────────────────────────────────────────┘    │
│                                      │                                             │
│                              Backend API Calls (fetch)                             │
│                              - Server-side: direct HTTP                            │
│                              - Client-side: SWR with dedup                         │
└──────────────────────────────────────┼─────────────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼─────────────────────────────────────────────┐
│                              BACKEND LAYER (Laravel)                                │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌────────────────────────────────────────────────────────────────────────────┐    │
│  │                   Laravel Application (Octane + Swoole)                     │    │
│  │                   Listening on: 8081 (internal)                            │    │
│  ├────────────────────────────────────────────────────────────────────────────┤    │
│  │                                                                            │    │
│  │  ┌──────────────────────────────────────────────────────────────────┐     │    │
│  │  │                    API Layer (routes/api.php)                     │     │    │
│  │  ├──────────────────────────────────────────────────────────────────┤     │    │
│  │  │                                                                  │     │    │
│  │  │  v1/  ┌─────────┐ ┌──────────┐ ┌────────┐ ┌─────────┐          │     │    │
│  │  │      │projects  │ │ blog     │ │ skills │ │contact  │          │     │    │
│  │  │      │/         │ │ /        │ │ /      │ │/messages│          │     │    │
│  │  │      │{id}      │ │ {slug}   │ │ {id}   │ │         │          │     │    │
│  │  │      └─────────┘ └──────────┘ └────────┘ └─────────┘          │     │    │
│  │  │                                                                  │     │    │
│  │  │  admin/ ┌─────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐     │     │    │
│  │  │        │dashboard│ │ analytics│ │ settings│ │  users    │     │     │    │
│  │  │        └─────────┘ └──────────┘ └──────────┘ └──────────┘     │     │    │
│  │  │                                                                  │     │    │
│  │  │  ai/   ┌──────────┐ ┌──────────┐ ┌──────────────────────┐      │     │    │
│  │  │       │chat      │ │embed     │ │ project-recommender  │      │     │    │
│  │  │       │(stream)  │ │/generate │ │ (vector similarity)  │      │     │    │
│  │  │       └──────────┘ └──────────┘ └──────────────────────┘      │     │    │
│  │  │                                                                  │     │    │
│  │  │  websocket/ ┌────────────────────────────────────────────┐     │     │    │
│  │  │             │  Laravel Reverb (WebSocket Server)         │     │     │    │
│  │  │             │  Channels:                                 │     │     │    │
│  │  │             │  - notifications.{userId}                  │     │     │    │
│  │  │             │  - chat.{sessionId}                        │     │     │    │
│  │  │             │  - analytics.live                          │     │     │    │
│  │  │             │  - presence.online-admin                   │     │     │    │
│  │  │             └────────────────────────────────────────────┘     │     │    │
│  │  └──────────────────────────────────────────────────────────────────┘     │    │
│  │                                                                            │    │
│  │  ┌──────────────────────────────────────────────────────────────────┐     │    │
│  │  │                    Service Layer (app/Services)                    │     │    │
│  │  ├──────────────────────────────────────────────────────────────────┤     │    │
│  │  │                                                                  │     │    │
│  │  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐     │     │    │
│  │  │  │ ContentService │  │   AIService    │  │AnalyticsService│     │     │    │
│  │  │  │                │  │                │  │                │     │     │    │
│  │  │  │ - CRUD ops     │  │ - Chat comp.   │  │ - Page views   │     │     │    │
│  │  │  │ - Media mgmt   │  │ - Embed gen.   │  │ - Geo data     │     │     │    │
│  │  │  │ - Slug gen.    │  │ - Vector ops   │  │ - Engagement   │     │     │    │
│  │  │  │ - Cache mgmt   │  │ - Rec. engine  │  │ - Real-time    │     │     │    │
│  │  │  │ - ISR trigger  │  │ - Token mgmt   │  │ - Aggregates   │     │     │    │
│  │  │  └───────┬────────┘  └───────┬────────┘  └───────┬────────┘     │     │    │
│  │  │          │                   │                   │               │     │    │
│  │  │  ┌───────▼────────┐  ┌───────▼────────┐  ┌───────▼────────┐     │     │    │
│  │  │  │  MediaService  │  │ VectorService  │  │  CacheService  │     │     │    │
│  │  │  │                │  │                │  │                │     │     │    │
│  │  │  │ - Image opt.   │  │ - Index mgmt   │  │ - Tag invalid. │     │     │    │
│  │  │  │ - Thumbnail    │  │ - Similarity   │  │ - Warm-up      │     │     │    │
│  │  │  │ - CDN push     │  │ - Chunking     │  │ - Rate limit   │     │     │    │
│  │  │  └────────────────┘  └────────────────┘  └────────────────┘     │     │    │
│  │  │                                                                  │     │    │
│  │  └──────────────────────────────────────────────────────────────────┘     │    │
│  │                                                                            │    │
│  │  ┌──────────────────────────────────────────────────────────────────┐     │    │
│  │  │                  Job/Queue Workers (app/Jobs)                     │     │    │
│  │  ├──────────────────────────────────────────────────────────────────┤     │    │
│  │  │                                                                  │     │    │
│  │  │  GenerateEmbeddingsJob  │  OptimizeMediaJob  │  SendEmailJob     │     │    │
│  │  │  RefreshISRJob          │  AggregateStatsJob │  WebhookNotifyJob │     │    │
│  │  │  CleanVectorIndexJob    │  GenerateSitemapJob│  BackupJob        │     │    │
│  │  │                                                                  │     │    │
│  │  └──────────────────────────────────────────────────────────────────┘     │    │
│  │                                                                            │    │
│  │  ┌──────────────────────────────────────────────────────────────────┐     │    │
│  │  │                    Filament Admin Panel                          │     │    │
│  │  ├──────────────────────────────────────────────────────────────────┤     │    │
│  │  │  - Content management (projects, blog, skills, testimonials)     │     │    │
│  │  │  - Media library with bulk operations                            │     │    │
│  │  │  - User/role management (Spatie Permission)                      │     │    │
│  │  │  - Analytics dashboard with charts                               │     │    │
│  │  │  - Settings management (site config, SEO, integrations)          │     │    │
│  │  │  - AI content assistant (generate descriptions, tags)            │     │    │
│  │  │  - Activity log (spatie/laravel-activitylog)                     │     │    │
│  │  └──────────────────────────────────────────────────────────────────┘     │    │
│  └────────────────────────────────────────────────────────────────────────────┘    │
│                                                                                     │
└──────────────────────────────────────┬─────────────────────────────────────────────┘
                                       │
┌──────────────────────────────────────▼─────────────────────────────────────────────┐
│                              DATA LAYER                                            │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐      │
│  │     PostgreSQL 16    │  │    Redis 7           │  │   pgvector           │      │
│  │  (Primary Database)  │  │   (Cache + Queue)    │  │  (Vector Extension)  │      │
│  ├──────────────────────┤  ├──────────────────────┤  ├──────────────────────┤      │
│  │                      │  │                      │  │                      │      │
│  │  Tables:             │  │  Cache:              │  │  (Same PG instance)  │      │
│  │  - users             │  │  - nextjs_isr:*      │  │                      │      │
│  │  - projects          │  │  - api_response:*     │  │  Tables:             │      │
│  │  - project_media     │  │  - view_count:*       │  │  - ai_embeddings     │      │
│  │  - blog_posts        │  │  - rate_limit:*       │  │  - project_vectors   │      │
│  │  - blog_categories   │  │  - session:*          │  │  - content_chunks    │      │
│  │  - skills            │  │                      │  │                      │      │
│  │  - testimonials      │  │  Queues:             │  │  Index:              │      │
│  │  - contact_messages  │  │  - default           │  │  HNSW (ivfflat)      │      │
│  │  - site_settings     │  │  - embeddings        │  │  cosine_similarity   │      │
│  │  - seo_metadata      │  │  - media             │  │  euclidean_distance  │      │
│  │  - analytics_events  │  │  - analytics         │  │                      │      │
│  │  - api_keys          │  │  - emails            │  │                      │      │
│  │  - activity_log      │  │                      │  │                      │      │
│  │  - personal_access   │  │  Real-Time:          │  │                      │      │
│  │    _tokens           │  │  - Reverb pub/sub    │  │                      │      │
│  │                      │  │  - Presence data     │  │                      │      │
│  │  Indexes:            │  │  - Channel state     │  │                      │      │
│  │  - GIN (full-text)   │  │                      │  │                      │      │
│  │  - B-tree (FKs)      │  │                      │  │                      │      │
│  │  - Partial (soft del)│  │                      │  │                      │      │
│  └──────────────────────┘  └──────────────────────┘  └──────────────────────┘      │
│                                                                                     │
│  ┌──────────────────────┐  ┌──────────────────────┐                                 │
│  │  Object Storage      │  │  External Services   │                                 │
│  │  (S3 / MinIO)        │  ├──────────────────────┤                                 │
│  ├──────────────────────┤  │                      │                                 │
│  │  Buckets:            │  │  OpenAI API          │  - Chat completions             │
│  │  - media-projects    │  │  OpenAI Embeddings   │  - Text embeddings              │
│  │  - media-blog        │  │  Resend/SendGrid     │  - Transactional emails         │
│  │  - media-general     │  │  Plausible/Fathom    │  - Privacy-first analytics      │
│  │                      │  │  GitHub API          │  - Project sync                 │
│  └──────────────────────┘  └──────────────────────┘                                 │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Specifications

### 3.1 Next.js Frontend (`/frontend`)

| Aspect | Specification |
|---|---|
| **Framework** | Next.js 15.x (App Router) |
| **Runtime** | Node.js 22 LTS |
| **Rendering Strategy** | Hybrid: SSG (static pages), ISR (content pages), SSR (authenticated pages) |
| **Styling** | Tailwind CSS 4 + shadcn/ui components |
| **State Management** | Zustand (client), React Query / SWR (server state) |
| **Data Fetching** | Native `fetch` (server), SWR (client) with deduplication |
| **Form Handling** | React Hook Form + Zod validation |
| **Real-Time** | Custom `useWebSocket` hook connecting to Laravel Reverb |
| **Animation** | Framer Motion (selective, with `prefers-reduced-motion` respect) |
| **i18n** | next-intl for internationalization |
| **Image Optimization** | `next/image` with sharp, served via CDN |
| **Bundle Analysis** | @next/bundle-analyzer, target < 200KB JS initial load |
| **Testing** | Vitest (unit), Playwright (E2E) |

**Key Pages & Rendering Strategy:**

| Route | Strategy | Revalidation | Rationale |
|---|---|---|---|
| `/` | ISR | 300s | Home page, changes infrequently |
| `/about` | SSG | Build-time | Static content |
| `/projects` | ISR | 300s | Project list, tag-based filtering |
| `/projects/[slug]` | ISR | On-demand (tag invalidation) | Individual projects |
| `/blog` | ISR | 60s | Blog listing, frequent updates |
| `/blog/[slug]` | ISR | On-demand | Individual posts |
| `/api-chat` | SSR | N/A | AI chat, always dynamic |
| `/contact` | SSR | N/A | Form with CSRF |
| `/admin/**` | SSR | N/A | Admin panel (Laravel Filament) |

### 3.2 Laravel Backend (`/backend`)

| Aspect | Specification |
|---|---|
| **Framework** | Laravel 11.x |
| **Runtime** | PHP 8.3 + Laravel Octane (Swoole) |
| **API Style** | RESTful JSON with API versioning (`/api/v1/`) |
| **Authentication** | Laravel Sanctum (SPA cookies) + API tokens |
| **Authorization** | Spatie Laravel Permission (roles + permissions) |
| **Validation** | Form Request classes with custom rules |
| **Queue Driver** | Redis (separate database from cache) |
| **Admin Panel** | Filament 3.x |
| **WebSockets** | Laravel Reverb |
| **API Resources** | Laravel API Resources for response transformation |
| **Testing** | Pest PHP (unit + feature) |
| **Static Analysis** | PHPStan level 8, Laravel Pint |

**Directory Structure:**

```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/Api/V1/       # API controllers
│   │   ├── Controllers/Admin/        # Admin controllers
│   │   ├── Middleware/               # Custom middleware
│   │   ├── Requests/                 # Form requests
│   │   └── Resources/                # API resources
│   ├── Services/                     # Business logic
│   │   ├── ContentService.php
│   │   ├── AIService.php
│   │   ├── AnalyticsService.php
│   │   ├── MediaService.php
│   │   ├── VectorService.php
│   │   └── CacheService.php
│   ├── Jobs/                         # Queue jobs
│   ├── Models/                       # Eloquent models
│   ├── Policies/                     # Authorization policies
│   └── Events/                       # Domain events
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── factories/
├── routes/
│   ├── api.php                       # API routes
│   ├── web.php                       # Web routes (Filament)
│   └── channels.php                  # Broadcast channels
├── config/                           # Configuration
├── tests/                            # Pest tests
└── filament/                         # Filament resources
```

### 3.3 Admin Dashboard (Filament)

| Feature | Implementation |
|---|---|
| **Content Management** | Filament Resources for Projects, BlogPosts, Skills, Testimonials |
| **Media Library** | Spatie Media Library integration with Filament media manager |
| **AI Content Assistant** | Custom Filament Action to generate descriptions/tags via OpenAI |
| **Analytics Dashboard** | Filament Widgets with charts (page views, visitor geo, top content) |
| **Contact Messages** | Filament Resource with reply functionality |
| **User Management** | Filament User resource with role/permission assignment |
| **Settings** | spatie/laravel-settings for site-wide configuration |
| **Activity Log** | spatie/laravel-activitylog for audit trail |
| **SEO Management** | Fields for meta title, description, OG image per content type |
| **Scheduled Publishing** | Published at datetime with job to trigger ISR invalidation |

---

## 4. API Contracts & Service Boundaries

### 4.1 Service Boundaries

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        MODULAR MONOLITH (Laravel)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌──────────────┐ │
│  │   Content     │  │     AI/ML     │  │  Analytics    │  │  Notification│ │
│  │   Module      │  │   Module      │  │   Module      │  │   Module     │ │
│  ├───────────────┤  ├───────────────┤  ├───────────────┤  ├──────────────┤ │
│  │ Projects      │  │ Chat          │  │ Page Views    │  │ Email        │ │
│  │ Blog Posts    │  │ Embeddings    │  │ Events        │  │ WebSocket    │ │
│  │ Skills        │  │ Recommendations│ │ Aggregates    │  │ Real-time    │ │
│  │ Testimonials  │  │ Vector Search │  │ Geo Tracking  │  │ Push         │ │
│  │ Media         │  │ Content Gen   │  │ Dashboards    │  │ Alerts       │ │
│  │ Categories    │  │               │  │               │  │              │ │
│  └───────┬───────┘  └───────┬───────┘  └───────┬───────┘  └──────┬───────┘ │
│          │                   │                   │                 │         │
│          └───────────────────┴───────────────────┴─────────────────┘         │
│                                      │                                        │
│  ┌───────────────────────────────────▼───────────────────────────────────┐   │
│  │                        Shared Infrastructure                          │   │
│  │  - Auth (Sanctum)  - Cache (Redis)  - Queue (Redis)  - Storage (S3)  │   │
│  │  - Validation        - Logging         - Events         - Settings   │   │
│  └───────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 4.2 Public API Contract (v1)

#### Authentication

All public endpoints are unauthenticated except admin routes.

```
POST   /api/v1/contact              # Submit contact form
GET    /api/v1/health               # Health check
```

#### Projects

```
GET    /api/v1/projects
       Query: ?page=1&per_page=12&category=web&tag=react&sort=featured,date
       Response: Paginated<ProjectResource>
       
       Headers:
         x-cache-status: HIT/MISS/BYPASS
         x-total-count: 42

GET    /api/v1/projects/{slug}
       Response: ProjectDetailResource
       Includes: media[], related_projects[]
```

**ProjectResource Schema:**
```json
{
  "id": "uuid",
  "title": "string",
  "slug": "string",
  "description": "string",
  "content": "html_content",
  "featured_image": {
    "url": "string",
    "width": "int",
    "height": "int",
    "alt": "string",
    "blurhash": "string"
  },
  "media": [
    {
      "type": "image|video|gif",
      "url": "string",
      "caption": "string",
      "width": "int",
      "height": "int"
    }
  ],
  "technologies": ["string"],
  "tags": ["string"],
  "category": "string",
  "links": {
    "demo": "url|null",
    "github": "url|null",
    "docs": "url|null"
  },
  "published_at": "datetime",
  "view_count": "int",
  "related_projects": ["ProjectResource"]
}
```

#### Blog

```
GET    /api/v1/blog
       Query: ?page=1&per_page=10&category=tutorials&tag=laravel
       Response: Paginated<BlogPostResource>

GET    /api/v1/blog/{slug}
       Response: BlogPostDetailResource
       Headers: x-reading-time: 8

GET    /api/v1/blog/categories
       Response: [BlogCategoryResource]

GET    /api/v1/blog/feed.xml
       Response: RSS 2.0 XML
```

**BlogPostResource Schema:**
```json
{
  "id": "uuid",
  "title": "string",
  "slug": "string",
  "excerpt": "string",
  "content": "html_content",
  "cover_image": {
    "url": "string",
    "alt": "string"
  },
  "category": "BlogCategoryResource",
  "tags": ["string"],
  "author": {
    "name": "string",
    "avatar": "url"
  },
  "published_at": "datetime",
  "updated_at": "datetime",
  "reading_time_minutes": "int",
  "seo": {
    "meta_title": "string",
    "meta_description": "string",
    "og_image": "url"
  }
}
```

#### Skills

```
GET    /api/v1/skills
       Query: ?category=backend
       Response: [SkillResource]
```

**SkillResource Schema:**
```json
{
  "name": "string",
  "category": "string",
  "proficiency": "int (1-100)",
  "icon": "string",
  "years_experience": "float"
}
```

#### Contact

```
POST   /api/v1/contact
       Request: { "name": "string", "email": "string", "subject": "string", "message": "string" }
       Response: { "message": "Message sent successfully", "tracking_id": "uuid" }
       Rate Limit: 5 per hour per IP
```

#### AI Chat

```
POST   /api/v1/ai/chat
       Request: { "message": "string", "session_id": "uuid|null" }
       Response: SSE Stream
       
       Event: message
       data: { "content": "chunk", "session_id": "uuid", "done": false }
       
       Event: message_end
       data: { "session_id": "uuid", "tokens_used": 150 }
       
       Rate Limit: 20 per hour per session
```

#### AI Recommendations

```
GET    /api/v1/ai/recommendations
       Query: ?project_id=uuid&limit=3
       Response: [ProjectResource]
       Strategy: Vector similarity on project embeddings
```

#### Admin API (Authenticated)

```
GET    /api/v1/admin/analytics/overview
       Response: { "page_views", "unique_visitors", "top_pages", "geo_distribution" }

GET    /api/v1/admin/analytics/realtime
       Response: { "active_users": 42, "pages": [...] }

POST   /api/v1/admin/content/{type}/{id}/publish
       Response: { "message": "Published", "isr_invalidated": true }

POST   /api/v1/admin/ai/generate-description
       Request: { "prompt": "string", "context": "object" }
       Response: { "generated_text": "string", "tokens_used": 50 }
```

### 4.3 Error Response Format

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The given data was invalid.",
    "details": [
      {
        "field": "email",
        "message": "The email field must be a valid email address."
      }
    ],
    "request_id": "req_abc123"
  }
}
```

**HTTP Status Codes:**

| Code | Usage |
|---|---|
| 200 | Success |
| 201 | Created |
| 204 | No Content (successful deletion) |
| 400 | Bad Request / Validation Error |
| 401 | Unauthenticated |
| 403 | Unauthorized (insufficient permissions) |
| 404 | Not Found |
| 409 | Conflict (e.g., duplicate slug) |
| 422 | Unprocessable Entity (business logic error) |
| 429 | Rate Limit Exceeded |
| 500 | Internal Server Error |
| 503 | Service Unavailable (maintenance) |

---

## 5. Database Schema (ERD)

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                        DATABASE SCHEMA (PostgreSQL)                               │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────┐          ┌─────────────────────┐          ┌─────────────────────┐
│       users         │          │  personal_access_   │          │    role_has_        │
├─────────────────────┤          │      tokens         │          │    permissions      │
│ PK id        UUID   │◄────┐    ├─────────────────────┤          ├─────────────────────┤
│    name      TEXT   │     │    │ PK id       BIGINT  │          │ PK role_id    UUID  │
│    email     TEXT UQ│     └───<│ FK tokenable_id UUID│     ┌────│ PK permission_id UUID│
│    password  TEXT   │          │    name       TEXT  │     │    └────────┬────────────┘
│    avatar    TEXT   │          │    token      TEXT  │     │             │
│    role      ENUM   │          │    abilities  JSONB │     │             │
│    settings  JSONB  │          │    last_used  TS    │     │             │
│    created   TS     │          │    expires_at TS    │     │             │
│    updated   TS     │          └─────────────────────┘     │             │
└─────────┬───────────┘                                     │             │
          │                                                 │             │
          │ 1                    ┌─────────────────────┐    │    ┌────────▼────────────┐
          │                      │      roles          │    │    │    permissions      │
          │                      ├─────────────────────┤    │    ├─────────────────────┤
          │                      │ PK id        UUID   │    │    │ PK id        UUID   │
          │                      │    name       TEXT UQ│    │    │    name       TEXT  │
          │                      │    guard      TEXT   │    │    │    guard      TEXT  │
          │                      │    created    TS     │    │    │    created    TS    │
          │                      └──────────┬──────────┘    │    └────────────────────┘
          │                               │                 │
          │                               │ N:M             │
          └───────────────────────────────┼─────────────────┘
                                          │
                                          │
┌─────────────────────┐          ┌────────▼────────────┐          ┌─────────────────────┐
│   project_skills   │          │      projects       │          │  project_media      │
├─────────────────────┤          ├─────────────────────┤          ├─────────────────────┤
│ PK project_id UUID │◄────┐    │ PK id        UUID   │────┐    │ PK id        BIGINT │
│ PK skill_id   UUID │     └───<│    title      TEXT   │    └───<│ FK project_id UUID  │
│    proficiency INT  │         │    slug       TEXT UQ│         │    type       ENUM  │
└─────────────────────┘         │    excerpt    TEXT   │         │    url        TEXT  │
                                │    content    TEXT   │         │    caption    TEXT  │
┌─────────────────────┐         │    status     ENUM   │         │    order      INT   │
│project_categories   │         │    featured   BOOL   │         │    dimensions JSONB │
├─────────────────────┤         │    published_at TS   │         │    created_at  TS   │
│ PK id        UUID   │◄────┐   │    order        INT  │         └─────────────────────┘
│    name       TEXT UQ│     └──<│ FK category_id UUID │
│    slug       TEXT UQ│         │    view_count  INT   │
│    created    TS     │         │    created     TS    │
└─────────────────────┘         │    updated     TS    │
                                └──────────┬──────────┘
                                           │
┌─────────────────────┐                    │ 1
│  project_tags      │                    │
├─────────────────────┤                    │
│ PK project_id UUID │◄────┐               │
│    tag         TEXT  │     │               │
└─────────────────────┘     │               │
                            │               │
                            │ N             │
                     ┌──────▼──────┐        │
                     │    tags     │        │
                     ├─────────────┤        │
                     │ PK id UUID  │        │
                     │    name TEXTUQ│       │
                     └─────────────┘        │
                                            │
┌─────────────────────┐                    │
│  blog_categories    │                    │
├─────────────────────┤                    │
│ PK id        UUID   │◄────┐              │
│    name       TEXT   │     │              │
│    slug       TEXT UQ│     │              │
│    color      TEXT   │     │              │
└─────────────────────┘     │              │
                            │              │
                            │              │
┌─────────────────────┐     │    ┌─────────▼──────────┐         ┌─────────────────────┐
│   post_tags         │     │    │    blog_posts      │         │   testimonials      │
├─────────────────────┤     │    ├────────────────────┤         ├─────────────────────┤
│ PK post_id   UUID   │     └───<│ PK id        UUID  │     ┌───│ PK id        UUID   │
│    tag       TEXT   │          │    title      TEXT  │     │   │    name       TEXT  │
└─────────────────────┘          │    slug       TEXTUQ│     │   │    role       TEXT  │
                                 │    excerpt    TEXT  │     │   │    content    TEXT  │
┌─────────────────────┐          │    content    TEXT  │     │   │    avatar     TEXT  │
│   contact_messages  │          │    status     ENUM  │     │   │    rating     INT   │
├─────────────────────┤          │    published_at TS  │     │   │    project_id UUID  │
│ PK id        UUID   │          │    read_time  INT   │     │   │    created_at TS   │
│    name       TEXT  │     ┌───>│ FK category_id UUID │     │   └────────────────────┘
│    email      TEXT  │     │    │    view_count  INT   │     │
│    subject    TEXT  │     │    │    created     TS    │     │
│    message    TEXT  │     │    │    updated     TS    │     │
│    status     ENUM  │     │    └──────────┬──────────┘     │
│    replied_by UUID   │     │               │               │
│    replied_at TS     │     │               │ N:M           │
│    created    TS     │     │               │               │
└─────────────────────┘     │    ┌──────────▼──────────┐     │
                            │    │   post_categories   │     │
┌─────────────────────┐     │    ├─────────────────────┤     │
│   site_settings     │     │    │ PK post_id   UUID   │     │
├─────────────────────┤     └───<│ PK category_id UUID │     │
│ PK id        UUID   │          └─────────────────────┘     │
│    key        TEXT UQ│                                     │
│    value      JSONB  │                                     │
│    group      TEXT   │          ┌─────────────────────┐    │
│    created    TS     │          │ ai_embeddings       │    │
└─────────────────────┘          ├─────────────────────┤    │
                                 │ PK id        UUID   │    │
┌─────────────────────┐          │ FK entity_id  UUID  │    │
│  seo_metadata       │          │    entity_type ENUM │    │
├─────────────────────┤          │    embedding   vector│   │
│ PK id        UUID   │          │    chunk_index INT  │    │
│ FK entity_id  UUID  │          │    content     TEXT │    │
│    entity_type ENUM │          │    created     TS   │    │
│    meta_title TEXT  │          └─────────────────────┘    │
│    meta_desc  TEXT  │                                     │
│    og_image   TEXT  │                                     │
│    canonical  TEXT  │                                     │
│    schema     JSONB │                                     │
└─────────────────────┘                                     │
                                                            │
┌─────────────────────┐                                     │
│  analytics_events   │                                     │
├─────────────────────┤                                     │
│ PK id        BIGINT │                                     │
│    session_id  UUID │                                     │
│    user_id     UUID │                                     │
│    event_type  ENUM │                                     │
│    page_path   TEXT │                                     │
│    properties  JSONB│                                     │
│    ip_hash     TEXT │                                     │
│    user_agent  TEXT │                                     │
│    geo_country TEXT │                                     │
│    geo_city    TEXT │                                     │
│    referrer    TEXT │                                     │
│    created_at  TS   │                                     │
│                     │          ┌─────────────────────┐    │
│ Index:              │          │  analytics_daily    │    │
│  (created_at DESC)  │          ├─────────────────────┤    │
│  (page_path)        │          │ PK date        DATE │    │
│  (event_type)       │          │ PK page_path   TEXT │    │
│ Partition: by month │          │    views       INT  │    │
└─────────────────────┘          │    visitors    INT  │    │
                                 │    avg_time    FLOAT│   │
                                 │    bounces     INT  │    │
                                 └─────────────────────┘
```

### Key Indexes

```sql
-- Full-text search on blog posts
CREATE INDEX blog_posts_search_idx ON blog_posts 
  USING GIN (to_tsvector('english', title || ' ' || excerpt));

-- Vector similarity (HNSW index for pgvector)
CREATE INDEX ai_embeddings_hnsw_idx ON ai_embeddings 
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- Partial index for published content only
CREATE INDEX projects_published_idx ON projects (slug, published_at) 
  WHERE status = 'published';

-- Composite index for project filtering
CREATE INDEX projects_filter_idx ON projects (category_id, featured, published_at DESC)
  WHERE status = 'published';

-- Analytics time-series optimization
CREATE INDEX analytics_events_time_idx ON analytics_events (created_at DESC, event_type);

-- Soft delete pattern (using status enum)
-- Projects: draft | published | archived
-- BlogPosts: draft | scheduled | published | archived
```

### Enum Types

```sql
CREATE TYPE project_status AS ENUM ('draft', 'published', 'archived');
CREATE TYPE post_status AS ENUM ('draft', 'scheduled', 'published', 'archived');
CREATE TYPE contact_status AS ENUM ('new', 'read', 'replied', 'archived');
CREATE TYPE event_type AS ENUM ('page_view', 'click', 'scroll', 'chat_message', 'download');
CREATE TYPE media_type AS ENUM ('image', 'video', 'gif', 'pdf');
CREATE TYPE user_role AS ENUM ('admin', 'editor', 'viewer');
```

---

## 6. Deployment Architecture

### 6.1 Infrastructure Topology

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              DEPLOYMENT TOPOLOGY                                     │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────────┐       │
│  │                            CloudFlare (Edge)                            │       │
│  │  - DNS Management                                                       │       │
│  │  - CDN (static assets, images)                                          │       │
│  │  - WAF (Web Application Firewall)                                       │       │
│  │  - DDoS Protection                                                      │       │
│  │  - Page Rules (cache static, bypass API)                                │       │
│  │  - SSL/TLS (Full Strict)                                                │       │
│  └──────────────────────────┬──────────────────────────────────────────────┘       │
│                             │                                                       │
│              ┌──────────────┴──────────────┐                                       │
│              │                             │                                       │
│    ┌─────────▼─────────┐       ┌──────────▼──────────┐                            │
│    │  Next.js Frontend │       │  Laravel Backend    │                            │
│    │  (Vercel / Self-  │       │  (Docker + Octane)  │                            │
│    │   hosted Docker)  │       │                     │                            │
│    ├───────────────────┤       ├─────────────────────┤                            │
│    │ • App Router SSR  │       │ • Laravel Octane    │                            │
│    │ • Edge functions  │       │   (Swoole runtime)  │                            │
│    │ • ISR caching     │       │ • Filament Admin    │                            │
│    │ • Static export   │       │ • Reverb WS Server  │                            │
│    │                   │       │ • Queue Workers (3) │                            │
│    │ Instances: 2+     │       │                     │                            │
│    │ Memory: 1GB ea    │       │ Instances: 2+       │                            │
│    │ CPU: 1 vCPU ea    │       │ Memory: 2GB ea      │                            │
│    └─────────┬─────────┘       └──────────┬──────────┘                            │
│              │                             │                                       │
│              │  Internal API calls         │                                       │
│              │  (VPC private network)      │                                       │
│              │                             │                                       │
│              └──────────────┬──────────────┘                                       │
│                             │                                                       │
│              ┌──────────────▼──────────────┐                                       │
│              │     Managed PostgreSQL 16   │                                       │
│              │  (DigitalOcean / Supabase)  │                                       │
│              ├─────────────────────────────┤                                       │
│              │ • Primary + Read Replica    │                                       │
│              │ • pgvector extension        │                                       │
│              │ • Automated backups (daily) │                                       │
│              │ • Point-in-time recovery    │                                       │
│              │ • Connection pooling (PgBouncer)                                    │
│              └──────────────┬──────────────┘                                       │
│                             │                                                       │
│              ┌──────────────▼──────────────┐                                       │
│              │     Managed Redis 7         │                                       │
│              │  (Upstash / DigitalOcean)   │                                       │
│              ├─────────────────────────────┤                                       │
│              │ • Database 0: Cache         │                                       │
│              │ • Database 1: Queue         │                                       │
│              │ • Database 2: Session       │                                       │
│              │ • Database 3: Reverb Pub/Sub│                                       │
│              │ • TLS enabled               │                                       │
│              └─────────────────────────────┘                                       │
│                                                                                     │
│              ┌─────────────────────────────┐                                       │
│              │     Object Storage (S3)     │                                       │
│              ├─────────────────────────────┤                                       │
│              │ • media-projects/           │                                       │
│              │ • media-blog/               │                                       │
│              │ • media-general/            │                                       │
│              │ • backups/ (encrypted)      │                                       │
│              └─────────────────────────────┘                                       │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 Docker Compose (Development)

```yaml
version: "3.9"

services:
  # Next.js Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - BACKEND_URL=http://backend:8081
    volumes:
      - ./frontend:/app
      - /app/node_modules
    depends_on:
      - backend

  # Laravel Backend
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8081:8081"
    environment:
      - APP_ENV=local
      - DB_HOST=postgres
      - DB_PORT=5432
      - DB_DATABASE=portfolio
      - DB_USERNAME=postgres
      - DB_PASSWORD=secret
      - REDIS_HOST=redis
      - OCTANE_SERVER=swoole
    volumes:
      - ./backend:/app
      - /app/vendor
    depends_on:
      - postgres
      - redis

  # Queue Workers
  queue-worker:
    build:
      context: ./backend
      dockerfile: Dockerfile
    command: php artisan queue:work --sleep=3 --tries=3 --max-time=3600
    environment:
      - APP_ENV=local
      - DB_HOST=postgres
      - REDIS_HOST=redis
    volumes:
      - ./backend:/app
    depends_on:
      - postgres
      - redis

  # WebSocket Server
  reverb:
    build:
      context: ./backend
      dockerfile: Dockerfile
    command: php artisan reverb:start --host=0.0.0.0 --port=8082
    ports:
      - "8082:8082"
    environment:
      - APP_ENV=local
      - REDIS_HOST=redis
    depends_on:
      - redis

  # PostgreSQL
  postgres:
    image: pgvector/pgvector:pg16
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=portfolio
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=secret
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/docker/init.sql:/docker-entrypoint-initdb.d/init.sql

  # Redis
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

  # MinIO (S3-compatible for local dev)
  minio:
    image: minio/minio
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      - MINIO_ROOT_USER=minioadmin
      - MINIO_ROOT_PASSWORD=minioadmin
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"

volumes:
  postgres_data:
  redis_data:
  minio_data:
```

### 6.3 Production Deployment Strategy

**Option A: Vercel + Docker (Recommended for MVP)**

```
Frontend  →  Vercel (auto-deploy from Git)
Backend   →  Docker containers on DigitalOcean App Platform / Railway
Database  →  Managed PostgreSQL (Supabase / DigitalOcean)
Redis     →  Upstash Redis (serverless)
Storage   →  DigitalOcean Spaces / AWS S3
```

**Option B: Full Self-Hosted (Production Scale)**

```
Infrastructure: AWS / DigitalOcean
- ECS / Kubernetes for container orchestration
- RDS PostgreSQL with read replica
- ElastiCache Redis
- S3 + CloudFront
- Application Load Balancer
- Auto-scaling groups

CI/CD: GitHub Actions
- Build → Test → Push to ECR → Deploy
- Blue/green deployments
- Automatic rollback on health check failure
```

### 6.4 Environment Variables

**Frontend (`.env.local`):**

```env
NEXT_PUBLIC_APP_URL=https://developer-portfolio.com
NEXT_PUBLIC_API_URL=https://api.developer-portfolio.com
BACKEND_URL=http://backend:8081
NEXT_PUBLIC_REVERB_HOST=rever.developer-portfolio.com
NEXT_PUBLIC_REVERB_PORT=443
NEXT_PUBLIC_REVERB_APP_KEY=xxx
ANALYTICS_SCRIPT_URL=https://cloud.umami.is/script.js
ANALYTICS_WEBSITE_ID=xxx
```

**Backend (`.env`):**

```env
APP_NAME="Developer Portfolio"
APP_ENV=production
APP_KEY=base64:xxx
APP_DEBUG=false
APP_URL=https://api.developer-portfolio.com

OCTANE_SERVER=swoole
OCTANE_MAX_REQUESTS=500

DB_CONNECTION=pgsql
DB_HOST=postgres.internal
DB_PORT=5432
DB_DATABASE=portfolio
DB_USERNAME=portfolio_user
DB_PASSWORD=xxx
DB_SSL_MODE=require

REDIS_HOST=redis.internal
REDIS_PORT=6379
REDIS_PASSWORD=xxx
REDIS_DB=0
REDIS_QUEUE_DB=1

FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=portfolio-media
AWS_URL=https://cdn.developer-portfolio.com

OPENAI_API_KEY=sk-xxx
OPENAI_MODEL=gpt-4o-mini
OPENAI_EMBEDDING_MODEL=text-embedding-3-small

REVERB_APP_ID=xxx
REVERB_APP_KEY=xxx
REVERB_APP_SECRET=xxx

QUEUE_CONNECTION=redis
SESSION_DRIVER=redis
CACHE_STORE=redis

MAIL_MAILER=resend
MAIL_FROM_ADDRESS=noreply@developer-portfolio.com
RESEND_API_KEY=re_xxx

SANCTUM_STATEFUL_DOMAINS=developer-portfolio.com
SESSION_DOMAIN=.developer-portfolio.com
SESSION_SECURE_COOKIE=true
```

---

## 7. Security Architecture

### 7.1 Security Layers

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              SECURITY ARCHITECTURE                                   │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  Layer 1: Edge Security (CloudFlare)                                                │
│  ├── WAF Rules (OWASP Top 10, SQLi, XSS, RCE protection)                           │
│  ├── Rate Limiting (API: 100 req/min, Contact: 5/hr, Chat: 20/hr)                  │
│  ├── Bot Management (block known bad bots, challenge suspicious ones)              │
│  ├── DDoS Protection (always-on, automatic)                                        │
│  ├── TLS 1.3 (Full Strict mode)                                                    │
│  └── IP Reputation (block known malicious IPs)                                     │
│                                                                                     │
│  Layer 2: Application Security (Next.js + Laravel)                                  │
│  ├── CSP Headers (strict-dynamic, nonce-based inline scripts)                      │
│  ├── X-Content-Type-Options: nosniff                                               │
│  ├── X-Frame-Options: DENY                                                         │
│  ├── Referrer-Policy: strict-origin-when-cross-origin                              │
│  ├── Permissions-Policy (camera, microphone, geolocation denied)                   │
│  ├── HSTS (max-age=31536000; includeSubDomains; preload)                           │
│  ├── CSRF Protection (Laravel Sanctum for SPA, double-submit cookie)               │
│  ├── Input Validation (Laravel Form Requests, Zod on frontend)                     │
│  ├── Output Encoding (Blade escaping, React auto-escaping)                         │
│  └── File Upload Validation (MIME type, size, dimension, virus scan)               │
│                                                                                     │
│  Layer 3: Authentication & Authorization                                            │
│  ├── SPA Auth: HttpOnly, Secure, SameSite=Strict cookies                           │
│  ├── API Auth: Bearer tokens (Sanctum)                                             │
│  ├── Token Expiry: Access 1hr, Refresh 7d                                          │
│  ├── Role-Based Access Control (RBAC)                                              │
│  │   ├── admin: full access                                                        │
│  │   ├── editor: content management only                                           │
│  │   └── viewer: read-only                                                         │
│  ├── 2FA for admin accounts (TOTP)                                                │
│  ├── Password Policy: min 12 chars, complexity check                               │
│  └── Brute Force Protection (lockout after 5 failed attempts, 15 min)              │
│                                                                                     │
│  Layer 4: Data Security                                                             │
│  ├── Encryption at Rest: PostgreSQL TDE, S3 SSE-S3                                 │
│  ├── Encryption in Transit: TLS everywhere                                         │
│  ├── PII Hashing: IP addresses hashed (SHA-256 + salt)                            │
│  ├── API Keys: Encrypted in DB (Laravel encrypted casts)                           │
│  ├── Secrets Management: Environment variables, not hardcoded                       │
│  ├── Database Credentials: IAM auth or secret manager                              │
│  └── Backup Encryption: AES-256 with separate key management                      │
│                                                                                     │
│  Layer 5: AI-Specific Security                                                      │
│  ├── Prompt Injection Prevention (input sanitization, output validation)           │
│  ├── Token Usage Limits (per session, per day)                                     │
│  ├── Content Filtering (OpenAI moderation endpoint)                                │
│  ├── Embedding Data: No PII in vector store                                        │
│  └── AI Output Validation (schema validation before storing)                       │
│                                                                                     │
│  Layer 6: Infrastructure Security                                                   │
│  ├── VPC with private subnets for DB/Redis                                         │
│  ├── Security Groups (least privilege access)                                      │
│  ├── No public database access                                                     │
│  ├── Container Security: non-root user, read-only filesystem                       │
│  ├── Dependency Scanning: Dependabot, Snyk                                         │
│  └── Automated Security Updates (OS, runtime)                                      │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 7.2 Security Headers (Next.js Middleware)

```typescript
// frontend/src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'nonce-${nonce}' 'strict-dynamic' 
      https://cloud.umami.is;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://cdn.developer-portfolio.com;
    font-src 'self';
    connect-src 'self' https://api.developer-portfolio.com 
      wss://reverb.developer-portfolio.com;
    media-src 'self' https://cdn.developer-portfolio.com;
    frame-src 'none';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `
    .replace(/\s{2,}/g, " ")
    .trim();

  const response = NextResponse.next();
  response.headers.set("x-nonce", nonce);
  response.headers.set(
    "Content-Security-Policy",
    cspHeader.replace(/\n/g, ""),
  );
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "0");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=31536000; includeSubDomains; preload",
  );

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
```

### 7.3 Rate Limiting Configuration

```php
// backend/app/Providers/AppServiceProvider.php
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\RateLimiter;

RateLimiter::for('api', function ($request) {
    return Limit::perMinute(100)->by($request->ip());
});

RateLimiter::for('contact', function ($request) {
    return Limit::perHour(5)->by($request->ip());
});

RateLimiter::for('ai-chat', function ($request) {
    $sessionId = $request->session_id ?? $request->ip();
    return Limit::perHour(20)->by($sessionId);
});

RateLimiter::for('admin', function ($request) {
    return Limit::perMinute(30)->by($request->user()?->id ?: $request->ip());
});
```

---

## 8. Data Flow for Key Features

### 8.1 Page View → ISR Cache Invalidation Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   User visits │     │  Next.js     │     │  Laravel     │     │  PostgreSQL  │
│   /blog/my-post│    │  Server      │     │  Backend     │     │              │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │                    │
       │  GET /blog/my-post │                    │                    │
       │───────────────────►│                    │                    │
       │                    │                    │                    │
       │  Check ISR Cache   │                    │                    │
       │  ┌──────────────┐ │                    │                    │
       │  │  Cache HIT?  │ │                    │                    │
       │  └──────┬───────┘ │                    │                    │
       │         │         │                    │                    │
       │    YES  │  NO     │                    │                    │
       │  ┌──────▼──────┐ │                    │                    │
       │  │ Return from │ │  GET /api/v1/blog/ │                    │
       │  │ ISR cache   │ │  {slug}            │                    │
       │  │ (TTFB <50ms)│ │───────────────────►│                    │
       │  └─────────────┘ │                    │                    │
       │                    │     Query DB     │                    │
       │                    │──────────────────────────────────────►│
       │                    │     Return data  │                    │
       │                    │◄──────────────────────────────────────│
       │                    │                    │                    │
       │                    │  Transform via     │                    │
       │                    │  API Resource      │                    │
       │                    │  Set cache tags:   │                    │
       │                    │  blog, post:{id}   │                    │
       │                    │  Increment view    │                    │
       │                    │  count (async job) │                    │
       │                    │                    │                    │
       │  HTML + JSON        │                    │                    │
       │  ◄─────────────────│                    │                    │
       │                    │                    │                    │
       │  Render page       │                    │                    │
       │  Cache for 5 min   │                    │                    │
       │  Return to user    │                    │                    │
       │◄───────────────────│                    │                    │
       │                    │                    │                    │
```

### 8.2 Admin Content Update → ISR Invalidation Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Admin       │     │  Filament    │     │  Laravel     │     │  Next.js     │
│   edits blog  │     │  Admin Panel │     │  Backend     │     │  ISR Cache   │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │                    │
       │  Edit form + save  │                    │                    │
       │───────────────────►│                    │                    │
       │                    │                    │                    │
       │                    │  Validate + Save   │                    │
       │                    │  to PostgreSQL     │                    │
       │                    │────────────────────┐│                    │
       │                    │                    │                    │
       │                    │  Dispatch          │                    │
       │                    │  RefreshISRJob     │                    │
       │                    │────────────────────┐│                    │
       │                    │                    │                    │
       │                    │  Activity log      │                    │
       │                    │  (audit trail)     │                    │
       │                    │                    │                    │
       │  Success response  │                    │                    │
       │◄───────────────────│                    │                    │
       │                    │                    │                    │
       │                    │     Queue Worker   │                    │
       │                    │     processes job  │                    │
       │                    │                    │                    │
       │                    │  POST /api/v1/     │  Revalidate ISR    │
       │                    │  admin/content/    │  cache             │
       │                    │  blog/{id}/publish │  revalidateTag()   │
       │                    │───────────────────►│───────────────────►│
       │                    │                    │                    │
       │                    │                    │  Cache invalidated │
       │                    │                    │  Next request →    │
       │                    │                    │  fresh SSR         │
       │                    │                    │                    │
```

### 8.3 AI Chat Flow (Streaming SSE)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   User        │     │  Next.js     │     │  Laravel     │     │  OpenAI API  │
│   types msg   │     │  API Route   │     │  AIService   │     │              │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │                    │
       │  POST /api-chat    │                    │                    │
       │  { message }       │                    │                    │
       │───────────────────►│                    │                    │
       │                    │                    │                    │
       │                    │  Rate limit check  │                    │
       │                    │  (Redis counter)   │                    │
       │                    │                    │                    │
       │                    │  POST /api/v1/     │                    │
       │                    │  ai/chat (SSE)     │                    │
       │                    │───────────────────►│                    │
       │                    │                    │                    │
       │                    │                    │  Build prompt with │
       │                    │                    │  system context    │
       │                    │                    │  (portfolio data)  │
       │                    │                    │                    │
       │                    │                    │  Retrieve relevant │
       │                    │                    │  context from      │
       │                    │                    │  vector DB         │
       │                    │                    │───────────────────►│
       │                    │                    │  Stream response   │
       │                    │                    │  (text/event-stream)│
       │                    │                    │◄───────────────────│
       │                    │                    │                    │
       │                    │  SSE Stream        │                    │
       │                    │  ◄─────────────────│                    │
       │  SSE Stream        │                    │                    │
       │  ◄─────────────────│                    │                    │
       │                    │                    │                    │
       │  Render chunks    │                    │                    │
       │  in real-time     │                    │                    │
       │  (typewriter      │                    │                    │
       │   effect)         │                    │                    │
       │                    │                    │                    │
       │                    │  After stream ends │                    │
       │                    │  Store conversation│                    │
       │                    │  in Redis (TTL 1h) │                    │
       │                    │  Log to analytics  │                    │
       │                    │                    │                    │
```

### 8.4 Real-Time Analytics Flow

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   User        │     │  Next.js     │     │  Laravel     │     │  Admin       │
│   views page  │     │  Client      │     │  Analytics   │     │  Dashboard   │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │                    │
       │  Page loads        │                    │                    │
       │                    │                    │                    │
       │  Fire beacon       │                    │                    │
       │  POST /api/v1/     │                    │                    │
       │  analytics/event   │                    │                    │
       │  { type: 'view',   │                    │                    │
       │    path, referrer }│                    │                    │
       │───────────────────►│                    │                    │
       │                    │                    │                    │
       │                    │  Push to Redis     │                    │
       │                    │  (pub/sub channel) │                    │
       │                    │───────────────────►│                    │
       │                    │                    │                    │
       │                    │  Queue job for     │                    │
       │                    │  async DB insert   │                    │
       │                    │  (don't block user) │                    │
       │                    │───────────────────►│                    │
       │                    │                    │                    │
       │                    │                    │  Redis pub/sub     │
       │                    │                    │  broadcasts to    │
       │                    │                    │  WebSocket channel│
       │                    │                    │───────────────────►│
       │                    │                    │                    │
       │                    │                    │                    │  Update live
       │                    │                    │                    │  counter & chart
       │                    │                    │                    │◄───────────────────│
       │                    │                    │                    │  (WebSocket msg)  │
       │                    │                    │                    │                    │
       │  204 No Content    │                    │                    │
       │◄───────────────────│                    │                    │
       │                    │                    │                    │
```

### 8.5 Project Recommendation (AI-Powered)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   User views  │     │  Next.js     │     │  Vector      │     │  PostgreSQL  │
│   project A   │     │  Server      │     │  Service     │     │  (pgvector)  │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │                    │                    │                    │
       │  GET /projects/a   │                    │                    │
       │───────────────────►│                    │                    │
       │                    │                    │                    │
       │                    │  Check Redis cache │                    │
       │                    │  recs:project:a    │                    │
       │                    │  ┌──────────────┐ │                    │
       │                    │  │  Cache HIT?  │ │                    │
       │                    │  └──────┬───────┘ │                    │
       │                    │         │         │                    │
       │                    │    YES  │  NO     │                    │
       │                    │  ┌──────▼──────┐ │                    │
       │                    │  │ Return from │ │  GET embedding for │
       │                    │  │ cache       │ │  project A         │
       │                    │  │             │ │───────────────────►│
       │                    │  └─────────────┘ │◄───────────────────│
       │                    │                  │                    │
       │                    │                  │  Cosine similarity │
       │                    │                  │  SELECT * ORDER BY │
       │                    │                  │  embedding <=> $1  │
       │                    │                  │  LIMIT 5           │
       │                    │                  │───────────────────►│
       │                    │                  │◄───────────────────│
       │                    │                  │  Filter: published │
       │                    │                  │  Exclude: current  │
       │                    │                  │                    │
       │                    │                  │  Store in Redis    │
       │                    │                  │  (TTL: 1 hour)     │
       │                    │                  │                    │
       │                    │  Related projects│                    │
       │                    │  ◄────────────── │                    │
       │                    │                    │                    │
       │  Page with related │                    │                    │
       │  projects ◄────────│                    │                    │
       │                    │                    │                    │
```

---

## 9. Performance Strategy

### 9.1 Target: Lighthouse 95+, TTFB < 200ms, LCP < 1.5s

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                              PERFORMANCE STRATEGY                                    │
├─────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                     │
│  METRIC 1: Time to First Byte (TTFB) < 200ms                                       │
│  ─────────────────────────────────────────────                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │  Strategy                        │ Impact     │ Implementation              │   │
│  ├──────────────────────────────────┼────────────┼─────────────────────────────┤   │
│  │  Laravel Octane (Swoole)        │ TTFB <50ms │ Persistent PHP processes,  │   │
│  │                                  │            │ no bootstrap per request   │   │
│  │  Redis cache for API responses  │ -80% DB    │ Cache all GET endpoints    │   │
│  │                                  │  queries   │ with tag-based invalidation│   │
│  │  PostgreSQL connection pooling  │ -90% conn  │ PgBouncer (transaction     │   │
│  │                                  │  overhead  │ mode, 20 pool size)        │   │
│  │  CDN edge caching               │ TTFB <100ms│ CloudFlare Cache-Everything│   │
│  │                                  │  for static│ for static, 5min for HTML  │   │
│  │  ISR for content pages          │ Cached SSR │ Revalidate every 5min or   │   │
│  │                                  │            │ on-demand tag invalidation │   │
│  │  Preconnect to critical origins │ -50ms DNS  │ <link rel="preconnect">    │   │
│  │                                  │            │ for API, CDN, fonts        │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
│  METRIC 2: Largest Contentful Paint (LCP) < 1.5s                                   │
│  ─────────────────────────────────────────────                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │  Strategy                        │ Impact     │ Implementation              │   │
│  ├──────────────────────────────────┼────────────┼─────────────────────────────┤   │
│  │  next/image optimization        │ -60% img   │ WebP/AVIF, responsive sizes, │   │
│  │                                  │  size      │ blurhash placeholders        │   │
│  │  Priority hints                 │ -200ms     │ fetchpriority="high" on LCP  │   │
│  │                                  │            │ images                       │   │
│  │  Critical CSS inlining          │ -100ms     │ next/font with CSS inlining  │   │
│  │                                  │            │ (no FOIT/FOUT)               │   │
│  │  Resource hints                 │ -150ms     │ preload key fonts,           │   │
│  │                                  │            │ preconnect to CDN            │   │
│  │  Image CDN                      │ -40% size  │ CloudFlare Polish / Vercel   │   │
│  │                                  │            │ Image Optimization           │   │
│  │  Font display swap              │ No blocking│ font-display: optional       │   │
│  │                                  │            │ for secondary fonts          │   │
│  │  Lazy load below-fold images    │ -30% init  │ loading="lazy" +             │   │
│  │                                  │  payload   │ IntersectionObserver         │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
│  METRIC 3: Lighthouse 95+                                                          │
│  ─────────────────────────                                                         │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │  Category       │ Target │ Strategy                                          │   │
│  ├─────────────────┼────────┼───────────────────────────────────────────────────┤   │
│  │  Performance    │ 95+    │ All above strategies + Code splitting, tree      │   │
│  │                 │        │ shaking, minimal JS, defer non-critical scripts   │   │
│  │  Accessibility  │ 100    │ Semantic HTML, ARIA labels, keyboard nav,        │   │
│  │                 │        │ color contrast >= 4.5:1, skip links               │   │
│  │  Best Practices │ 100    │ No console errors, HTTPS, no deprecated APIs,    │   │
│  │                 │        │ no vulnerable libraries                           │   │
│  │  SEO            │ 100    │ Meta tags, structured data (JSON-LD), sitemap,   │   │
│  │                 │        │ robots.txt, canonical URLs, OG tags               │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
│  BUDGET LIMITS                                                                      │
│  ┌─────────────────────────────────────────────────────────────────────────────┐   │
│  │  Resource          │ Budget   │ Monitoring                                  │   │
│  ├────────────────────┼──────────┼─────────────────────────────────────────────┤   │
│  │  Total JS          │ < 200KB  │ @next/bundle-analyzer, Webpack Bundle       │   │
│  │  (initial load)    │          │ Analyzer, CI check on PR                     │   │
│  │  Total CSS         │ < 50KB   │ PurgeCSS (Tailwind), critical CSS only      │   │
│  │  Fonts             │ < 100KB  │ next/font (subset, variable fonts)          │   │
│  │  Images (above     │ < 150KB  │ next/image, AVIF/WebP, max 1200px width     │   │
│  │  fold)             │          │ for hero                                     │   │
│  │  HTML document     │ < 50KB   │ Server components, minimal inline data      │   │
│  └─────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                     │
└─────────────────────────────────────────────────────────────────────────────────────┘
```

### 9.2 Caching Strategy Matrix

| Layer | What | TTL | Invalidation | Storage |
|---|---|---|---|---|
| **CDN** | Static assets | 1 year | Cache-bust with hash | CloudFlare |
| **CDN** | ISR HTML | 5 min | Tag-based (revalidateTag) | CloudFlare |
| **CDN** | Images | 1 year | On upload (new URL) | CloudFlare |
| **Next.js ISR** | Blog posts | 5 min | On publish (blog tag) | Node memory |
| **Next.js ISR** | Projects | 5 min | On publish (project tag) | Node memory |
| **Next.js ISR** | About page | Build-time | On deployment | Node memory |
| **Redis (API)** | GET endpoints | 5 min | On content change (tag) | Redis DB 0 |
| **Redis (API)** | Rate limit counters | 1 hr | Auto-expire | Redis DB 0 |
| **Redis (API)** | Session data | 7 days | On logout | Redis DB 2 |
| **Redis (API)** | AI recommendations | 1 hr | On content change | Redis DB 0 |
| **DB Query Cache** | Complex queries | 15 min | On data change | Redis DB 0 |
| **Browser** | API responses | 30s | Cache-Control header | Browser |

---

## 10. Scalability Plan

### 10.1 Current State (MVP: < 10K monthly visitors)

```
Frontend:  1x Vercel deployment (auto-scales)
Backend:   1x Docker container (1 vCPU, 1GB RAM)
Database:  Managed PostgreSQL (1 vCPU, 1GB RAM)
Redis:     Upstash Redis (free tier, 256MB)
Storage:   S3 / DO Spaces (5GB)
```

### 10.2 Growth Stage (10K - 100K monthly visitors)

```
Frontend:  Vercel Pro (auto-scales, edge network)
Backend:   2x Docker containers (2 vCPU, 2GB RAM) + Load Balancer
Database:  PostgreSQL (2 vCPU, 4GB RAM) + Read Replica
Redis:     Upstash Redis (standard, 1GB)
Storage:   S3 (50GB) + CloudFront
Queue:     2x Queue Workers
WebSocket: 1x Reverb instance
```

### 10.3 Scale Stage (100K - 1M monthly visitors)

```
Frontend:  Vercel Enterprise / Self-hosted (Kubernetes)
Backend:   4-6x Docker containers (4 vCPU, 4GB RAM) + ALB
Database:  PostgreSQL (4 vCPU, 8GB RAM) + 2x Read Replicas
            PgBouncer connection pooling
Redis:     Redis Cluster (3 nodes, 4GB each)
Storage:   S3 (500GB) + CloudFront
Queue:     4x Queue Workers (dedicated queues: embeddings, media, emails, analytics)
WebSocket: 2x Reverb instances + Redis pub/sub
```

### 10.4 Scaling Triggers

| Metric | Current | Scale When | Action |
|---|---|---|---|
| Monthly visitors | < 10K | > 10K | Add backend replica + read replica |
| API response time (p95) | < 200ms | > 300ms | Add backend replicas, increase cache TTL |
| DB CPU | < 30% | > 60% | Upgrade instance, add read replica |
| Redis memory | < 50% | > 70% | Upgrade tier, implement eviction policy |
| Queue lag | < 10s | > 30s | Add queue workers |
| WebSocket connections | < 100 | > 500 | Add Reverb instance |

### 10.5 Horizontal Scaling Architecture

```
                    ┌─────────────────────┐
                    │   CloudFlare CDN    │
                    │   (Global Edge)     │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Load Balancer      │
                    │  (ALB / Nginx)      │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
     ┌────────▼──────┐ ┌──────▼───────┐ ┌──────▼───────┐
     │  Backend #1   │ │  Backend #2  │ │  Backend #N  │
     │  (Octane)     │ │  (Octane)    │ │  (Octane)    │
     └────────┬──────┘ └──────┬───────┘ └──────┬───────┘
              │               │                 │
              └───────────────┼─────────────────┘
                              │
              ┌───────────────┼─────────────────┐
              │               │                 │
     ┌────────▼──────┐ ┌──────▼───────┐ ┌──────▼───────┐
     │  PostgreSQL   │ │    Redis     │ │  Reverb WS   │
     │  Primary      │ │  Cluster     │ │  Instances   │
     │  + Replicas   │ │              │ │              │
     └───────────────┘ └──────────────┘ └──────────────┘
```

---

## 11. Monitoring & Observability

### 11.1 Monitoring Stack

| Layer | Tool | Purpose |
|---|---|---|
| **Application Performance** | Sentry | Error tracking, performance monitoring, release tracking |
| **Uptime Monitoring** | UptimeRobot / Better Stack | External health checks every 1 min |
| **Real User Monitoring** | Vercel Analytics / Plausible | Core Web Vitals, page views, geo data |
| **Infrastructure** | Laravel Telescope (dev) / Prometheus (prod) | Request profiling, query analysis |
| **Logs** | Laravel Logs → Papertrail / Axiom | Centralized log aggregation |
| **Database** | pg_stat_statements | Slow query analysis |
| **CI/CD** | GitHub Actions | Automated testing, Lighthouse CI on PRs |

### 11.2 Key Alerts

| Alert | Condition | Action |
|---|---|---|
| API Error Rate | > 1% over 5 min | Page on-call, auto-rollback if deployment |
| TTFB (p95) | > 500ms | Scale backend, check DB |
| Queue Lag | > 60s | Add queue workers |
| Redis Memory | > 80% | Evict old data, scale Redis |
| DB Connections | > 80% of pool | Check connection leaks, increase pool |
| Disk Space | > 80% used | Clean logs, expand storage |
| SSL Expiry | < 14 days | Auto-renew check |
| Lighthouse Score | < 90 on PR | Block merge, fix issues |

### 11.3 Health Check Endpoint

```
GET /api/v1/health

Response 200:
{
  "status": "healthy",
  "timestamp": "2026-04-09T12:00:00Z",
  "version": "1.0.0",
  "checks": {
    "database": { "status": "up", "latency_ms": 2 },
    "redis": { "status": "up", "latency_ms": 1 },
    "storage": { "status": "up" },
    "openai": { "status": "up" }
  }
}
```

---

## 12. Technology Stack Summary

### 12.1 Complete Stack

| Category | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend Framework** | Next.js | 15.x | App Router, SSR/ISR, API routes |
| **Frontend Language** | TypeScript | 5.x | Type safety |
| **Frontend Styling** | Tailwind CSS | 4.x | Utility-first CSS |
| **Frontend Components** | shadcn/ui | latest | Accessible UI components |
| **Frontend State** | Zustand + SWR | latest | Client + server state |
| **Frontend Animation** | Framer Motion | 11.x | Micro-interactions |
| **Frontend Forms** | React Hook Form + Zod | latest | Validation |
| **Backend Framework** | Laravel | 11.x | API, Admin, WebSockets |
| **Backend Language** | PHP | 8.3 | Runtime |
| **Backend Performance** | Laravel Octane + Swoole | latest | Persistent processes |
| **Backend Admin** | Filament | 3.x | CMS / Admin dashboard |
| **Backend WebSockets** | Laravel Reverb | latest | Real-time communication |
| **Authentication** | Laravel Sanctum | latest | SPA auth + API tokens |
| **Authorization** | Spatie Permission | latest | RBAC |
| **Database** | PostgreSQL | 16.x | Primary datastore + vector |
| **Vector Extension** | pgvector | 0.7+ | Semantic search, AI |
| **Cache / Queue** | Redis | 7.x | Caching, queues, sessions |
| **Connection Pool** | PgBouncer | 1.x | DB connection pooling |
| **Object Storage** | S3 / MinIO | — | Media files |
| **CDN** | CloudFlare | — | Edge caching, WAF, DNS |
| **Email** | Resend | — | Transactional emails |
| **AI/LLM** | OpenAI GPT-4o-mini | — | Chat, content generation |
| **AI Embeddings** | text-embedding-3-small | — | Vector embeddings |
| **Media Processing** | Spatie Media Library | latest | Image optimization |
| **Activity Logging** | Spatie Activity Log | latest | Audit trail |
| **Settings** | Spatie Laravel Settings | latest | Site configuration |
| **SEO** | spatie/laravel-sitemap | latest | Sitemap generation |
| **Monitoring** | Sentry | — | Error + performance |
| **Analytics** | Plausible / Umami | — | Privacy-first analytics |
| **Testing (Frontend)** | Vitest + Playwright | latest | Unit + E2E |
| **Testing (Backend)** | Pest PHP | 3.x | Unit + feature tests |
| **Static Analysis** | PHPStan + Laravel Pint | — | Code quality |
| **CI/CD** | GitHub Actions | — | Automated pipeline |
| **Containerization** | Docker + Compose | — | Development |
| **Deployment** | Vercel + Docker | — | Production |
| **Logging** | Axiom / Papertrail | — | Centralized logs |

---

## Appendix A: File Structure

```
portfolio/
├── frontend/                          # Next.js Application
│   ├── src/
│   │   ├── app/                       # App Router
│   │   │   ├── (site)/               # Public routes
│   │   │   │   ├── layout.tsx
│   │   │   │   ├── page.tsx          # Home (ISR)
│   │   │   │   ├── about/page.tsx    # About (SSG)
│   │   │   │   ├── projects/
│   │   │   │   │   ├── page.tsx      # List (ISR)
│   │   │   │   │   └── [slug]/page.tsx  # Detail (ISR)
│   │   │   │   ├── blog/
│   │   │   │   │   ├── page.tsx      # List (ISR)
│   │   │   │   │   └── [slug]/page.tsx  # Detail (ISR)
│   │   │   │   └── contact/page.tsx  # Contact (SSR)
│   │   │   ├── api/                   # API routes (BFF)
│   │   │   │   └── chat/route.ts     # AI chat proxy
│   │   │   ├── admin/                 # Redirect to Laravel Filament
│   │   │   ├── layout.tsx
│   │   │   └── not-found.tsx
│   │   ├── components/
│   │   │   ├── ui/                    # shadcn components
│   │   │   ├── layout/                # Header, Footer, Shell
│   │   │   ├── project/               # ProjectCard, Gallery
│   │   │   ├── blog/                  # PostCard, TOC
│   │   │   └── chat/                  # Chat interface
│   │   ├── hooks/                     # Custom hooks
│   │   │   ├── useWebSocket.ts
│   │   │   ├── useAnalytics.ts
│   │   │   └── usePrefersReducedMotion.ts
│   │   ├── lib/
│   │   │   ├── api.ts                 # API client
│   │   │   ├── cache.ts               # Cache utilities
│   │   │   └── utils.ts
│   │   └── types/                     # TypeScript types
│   ├── public/
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                           # Laravel Application
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── Api/V1/
│   │   │   │   │   ├── ProjectController.php
│   │   │   │   │   ├── BlogController.php
│   │   │   │   │   ├── SkillController.php
│   │   │   │   │   ├── ContactController.php
│   │   │   │   │   ├── AIChatController.php
│   │   │   │   │   └── AnalyticsController.php
│   │   │   │   └── Admin/
│   │   │   ├── Middleware/
│   │   │   │   ├── EnsureJsonResponse.php
│   │   │   │   ├── RateLimitByIp.php
│   │   │   │   └── SetCacheHeaders.php
│   │   │   ├── Requests/
│   │   │   └── Resources/
│   │   ├── Services/
│   │   │   ├── ContentService.php
│   │   │   ├── AIService.php
│   │   │   ├── AnalyticsService.php
│   │   │   ├── MediaService.php
│   │   │   ├── VectorService.php
│   │   │   └── CacheService.php
│   │   ├── Jobs/
│   │   │   ├── GenerateEmbeddingsJob.php
│   │   │   ├── OptimizeMediaJob.php
│   │   │   ├── RefreshISRJob.php
│   │   │   ├── AggregateStatsJob.php
│   │   │   └── SendEmailJob.php
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   ├── Project.php
│   │   │   ├── BlogPost.php
│   │   │   ├── Skill.php
│   │   │   ├── Testimonial.php
│   │   │   └── ContactMessage.php
│   │   ├── Policies/
│   │   └── Events/
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeders/
│   │   └── factories/
│   ├── routes/
│   │   ├── api.php
│   │   ├── web.php
│   │   └── channels.php
│   ├── config/
│   ├── tests/
│   ├── docker/
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── phpunit.xml
│   └── composer.json
│
├── .github/
│   └── workflows/
│       ├── ci.yml                     # Lint + Test
│       ├── deploy-frontend.yml        # Vercel deploy
│       └── deploy-backend.yml         # Docker deploy
│
├── docker-compose.yml                 # Local development
├── Makefile                           # Dev commands
├── ARCHITECTURE.md                    # This document
└── README.md
```

---

## Appendix B: Migration Checklist

- [ ] Initialize repository with frontend/ and backend/ directories
- [ ] Set up Next.js 15 with App Router, TypeScript, Tailwind
- [ ] Set up Laravel 11 with Octane, Swoole
- [ ] Configure PostgreSQL with pgvector extension
- [ ] Configure Redis (cache, queue, session databases)
- [ ] Set up Filament admin panel with base resources
- [ ] Implement authentication (Sanctum, 2FA for admin)
- [ ] Create database migrations and seeders
- [ ] Build public API endpoints (projects, blog, skills)
- [ ] Implement ISR caching with tag-based invalidation
- [ ] Set up Laravel Reverb for WebSockets
- [ ] Build AI chat with OpenAI integration
- [ ] Implement vector embeddings for recommendations
- [ ] Create Filament admin resources and dashboards
- [ ] Set up media library with S3 + CDN
- [ ] Implement analytics tracking (client + server)
- [ ] Add rate limiting and security headers
- [ ] Write tests (Pest + Vitest + Playwright)
- [ ] Set up CI/CD pipeline (GitHub Actions)
- [ ] Configure production deployment
- [ ] Set up monitoring (Sentry, analytics, health checks)
- [ ] Performance audit (Lighthouse CI, bundle analysis)

---

*Document Version: 1.0.0 | Last Updated: 2026-04-09 | Author: Principal System Architect*
