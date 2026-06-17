# System Architecture

## Overview

The Enterprise Retail Intelligence & Forecasting Platform is a microservices-based system designed for horizontal scalability, independent deployment, and enterprise-grade reliability. Phase 0 establishes the architectural foundation; see [Development Phase Plan](phase-plan.md) for the full Phase 0–14 roadmap (`frontend/src/lib/roadmap.ts` in the application).

**Platform phase:** Phases 0–7 complete · **Phase 8 (Pipeline Monitoring & Data Quality) current**

---

## Phase 2 — Core Retail Domain & Database Model

**Status:** Complete

Phase 2 delivers the persistence and API-ready domain layer that future data and analytics phases depend on:

- **PostgreSQL `retail` schema** — stores, products, customers, suppliers, inventory, sales, promotions, returns
- **Flyway migrations** — `V1__core_retail_domain_schema.sql`, `V2__retail_indexes_and_constraints.sql`
- **Spring Boot domain modules** — JPA entities, enums, repositories, DTOs, mappers, service/controller skeletons
- **REST placeholders** — `/api/v1/stores`, `/products`, `/customers`, `/suppliers`, `/inventory`, `/sales`, `/promotions`, `/returns`
- **OpenAPI** — Swagger UI for API exploration

Phase 3 (Synthetic Retail Data Generator) populates development datasets. Phase 4 ETL loads cleaned data into the analytics warehouse. Phase 5+ analytics read from warehouse and domain APIs. See [Data Model Guide](data-model.md).

---

## Service Responsibilities

### Frontend (React SPA)

- Enterprise UI shell with design system
- Client-side routing and protected routes
- Theme management and workspace switching
- API communication via Axios with JWT interceptors
- TanStack Query for server state (prepared for Phase 2+)
- **Executive Dashboard (Phase 1)** — mock-driven BI with reusable analytics components, lazy-loaded chart/BI modules, and API-ready filter/query hooks
- **ETL Studio (Phase 4)** — enterprise pipeline dashboard with quality metrics, warehouse summary, lineage, and execution history

**Port:** 5173 (dev) / 80 (production)

### Backend (Spring Boot)

- API gateway and authentication authority
- JWT token generation and validation
- Feature-based package organization
- Global exception handling and API response wrapper
- OpenAPI/Swagger documentation
- CORS configuration for frontend integration

**Port:** 8080

**Feature Packages (prepared, not implemented):**

```
config/ common/ security/ auth/ users/ dashboard/
sales/ inventory/ analytics/ statistics/ forecasting/
generator/ etl/ pipeline/ insights/ audit/ exception/
```

**Phase 2 — Core Retail Domain (`domain/`):**

```
domain/store/ product/ customer/ supplier/ inventory/
sales/ promotion/ returns/
  entity/ repository/ dto/ mapper/ service/ controller/
common/enums/ common/entity/BaseEntity.java
```

Flyway migrations: `V1__core_retail_domain_schema.sql`, `V2__retail_indexes_and_constraints.sql`

REST placeholders: `/api/v1/stores`, `/products`, `/customers`, `/suppliers`, `/inventory`, `/sales`, `/promotions`, `/returns`

See [Data Model Guide](data-model.md) for entity relationships and schema details.

### Data Service (FastAPI)

- Python-based data processing service
- **Synthetic data generator (Phase 3)** — Faker, Pandas, CSV/JSON/Excel export
- **ETL pipeline (Phase 4)** — extract, validate, profile, clean, transform, aggregate, load
- **Cleaning engine (Sprint 4.2)** — missing values, duplicates, standardization, business rules
- **Analytics warehouse (Sprint 4.3)** — star schema, load strategies, lineage, execution history
- **Statistics engine (Sprint 5.1)** — descriptive, business, distribution, time-series, regional, health metrics
- API versioning (`/api/v1`)
- Structured logging

**Port:** 8000

**Implemented modules:**

```
app/generator/   app/etl/   app/statistics/   app/api/v1/generator.py   app/api/v1/etl.py   app/api/v1/statistics.py
```

### Database (PostgreSQL)

- Primary persistence layer
- Schema separation: `retail` (application), `audit` (compliance)
- Version tracking via `schema_version` table
- Initialized via Docker entrypoint scripts

**Port:** 5432

---

## Communication Flow

```
User Browser
    │
    ▼
Frontend (React)
    │
    ├──► Backend API (Spring Boot) ──► PostgreSQL
    │         │
    │         └──► Data Service (FastAPI) ──► PostgreSQL
    │
    └──► (Future) WebSocket / SSE for real-time pipeline monitoring
```

### Authentication Flow (Phase 0)

1. User submits credentials on login page (client-side demo auth)
2. Frontend stores JWT token in localStorage
3. Axios interceptor attaches `Authorization: Bearer <token>` header
4. Spring Security JWT filter validates token on protected endpoints
5. Invalid/expired tokens trigger redirect to login

---

## ETL Architecture (Phase 4 — Complete)

```
Data Sources ──► Ingestion Layer ──► Validation ──► Transformation ──► Load ──► PostgreSQL
                      │                    │               │
                      ▼                    ▼               ▼
                 Pipeline Monitor    Error Queue      Audit Trail
```

- Batch and streaming ingestion pipelines
- Schema validation and data quality checks
- Orchestrated via Python data service
- Pipeline status exposed via backend API
- Synthetic data generation for development and testing

---

## Analytics & Visualization (Phases 5–6 — Complete)

```text
Analytics Warehouse
        ↓
Statistics Engine (Sprint 5.1)
        ↓
Business Analytics Engine (Sprint 5.2)
        ↓
Executive Intelligence Engine (Sprint 5.3)
        ↓
Executive Dashboard + Intelligence Pages
        ↓
Visualization Framework (Sprint 6.1)
        ↓
Interactive Analytics Dashboards (Sprint 6.2)
        ↓
Executive Visualization Studio (Sprint 6.3)
        ↓
Forecasting (Phase 7)
        ↓
Forecasting Center (Phase 7.2)
        ↓
Pipeline Monitoring (Phase 8)
```

- **Statistics Engine** — descriptive, business, distribution, time-series, regional, health metrics
- **Visualization Framework (Sprint 6.1)** — reusable Recharts components, theme, adapters, Visualization Studio at `/visualization`
- **Interactive Analytics Dashboards (Sprint 6.2)** — eight enterprise BI dashboards with shared layout, adapter layer, and API-ready filters
- **Executive Visualization Studio (Sprint 6.3)** — KPI board, target vs actual, business health, anomalies, gallery at `/executive-visualization`
- **Forecasting Engine (Phase 7)** — `/api/v1/forecasting` — sales, revenue, demand, inventory, store forecasts, accuracy, scenarios
- **Forecasting Center (Phase 7)** — `/forecasting` — executive summary, charts, accuracy dashboard, scenario planner
- API: `/api/v1/statistics/*`, `/api/v1/analytics/*`, `/api/v1/intelligence/*`, and `/api/v1/forecasting/*`
- Sales, inventory, customer, supplier, product, regional, ETL quality, and executive intelligence dashboard routes
- See [Forecasting Engine](forecasting-engine.md) and [Forecasting Center](forecasting-center.md)

---

## Forecasting Platform (Phase 7 — Complete)

```
Analytics Warehouse ──► Feature Engineering ──► Forecasting Models ──► Accuracy Engine
                                                          │
                                                          ▼
                                              Scenario Planner ──► Forecasting Center UI
```

- Explainable baselines: moving average, linear regression, seasonal naive, exponential smoothing
- Forecasting Center at `/forecasting` with accuracy dashboard and scenario planning
- See [Forecasting Engine](forecasting-engine.md) and [Forecasting Center](forecasting-center.md)

---

## Future Kubernetes Deployment (Phase 11)

```
                    ┌─────────────────┐
                    │  Ingress (NGINX) │
                    └────────┬────────┘
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
         Frontend       Backend      Data Service
         (2 replicas)   (2 replicas)  (2 replicas)
              │              │              │
              └──────────────┼──────────────┘
                             ▼
                      PostgreSQL (StatefulSet)
                             │
                    ┌────────┴────────┐
                    ▼                 ▼
              Prometheus          Grafana
              (Metrics)        (Dashboards)
```

- Helm charts for parameterized deployment
- Horizontal Pod Autoscaling based on CPU/memory
- ConfigMaps and Secrets for environment management
- GitOps deployment via ArgoCD
- Service mesh (Istio) for mTLS and traffic management

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| Monorepo | Shared conventions, atomic changes, simplified CI |
| Microservices | Independent scaling and deployment per domain |
| Feature packages | Clear boundaries for team ownership |
| JWT stateless auth | Kubernetes-friendly, no session affinity |
| API versioning | Backward-compatible evolution |
| Docker-first | Consistent environments from dev to production |
| Design system | Unified UX across 13+ modules |

---

## Security Considerations

- JWT secrets managed via environment variables / K8s Secrets
- CORS restricted to known frontend origins
- PostgreSQL credentials never committed to source control
- Spring Security filter chain with stateless sessions
- Prepared for OAuth2/OIDC integration in production phase
