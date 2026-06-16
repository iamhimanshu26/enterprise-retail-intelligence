# System Architecture

## Overview

The Enterprise Retail Intelligence & Forecasting Platform is a microservices-based system designed for horizontal scalability, independent deployment, and enterprise-grade reliability. Phase 0 establishes the architectural foundation; see [Development Phase Plan](phase-plan.md) for the full Phase 0–13 roadmap (`frontend/src/lib/roadmap.ts` in the application).

---

## Service Responsibilities

### Frontend (React SPA)

- Enterprise UI shell with design system
- Client-side routing and protected routes
- Theme management and workspace switching
- API communication via Axios with JWT interceptors
- TanStack Query for server state (prepared for Phase 2+)
- **Executive Dashboard (Phase 1)** — mock-driven BI with reusable analytics components, lazy-loaded chart/BI modules, and API-ready filter/query hooks

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
- Prepared for pandas, numpy, polars, scikit-learn integration
- API versioning (`/api/v1`)
- Dependency injection and configuration management
- Structured logging

**Port:** 8000

**Module Structure (prepared, not implemented):**

```
api/ core/ generator/ etl/ statistics/
forecasting/ validation/ models/ services/ utils/
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

## Future ETL Architecture (Phase 3)

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

## Future Analytics Engine (Phase 4–5)

```
PostgreSQL ──► OLAP Layer ──► Analytics API ──► Frontend Dashboards
                   │
                   ├── Dimensional modeling (star schema)
                   ├── Aggregation engine
                   └── Real-time metrics computation
```

- Sales, inventory, customer, and supplier intelligence modules
- Interactive charts and drill-down capabilities
- Regional and temporal filtering
- Export and scheduled report generation

---

## Future Forecasting Engine (Phase 6)

```
Historical Data ──► Feature Engineering ──► Model Selection ──► Forecast API
                          │                       │
                          ▼                       ▼
                    Statistics Engine      Scenario Planning
```

- Time series models: ARIMA, Prophet, exponential smoothing
- ML ensembles: Random Forest, Gradient Boosting
- Confidence intervals and scenario comparison
- Integration with Statistics Lab (Phase 4)

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
