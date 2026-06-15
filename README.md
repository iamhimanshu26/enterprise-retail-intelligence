# Enterprise Retail Intelligence & Forecasting Platform

**Unified retail intelligence, data engineering, and forecasting for enterprise operations.**

A production-quality microservices platform demonstrating full-stack engineering, data pipelines, business intelligence, statistics, and demand forecasting — architected for Fortune 500 retail scale.

[![Phase](https://img.shields.io/badge/Phase-0%20Complete-success)](/)
[![Stack](https://img.shields.io/badge/Stack-React%20%7C%20Spring%20%7C%20FastAPI-blue)](/)
[![Deploy](https://img.shields.io/badge/Deploy-Vercel%20%7C%20Docker-black)](/)

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

All services are independently deployable. Phase 0 establishes the foundation; future phases add orchestration, events, and observability layers.

---

## Tech Stack

### Frontend
React 19 · TypeScript · Vite · Tailwind CSS · TanStack Query · Zustand · Framer Motion · React Router

### Backend
Java 21 · Spring Boot 3 · Spring Security · JWT · Spring Data JPA · OpenAPI / Swagger

### Python
Python 3.12 · FastAPI · Pydantic · (planned: Pandas, Polars, Scikit-learn, Statsmodels)

### Database
PostgreSQL 16 · Schema-separated (`retail`, `audit`) · Flyway migrations (planned)

### Infrastructure
Docker · Docker Compose · Kubernetes manifests · Nginx reverse proxy

### DevOps
GitHub Actions CI · Vercel (frontend) · Helm charts (planned)

### Future ML Libraries
Prophet · XGBoost · Scikit-learn · Statsmodels · DuckDB · Faker

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
│   └── migrations/           # Future schema migrations
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
pip install -r requirements.txt && uvicorn app.main:app --reload

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

| Phase | Title | Description |
|-------|-------|-------------|
| **0** | Enterprise Foundation | Monorepo, design system, JWT, Docker, documentation portal |
| **1** | Enterprise Dashboard | Live KPI views and executive dashboard layouts |
| **2** | Backend APIs | Domain REST APIs for sales, inventory, customers, suppliers |
| **3** | Synthetic Retail Data Generator | Faker-based realistic retail dataset generation |
| **4** | Python ETL Pipeline | Batch ingestion, validation, transformation, and load |
| **5** | Business Analytics & Statistics | Statistical modeling and hypothesis testing |
| **6** | Data Visualization | Interactive charts, drill-downs, and reporting |
| **7** | Forecasting Engine | Demand forecasting with ARIMA, Prophet, and ML ensembles |
| **8** | Pipeline Monitoring | Real-time pipeline health, logs, and metrics |
| **9** | Airflow Integration | Scheduled workflow orchestration and dependencies |
| **10** | Event-Driven Architecture | Kafka messaging, event sourcing, and CQRS |
| **11** | Business Insight Engine | AI recommendations and anomaly detection |
| **12** | Kubernetes Deployment | Production orchestration with Helm and GitOps |
| **13** | Monitoring & Observability | Distributed tracing, logging, and SLA dashboards |
| **14** | Portfolio Polish | Final UX, documentation, demos, and hardening |

**Current:** Phase 0 complete · **Next:** Phase 1 — Enterprise Dashboard

---

## Documentation

- [Architecture Guide](docs/architecture.md)
- [Phase Plan (legacy)](docs/phase-plan.md)
- [Frontend README](frontend/README.md)

---

## License

Proprietary — Enterprise Retail Intelligence Platform
