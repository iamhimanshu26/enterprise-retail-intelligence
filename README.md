# Enterprise Retail Intelligence & Forecasting Platform

**Unified retail intelligence, data engineering, and forecasting for enterprise operations.**

A production-quality microservices platform demonstrating full-stack engineering, data pipelines, business intelligence, statistics, and demand forecasting — architected for Fortune 500 retail scale.

[![Phase](https://img.shields.io/badge/Phase-2%20Complete-success)](/)
[![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Spring%20%7C%20FastAPI-blue)](/)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel%20%7C%20Docker-black)](/)

## Current Status

✅ **Phase 0** — Enterprise Foundation & System Architecture

✅ **Phase 0.5** — Enterprise UX & SaaS Experience

✅ **Phase 1** — Executive Dashboard & Retail Intelligence Foundation

✅ **Phase 2** — Core Retail Domain & Database Model

🚀 **Next Phase:** Phase 3 — Synthetic Retail Data Generator

---

## Features Overview

The platform delivers a comprehensive suite of enterprise retail capabilities:

| Capability | Description |
|------------|-------------|
| **Retail Intelligence** | Sales, inventory, customer, and supplier analytics |
| **Business Intelligence** | Executive dashboards and dimensional reporting |
| **Data Engineering** | Scalable ETL pipelines and data validation |
| **ETL Pipelines** | Batch ingestion, transformation, and orchestration |
| **Statistics** | Hypothesis testing, regression, and modeling |
| **Forecasting** | Demand prediction with scenario planning |
| **Executive Dashboards** | KPI views for C-suite decision makers |
| **Synthetic Data Generation** | Realistic retail datasets for development |
| **Business Insights** | AI-powered recommendations and anomaly detection |
| **Cloud-Native Architecture** | Docker, Kubernetes-ready, independently deployable services |

---

## Architecture Overview

The platform evolves from a deployed UI and API foundation toward a full retail data and intelligence pipeline:

```text
React
↓
Spring Boot
↓
PostgreSQL
↓
FastAPI
↓
Synthetic Data Generator
↓
ETL Pipeline
↓
Analytics Engine
↓
Forecast Engine
↓
Business Insights
```

**Deployment topology (Phases 0–2 live locally via Docker Compose):**

```
                         ┌─────────────────────────────────────┐
                         │         CDN / Vercel Edge           │
                         │     React 19 · TypeScript · Vite     │
                         └──────────────────┬──────────────────┘
                                            │ HTTPS / REST
                         ┌──────────────────▼──────────────────┐
                         │      Spring Boot API Gateway         │
                         │   JWT · Security · OpenAPI · JPA     │
                         └───┬──────────────────────┬──────────┘
                             │                      │
              ┌──────────────▼─────────┐   ┌───────▼──────────────┐
              │  FastAPI Data Service   │   │   PostgreSQL 16      │
              │  ETL · Stats · ML Prep  │   │  Retail · Audit · OLAP│
              └──────────────┬─────────┘   └──────────────────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
    ┌────▼────┐        ┌─────▼─────┐      ┌─────▼─────┐
    │ Airflow │        │   Kafka   │      │ Prometheus │
    │ (Ph. 9) │        │  (Ph. 10) │      │  (Ph. 13)  │
    └─────────┘        └───────────┘      └───────────┘
                         ┌─────────────────────────────────────┐
                         │     Kubernetes Cluster (Ph. 12)     │
                         │  Helm · GitOps · Auto-scaling · mTLS  │
                         └─────────────────────────────────────┘
```

All services are independently deployable. Phases 0–2 establish the foundation, domain model, and executive dashboard; later phases add synthetic data, ETL, analytics, forecasting, and observability layers.

---

## Tech Stack

### Current (Phases 0–2)

| Layer | Technologies |
|-------|----------------|
| **Frontend** | React 19 · TypeScript · Vite · Tailwind CSS · TanStack Query · Zustand · Framer Motion · React Router |
| **Backend** | Java 21 · Spring Boot 3 · Spring Security · JWT · Spring Data JPA · OpenAPI / Swagger · Flyway |
| **Python** | Python 3.12 · FastAPI · Pydantic |
| **Database** | PostgreSQL 16 · Schema-separated (`retail`, `audit`) · Flyway migrations |
| **Infrastructure** | Docker · Docker Compose · Kubernetes manifests · Nginx reverse proxy |
| **DevOps** | GitHub Actions CI · Vercel (frontend) · Helm charts (planned) |

### Planned (Phases 3–14)

Java 21 · Spring Boot · React · TypeScript · FastAPI · PostgreSQL · Docker · Kubernetes · Pandas · NumPy · Polars · DuckDB · Faker · Airflow · Kafka · Scikit-learn · Statsmodels · Prophet · XGBoost

---

## Screenshots

> Screenshots will be added as modules are implemented. Placeholders below represent planned views.

| Module | Preview |
|--------|---------|
| **Dashboard** | `docs/screenshots/dashboard.png` *(Phase 1)* |
| **Forecasting** | `docs/screenshots/forecasting.png` *(Phase 7)* |
| **ETL Pipeline** | `docs/screenshots/etl.png` *(Phase 4)* |
| **Architecture** | `docs/screenshots/architecture.png` *(Phase 0)* |
| **Statistics** | `docs/screenshots/statistics.png` *(Phase 5)* |
| **Data Generator** | `docs/screenshots/generator.png` *(Phase 3)* |

Live demo: deploy frontend to Vercel and visit `/engineering` for the architecture portal.

---

## Folder Structure

```
enterprise-retail-intelligence/
├── frontend/                 # React SPA — enterprise UI shell & design system
├── backend-springboot/       # Spring Boot API — JWT, security, domain packages
├── data-service-python/      # FastAPI — ETL, statistics, forecasting (planned)
├── database/
│   ├── init/                 # Docker PostgreSQL bootstrap scripts
│   └── migrations/           # Flyway SQL migrations (Phase 2 domain schema)
├── docker/                   # Shared Docker configs (nginx, etc.)
├── k8s/                      # Kubernetes deployment manifests
├── docs/                     # Architecture guides and phase documentation
├── scripts/                  # Dev, deploy, and Docker helper scripts
├── .github/workflows/        # CI pipeline (frontend, backend, Python)
└── docker-compose.yml        # Local multi-service orchestration
```

| Folder | Responsibility |
|--------|---------------|
| `frontend/` | UI, routing, design system, Vercel deployment |
| `backend-springboot/` | REST APIs, authentication, business orchestration |
| `data-service-python/` | Data processing, ETL, ML/statistics workloads |
| `database/` | Schema initialization and migration scripts |
| `docker/` | Container configuration shared across services |
| `k8s/` | Production Kubernetes resources |
| `docs/` | System architecture and roadmap documentation |
| `scripts/` | Automation for local dev and deployment |

---

## Getting Started

### Prerequisites

- Docker Desktop
- Node.js 22+
- Java 21 + Maven *(optional, for local backend)*
- Python 3.12 *(optional, for local data service)*

### Environment Variables

```bash
cp .env.example .env
cp frontend/.env.example frontend/.env
cp data-service-python/.env.example data-service-python/.env
```

> PostgreSQL runs **locally via Docker Compose only** — no paid cloud database required.

### Docker Compose (Recommended)

```bash
chmod +x scripts/*.sh
./scripts/start.sh
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8080 |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| Data Service | http://localhost:8000/docs |
| PostgreSQL | localhost:5433 |

**Demo login:** `executive@retailcorp.com` / `Enterprise2026!`

### Individual Services

```bash
# Frontend
cd frontend && npm install && npm run dev

# Backend
cd backend-springboot && mvn spring-boot:run

# Python
cd data-service-python && python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python scripts/verify_generator.py
uvicorn app.main:app --reload

# Database only
docker compose up postgres -d
```

---

## Deployment

### Vercel (Frontend)

The frontend deploys independently from the monorepo.

**Git-connected (recommended):**

1. Push repository to GitHub
2. Import in [Vercel Dashboard](https://vercel.com/new)
3. Set **Root Directory** → `frontend`
4. Confirm: Framework **Vite** · Build `npm run build` · Output `dist`
5. Deploy — every push to `main` auto-redeploys

**CLI:**

```bash
cd frontend
npx vercel login
npx vercel --prod
```

**Verify deployment:**

- `/login` — enterprise login page
- `/engineering` — architecture documentation portal
- Demo: `executive@retailcorp.com` / `Enterprise2026!`

Optional env vars (when backend is deployed):

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | Spring Boot backend URL |
| `VITE_DATA_SERVICE_URL` | FastAPI data service URL |

### Kubernetes (Future — Phase 12)

Manifests in `k8s/` provide deployment templates for frontend, backend, data service, ingress, configmaps, and secrets. Production deployment with Helm and GitOps is planned for Phase 12.

---

## Roadmap

Official phase sequence (application source of truth: `frontend/src/lib/roadmap.ts`):

```text
Phase 0    Enterprise Foundation & System Architecture
Phase 0.5  Enterprise UX & SaaS Experience
Phase 1    Executive Dashboard & Retail Intelligence Foundation
Phase 2    Core Retail Domain & Database Model
Phase 3    Synthetic Retail Data Generator
Phase 4    Python ETL & Data Engineering Pipeline
Phase 5    Business Analytics & Statistics Engine
Phase 6    Data Visualization Platform
Phase 7    Forecasting & Predictive Analytics
Phase 8    Pipeline Monitoring & Data Quality
Phase 9    Airflow Workflow Orchestration
Phase 10   Event-Driven Architecture
Phase 11   AI Business Insight Engine
Phase 12   Kubernetes & Cloud-Native Deployment
Phase 13   Monitoring & Observability
Phase 14   Portfolio & Enterprise Presentation
```

| Phase | Status |
|-------|--------|
| 0, 0.5, 1, 2 | ✅ Complete |
| 3 | 🚀 Current — Synthetic Retail Data Generator |
| 4–14 | Planned |

See [Development Phase Plan](docs/phase-plan.md) for full deliverables and purpose statements.

---

## Documentation

- [Architecture Guide](docs/architecture.md)
- [Development Phase Plan](docs/phase-plan.md)
- [Synthetic Data Generator](docs/synthetic-data-generator.md)
- [ETL Pipeline](docs/etl-pipeline.md)
- [Frontend README](frontend/README.md)

---

## License

Proprietary — Enterprise Retail Intelligence Platform
