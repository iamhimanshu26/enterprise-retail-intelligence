# Pipeline Monitoring Engine

Phase 8 delivers the **Pipeline Monitoring & Data Quality** backend — aggregation of ETL execution history, quality scores, failure patterns, retry recommendations, and service health for the Operations Center UI.

---

## Objective

Provide operational visibility into pipeline runs without Airflow (Phase 9) or Prometheus/Grafana (Phase 12). The engine aggregates existing ETL execution history and synthesizes platform-wide module status.

---

## Module Layout

```text
data-service-python/app/monitoring/
├── models.py       # Pydantic response models
└── engine.py       # Monitoring report orchestrator

data-service-python/app/api/v1/monitoring.py
```

---

## Data Sources

- `execution_history_store` — ETL run records from Phase 4
- Quality dimensions derived from execution quality scores
- Synthetic platform module status for analytics, statistics, forecasting
- Mock failure/retry patterns from failed runs

---

## Retry Strategy

- Failed runs generate retry recommendations with `retryable` flags
- No automatic retry execution in Phase 8
- Phase 9 Airflow will orchestrate scheduled retries

---

## Failure Analysis

Failures include category, severity, root cause placeholder, suggested action, and frequency counts for dashboard charts.

---

## Service Health

API-ready health cards for Frontend, Spring Boot, FastAPI, PostgreSQL, ETL Engine, Forecasting Engine, and Analytics Engine with `healthy`, `degraded`, or `down` status.

---

## Frontend Integration

`useOperationsData()` calls `POST /api/v1/monitoring/run-sample` with mock fallback via `MONITORING_MOCK_REPORT`.

See [Operations Center](operations-center.md) for UI architecture.
