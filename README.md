# Enterprise Retail Intelligence & Forecasting Platform

A production-quality enterprise SaaS platform for retail intelligence, analytics, and forecasting. Built with a microservices architecture comparable to enterprise BI systems like Snowflake, Databricks, and Microsoft Fabric.

**Current Status: Phase 0 — Enterprise Foundation**

---

## Vision

Deliver a unified platform that demonstrates expertise across full-stack development, data engineering, business intelligence, statistics, and forecasting — purpose-built for Fortune 500 retail operations.

Phase 0 establishes the enterprise foundation: architecture, UI shell, authentication infrastructure, and scalable codebase. No business logic, ETL, analytics, or forecasting is implemented yet.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    React Frontend (Vite)                     │
│              Enterprise Design System + UI Shell             │
└─────────────────────────┬───────────────────────────────────┘
                          │ REST / JWT
┌─────────────────────────▼───────────────────────────────────┐
│              Spring Boot Backend (Java 21)                   │
│         JWT · Security · OpenAPI · Feature Packages          │
└──────────────┬──────────────────────────┬───────────────────┘
               │                          │
               ▼                          ▼
┌──────────────────────────┐  ┌───────────────────────────────┐
│  FastAPI Data Service     │  │       PostgreSQL 16           │
│  (Python 3.12)            │  │   Schemas · Audit · Retail    │
└──────────────────────────┘  └───────────────────────────────┘
```

All services are independently deployable via Docker and Kubernetes-ready from day one.

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS, TanStack Query, Zustand |
| Backend | Java 21, Spring Boot 3, Spring Security, JWT, OpenAPI |
| Data Service | Python 3.12, FastAPI, Pydantic |
| Database | PostgreSQL 16 |
| Infrastructure | Docker, Docker Compose, Kubernetes manifests |

---

## Project Structure

```
enterprise-retail-intelligence/
├── frontend/                 # React SPA with enterprise design system
├── backend-springboot/       # Spring Boot API microservice
├── data-service-python/      # FastAPI data/analytics service
├── database/                 # PostgreSQL init scripts & future migrations
│   ├── init/                 # Docker entrypoint bootstrap (Phase 0)
│   └── migrations/           # Placeholder for Phase 1+ schema changes
├── docker/                   # Shared Docker configuration
├── k8s/                      # Kubernetes deployment manifests
├── docs/                     # Architecture and phase documentation
├── scripts/                  # Development and deployment scripts
├── .github/                  # CI/CD workflows
└── docker-compose.yml        # Local multi-service orchestration
```

---

## Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 22+ (local frontend dev)
- Java 21 + Maven (local backend dev)
- Python 3.12 (local data service dev)
- Vercel CLI (optional, for frontend deployment)

Copy environment variables before starting:

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env
cp data-service-python/.env.example data-service-python/.env
```

> **Database note:** PostgreSQL is configured for **Docker Compose only** in Phase 0. No paid or cloud database services are required. Business schema migrations will be added in `database/migrations/` starting in Phase 1.

### Run with Docker (Recommended)

```bash
chmod +x scripts/*.sh
./scripts/start.sh
```

Stop all services:

```bash
./scripts/stop.sh
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| Data Service | http://localhost:8000 |
| Data Service Docs | http://localhost:8000/docs |
| PostgreSQL | localhost:5433 |

**Demo Login:** `executive@retailcorp.com` / `Enterprise2026!`

### Local Development

```bash
./scripts/dev-setup.sh

# Terminal 1 — Database
docker compose up postgres -d

# Terminal 2 — Backend
cd backend-springboot && mvn spring-boot:run

# Terminal 3 — Data Service
cd data-service-python && source .venv/bin/activate && uvicorn app.main:app --reload

# Terminal 4 — Frontend
cd frontend && npm run dev
```

---

## Authentication & Full Deploy

Run this **once** in your macOS Terminal (outside Cursor sandbox) to authenticate Docker + Vercel and start all services:

```bash
cd /Users/iamhimanshusharma/Projects/enterprise-retail-intelligence
chmod +x scripts/auth-and-deploy.sh
./scripts/auth-and-deploy.sh
```

This script will:

1. Start **Docker Desktop** and wait for the daemon
2. Copy `.env` files from examples
3. Run **`docker compose up --build -d`** (PostgreSQL, Spring Boot, FastAPI, frontend)
4. Open **Vercel login** in your browser (GitHub/Google/email)
5. Build and **deploy frontend to Vercel production**

Alternatively, set a Vercel token to skip interactive login:

```bash
export VERCEL_TOKEN='your-token-from-vercel.com/account/settings/tokens'
./scripts/auth-and-deploy.sh
```

---

The frontend is deployed independently from the monorepo. Vercel serves the enterprise UI shell (login, dashboard, Engineering Architecture, and all placeholder modules).

### Option A — Vercel CLI (Recommended)

```bash
# One-time login
npx vercel login

# Deploy (builds and publishes frontend/)
chmod +x scripts/deploy-vercel.sh
./scripts/deploy-vercel.sh
```

Or manually:

| Setting | Value |
|---------|-------|
| Root Directory | `frontend/` (if deploying from repo root via dashboard) |
| Framework Preset | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Install Command | `npm ci` |

### Option B — Vercel Dashboard (Git-connected)

1. Import the repository in [Vercel Dashboard](https://vercel.com/new)
2. Set **Root Directory** to `frontend/`
3. Framework will auto-detect **Vite**
4. Add environment variables (optional for Phase 0 demo auth):

| Variable | Value |
|----------|-------|
| `VITE_API_URL` | Your backend URL (when deployed) |
| `VITE_DATA_SERVICE_URL` | Your data service URL (when deployed) |

Phase 0 uses client-side demo authentication, so the UI works on Vercel without backend services.

### SPA Routing

`frontend/vercel.json` configures rewrites so React Router paths (e.g. `/engineering`, `/sales`) resolve correctly.

**Demo Login:** `executive@retailcorp.com` / `Enterprise2026!`

---

## Phase 0 Deliverables

- Enterprise monorepo with scalable folder structure
- Premium SaaS UI shell with 13 navigation modules
- Unified design system (20+ reusable components)
- Engineering Architecture documentation portal
- JWT authentication infrastructure
- Health endpoints across all services
- Docker Compose environment
- Kubernetes-ready deployment manifests
- CI pipeline and comprehensive documentation

---

## Roadmap

See [docs/phase-plan.md](docs/phase-plan.md) for the complete development timeline.

| Phase | Focus |
|-------|-------|
| **0** | Enterprise foundation & architecture *(current)* |
| **1** | ETL pipelines & synthetic data generation |
| **2** | Analytics & business intelligence |
| **3** | Statistics engine |
| **4** | Forecasting center |
| **5** | AI insights & production deployment |

---

## Documentation

- [Architecture Guide](docs/architecture.md)
- [Phase Plan](docs/phase-plan.md)

---

## License

Proprietary — Enterprise Retail Intelligence Platform
