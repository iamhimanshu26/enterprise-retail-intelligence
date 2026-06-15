# Retail Intelligence — Frontend

Enterprise-grade React application for the **Enterprise Retail Intelligence & Forecasting Platform**. This is the client-facing SaaS shell that powers executive dashboards, analytics modules, and engineering documentation.

---

## Project Overview

The frontend is a production-quality single-page application built for Fortune 500 retail operations. It provides a unified interface for retail intelligence, business analytics, ETL pipeline management, forecasting, and system architecture documentation.

**Current status:** Phase 0 complete — enterprise foundation, design system, authentication shell, and navigation for all planned modules.

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
│   │   └── error-boundary/  # Global error handling
│   ├── features/            # Feature-based page modules
│   │   ├── auth/            # Login & authentication layout
│   │   ├── dashboard/       # Executive dashboard
│   │   ├── engineering/     # Architecture documentation portal
│   │   and placeholder/     # Future module placeholders
│   ├── layouts/             # Dashboard and auth layouts
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
| 1 | Enterprise Dashboard (live KPIs) |
| 2 | Backend API integration |
| 3–4 | Data generator & ETL UI |
| 5–7 | Analytics, visualization, forecasting |
| 8–11 | Pipeline monitoring, Airflow, insights |
| 12–14 | Kubernetes, observability, polish |

See the root [README](../README.md) for the complete 15-phase roadmap.

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
