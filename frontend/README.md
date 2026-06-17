# Retail Intelligence — Frontend

Enterprise-grade React application for the **Enterprise Retail Intelligence & Forecasting Platform**. This is the client-facing SaaS shell that powers executive dashboards, analytics modules, and engineering documentation.

---

## Project Overview

The frontend is a production-quality single-page application built for Fortune 500 retail operations. It provides a unified interface for retail intelligence, business analytics, ETL pipeline management, forecasting, and system architecture documentation.

**Current status:** **Phases 0–6 complete** — through enterprise data visualization (framework, interactive dashboards, Executive Visualization Studio). **Phase 7 current** — forecasting & predictive analytics.

---

## Sprint 1.3 — Enterprise Dashboard Polish & Release Readiness ✅

Final Phase 1 sprint. Presentation-ready executive dashboard with enterprise UX polish — no backend integration.

### Deliverables

- **Loading skeletons** — KPI, chart, table, timeline, alert, regional, and ranking placeholders
- **Empty states** — Phase-aware guidance for every dashboard widget
- **Error states** — Reusable presets: network, empty response, unauthorized, unavailable, retry
- **Placeholder actions** — Refresh, Export CSV/PDF, Schedule report, Share dashboard (toast notifications)
- **Filter toolbar** — Visual active-state styling, active count badge, reset filters
- **Accessibility** — Semantic headings, ARIA labels, keyboard focus rings, scrollable tables
- **Performance** — Lazy-loaded BI modules and chart section, memoized containers, stable mock imports
- **Responsive QA** — Card stacking, table horizontal scroll, action toolbar wrapping

### Reusable component library

| Component | Location | Purpose |
|-----------|----------|---------|
| `KpiCard` | `analytics/` | KPI metrics with trend and skeleton |
| `ChartContainer` | `analytics/` | Chart wrapper with export/refresh placeholders |
| `AnalyticsTable` / `RankingTable` | `analytics/` | Sortable, searchable tables |
| `MetricWidget`, `RegionCard`, `RankingCard` | `analytics/bi/` | BI metric and ranking cards |
| `AlertCenter`, `ActivityTimeline` | `analytics/` | Alerts and activity feed |
| `FilterToolbar` | `analytics/` | Date, region, store, category filters |
| `EmptyState`, `ErrorState` | `design-system/` | Guided empty and error feedback |
| `LoadingSkeleton` variants | `design-system/` | Reusable skeleton primitives |
| `PageHeader` / `DashboardPageHeader` | `design-system/` / `dashboard/` | Page and dashboard headers |
| `SectionHeader` / `DashboardSection` | `analytics/` | Section layout wrappers |

### Mock data strategy

`fetchExecutiveDashboard()` in `src/data/mock/dashboard.ts` simulates API latency (~450ms) for legacy BI widgets. Phase 5 adds live analytics via `/api/v1/analytics/*` and executive intelligence via `/api/v1/intelligence/*`. Phase 6 delivers the visualization framework, interactive dashboards, and Executive Visualization Studio (`/executive-visualization`).

### Future backend integration

1. Swap `fetchExecutiveDashboard` for authenticated REST call
2. Map API errors to `resolveDashboardErrorType()` presets
3. Wire export/refresh actions to real endpoints
4. Enable server-side pagination in `AnalyticsTable`

---

## Sprint 1.2 — Business Intelligence Modules ✅

Mock-only BI layer on the Sprint 1.1 framework. Replace `fetchExecutiveDashboard()` with REST — UI unchanged.

### BI modules

- **Sales Intelligence** — daily / weekly / monthly / quarterly / yearly revenue
- **Regional Performance** — Tokyo, Osaka, Kanagawa, Hokkaido, Fukuoka
- **Product & Store tables** — sort, filter, pagination placeholder
- **Customer & Inventory overview** — metric widget grids
- **Executive Widgets** — categories, suppliers, segments, distributions
- **Alert Center** — priority filter tabs
- **Activity Center** — icon-based timeline

### BI components (`src/components/analytics/bi/`)

`MetricWidget`, `BusinessWidget`, `AnalyticsTable`, `ProductTable`, `StoreTable`, `RegionCard`, `AlertCenter`

### Mock files added

`sales-bi.ts`, `regions.ts`, `inventory.ts`, `widgets.ts`, `customers-bi.ts`

---

## Sprint 1.1 — Executive Dashboard Foundation ✅

Modular dashboard operating system (not analytics logic). Future ETL, statistics, forecasting, and AI modules plug into this framework without UI redesign.

### Dashboard architecture

```text
DashboardPageHeader → FilterToolbar → KPI Grid → SummaryCard
  → Charts Grid → Business Widgets → QuickActionPanel
  → Alerts → ActivityTimeline → SystemHealth → Footer
```

### Reusable component library (`src/components/analytics/`)

| Component | Purpose |
|-----------|---------|
| `KpiCard` | KPI metrics with trend, tooltip, loading skeleton |
| `DashboardSection` / `DashboardGrid` | Section layout + responsive 1–4 column grids |
| `ChartContainer` + chart card wrappers | Line, bar, pie, area containers with export/refresh placeholders |
| `SummaryCard` | Executive summary with tags and recommendations |
| `QuickActionCard` / `QuickActionPanel` | Navigation action cards |
| `AlertCard` / `AlertPanel` | Severity-coded business alerts |
| `ActivityTimeline` | Enterprise activity feed |
| `FilterToolbar` | Centralized dashboard filters |

### Mock data strategy (`src/data/mock/`)

| File | Data |
|------|------|
| `dashboard.ts` | Aggregator — `fetchExecutiveDashboard()` simulates API |
| `kpis.ts` | KPI definitions and values |
| `alerts.ts` | Business alert fixtures |
| `activity.ts` | Operational + foundation timeline events |
| `charts.ts` | Chart dataset builders |
| `summary.ts` | Executive summary and business widgets |

**Future API integration:** Replace `fetchExecutiveDashboard` in `dashboard.ts` with a REST call. UI components consume `useExecutiveDashboard()` — no component changes required.

---

## Phase 1 — Executive Dashboard ✅

The executive dashboard delivers a full enterprise BI experience using mock data architected for future API swap:

- **8 global KPIs** — revenue, orders, customers, stores, products, margin, inventory, growth
- **7 interactive charts** — Recharts-powered trend, sales, category, store, customer, regional, and inventory views
- **Executive summary** — AI-ready summary panel with key highlights
- **Regional performance** — top, lowest, fastest-growing, and highest-profit regions
- **Top products & store rankings** — sortable, filterable tables
- **Business alerts & activity feed** — severity-coded alerts and timeline events
- **Dashboard filters** — date range, region, store, category (mock-aware)
- **Mock data layer** — `src/data/mock/` with TanStack Query hook for API-ready integration

### Screenshot Placeholders

| File | Section |
|------|---------|
| `docs/screenshots/dashboard.png` | Full executive dashboard |
| `docs/screenshots/kpi-section.png` | Global KPI cards |
| `docs/screenshots/charts.png` | Analytics chart grid |
| `docs/screenshots/rankings.png` | Product & store tables |
| `docs/screenshots/alerts.png` | Business alerts panel |

---

## Purpose

- Deliver a premium enterprise SaaS experience comparable to Snowflake, Databricks, or Microsoft Fabric
- Provide a scalable UI foundation for 13+ intelligence modules
- Maintain strict separation between presentation and business logic
- Support independent deployment to Vercel while backend services run locally or in cloud

---

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 |
| Language | TypeScript (strict mode) |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 |
| Routing | React Router v7 |
| Server State | TanStack Query |
| Client State | Zustand |
| HTTP | Axios |
| Animation | Framer Motion |
| Charts | Recharts |
| Icons | Lucide React |

---

## Folder Structure

```
frontend/
├── public/                  # Static assets (favicon, icons)
├── src/
│   ├── app/                 # App shell, router, providers
│   ├── components/
│   │   ├── design-system/   # Reusable enterprise UI components
│   │   └── analytics/       # KPI, chart, alert, ranking components
│   ├── data/
│   │   └── mock/            # Mock datasets (dashboard, sales, stores, products)
│   ├── features/            # Feature-based page modules
│   │   ├── auth/            # Login & authentication layout
│   │   ├── dashboard/       # Executive dashboard + chart components
│   │   ├── engineering/     # Architecture documentation portal
│   │   └── placeholder/     # Future module placeholders
│   ├── hooks/               # TanStack Query hooks
│   ├── lib/                 # API client, constants, utilities
│   ├── stores/              # Zustand state stores
│   ├── styles/              # Design tokens and global CSS
│   └── types/               # Shared TypeScript interfaces
├── vercel.json              # Vercel deployment configuration
├── vite.config.ts           # Vite build and proxy settings
└── package.json
```

---

## Design System

Located in `src/components/design-system/`. All components follow a unified design language:

| Component | Purpose |
|-----------|---------|
| AppShell, Sidebar, TopNav | Application layout |
| PageHeader, SectionContainer | Page structure |
| MetricCard, DataTable | Data presentation |
| StatusBadge, EmptyState, ErrorState | Feedback states |
| ThemeToggle, GlobalSearch | Global utilities |

Design tokens are defined in `src/styles/tokens.css` — colors, radii, shadows, and typography scales.

---

## Running Locally

### Prerequisites

- Node.js 22+
- npm 10+

### Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

**Demo credentials:** `executive@retailcorp.com` / `Enterprise2026!`

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Spring Boot backend URL | `http://localhost:8080` |
| `VITE_DATA_SERVICE_URL` | Python FastAPI URL | `http://localhost:8000` |

Copy from `.env.example`:

```bash
cp .env.example .env
```

Phase 0 uses client-side demo authentication — env vars are optional for UI-only deployment.

---

## Build Instructions

```bash
npm ci
npm run build
```

Output is written to `dist/`. Preview the production build:

```bash
npm run preview
```

---

## Vercel Deployment

This frontend deploys independently from the monorepo.

### Dashboard (Git-connected)

1. Connect repository in [Vercel Dashboard](https://vercel.com/new)
2. Set **Root Directory** → `frontend`
3. Framework: **Vite** · Output: `dist` · Build: `npm run build`
4. Deploy

### CLI

```bash
cd frontend
npx vercel login
npx vercel --prod
```

`vercel.json` configures SPA rewrites for React Router paths (`/engineering`, `/sales`, etc.).

---

## Phase 0.5 Features

- Public landing page at `/welcome`
- Command palette (`⌘K` / `Ctrl+K`) for module navigation
- One-click **Continue as Demo** on login
- System health widget on executive dashboard
- Reusable analytics placeholder components in `src/components/analytics/`

---

| Phase | Module |
|-------|--------|
| 0–0.5 | Foundation & enterprise UX ✅ |
| 1 | Executive Dashboard ✅ |
| 2 | Core Retail Domain & Database Model ✅ |
| 3 | Synthetic Retail Data Generator (current) |
| 4 | Python ETL & Data Engineering Pipeline |
| 5 | Business Analytics & Statistics Engine |
| 6 | Data Visualization Platform |
| 7–8 | Forecasting & pipeline monitoring |
| 9–10 | Airflow orchestration & event architecture |
| 11–14 | AI insights, Kubernetes, observability, portfolio |

Roadmap source of truth: `src/lib/roadmap.ts` (Phases 0–14 plus UX milestone 0.5).

See the root [README](../README.md) and [phase plan](../docs/phase-plan.md) for the complete roadmap.

---

## Coding Standards

- **TypeScript strict mode** — no implicit any
- **Feature-based organization** — pages live under `features/`
- **Design system first** — reuse components, avoid one-off styles
- **Environment variables only** — no hardcoded API URLs
- **Accessible markup** — semantic HTML, ARIA labels on interactive elements
- **Consistent naming** — PascalCase components, camelCase utilities

---

## License

Proprietary — Enterprise Retail Intelligence Platform
