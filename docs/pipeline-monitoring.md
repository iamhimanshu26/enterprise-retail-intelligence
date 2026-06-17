# Pipeline Monitoring Engine

Phase 8.1 delivers the **enterprise monitoring backend foundation** — modular execution tracking, quality monitoring, metrics, failure analysis, retry metadata, lineage, and service health APIs that power the Operations Center (Phase 8.2) and future Airflow orchestration (Phase 9).

---

## Objective

Provide operational visibility into every platform pipeline without Airflow (Phase 9) or Prometheus/Grafana (Phase 12). The engine aggregates ETL `execution_history_store` records and synthesizes platform-wide module status.

---

## Monitoring Architecture

```text
Platform Modules
        ↓
Execution Tracker
        ↓
Quality Monitor
        ↓
Metrics Engine
        ↓
Failure Engine
        ↓
Retry Engine
        ↓
Service Health
        ↓
Operations Center (Phase 8.2)
        ↓
Future Airflow
```

---

## Module Layout

```text
data-service-python/app/monitoring/
├── exceptions.py
├── pipeline_registry.py
├── execution_tracker.py
├── status_engine.py
├── quality_monitor.py
├── lineage_monitor.py
├── metrics_engine.py
├── failure_engine.py
├── retry_engine.py
├── service_health.py
├── engine.py
└── models.py

data-service-python/app/api/v1/monitoring.py
```

Each module has a single responsibility. The orchestrator (`engine.py`) composes a unified `MonitoringReport`.

---

## Pipeline Registry

Registers eight platform pipelines with metadata:

- Synthetic Data Generator
- ETL Pipeline
- Data Cleaning Engine
- Analytics Warehouse
- Statistics Engine
- Business Analytics Engine
- Executive Intelligence Engine
- Forecasting Engine

Each entry includes `pipeline_id`, `name`, `description`, `owner`, `version`, `current_status`, and `enabled`.

---

## Execution Tracker

Tracks every execution with:

- `execution_id`, `pipeline_id`, start/end time, duration
- `trigger_source` (scheduled, manual, api, sample)
- Status: `queued`, `running`, `success`, `warning`, `failed`, `cancelled`
- `records_processed`, `records_failed`, `quality_score`, `execution_notes`

Reads from `execution_history_store` (Phase 4 ETL) and provides sample executions when history is empty.

---

## Quality Monitor

Aggregates quality from ETL execution quality scores and reuses the ETL `compute_quality_score` dimension model:

- Completeness, accuracy, consistency, validity, timeliness, uniqueness
- Overall quality index and history trend
- Status bands: Excellent, Good, Warning, Critical

---

## Metrics Engine

Operational metrics:

- Total / successful / failed executions
- Average, longest, and shortest runtime
- Average quality score, records processed
- Throughput placeholder
- Success/failure rates, slowest stage, most common failure category

---

## Failure Engine

Failure taxonomy:

- `schema_error`, `validation_error`, `transformation_error`
- `warehouse_load_error`, `statistics_error`, `analytics_error`
- `forecasting_error`, `unknown_error`

Each failure includes severity, probable cause, recommendation, retry recommendation, retryable flag, and frequency.

---

## Retry Engine

Retry metadata without automatic execution:

- Retry count, retry limit, last retry
- Retry reason, recommendation, next retry placeholder
- Retryable flag and queue status

Phase 9 Airflow will orchestrate scheduled retries.

---

## Lineage Monitor

Platform lineage flow:

```text
Synthetic Data → Validation → Cleaning → Transformation → Warehouse → Statistics → Analytics → Forecasting
```

Returns graph-ready JSON (`nodes`, `edges`, `flow`). Also exposes ETL `build_pipeline_lineage` sample for warehouse table chains.

---

## Service Health

Logical health for:

- Spring Boot API, FastAPI service, PostgreSQL
- ETL engine, analytics engine, forecasting engine
- Frontend (Operations Center) and monitoring engine

Statuses: healthy, degraded, warning, down (API-normalized from Healthy/Degraded/Warning/Offline).

---

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/monitoring/overview` | Module overview |
| `GET /api/v1/monitoring/pipelines` | Registry + module status board |
| `GET /api/v1/monitoring/executions` | Tracked execution history |
| `GET /api/v1/monitoring/status` | Pipeline status snapshots |
| `GET /api/v1/monitoring/quality` | Quality summary |
| `GET /api/v1/monitoring/metrics` | Operational metrics |
| `GET /api/v1/monitoring/failures` | Failure analysis |
| `GET /api/v1/monitoring/retries` | Retry queue and history |
| `GET /api/v1/monitoring/service-health` | Service health cards |
| `GET /api/v1/monitoring/lineage` | Platform lineage graph |
| `GET /api/v1/monitoring/health` | Legacy alias for service health list |
| `POST /api/v1/monitoring/run-sample` | Unified monitoring report |

---

## Future Airflow Integration

Phase 9 will:

- Schedule pipeline runs via DAGs
- Push execution events into the execution tracker
- Drive automatic retries from retry engine metadata
- Feed DAG task status into status engine and service health

---

## Frontend Integration

`useOperationsData()` calls `POST /api/v1/monitoring/run-sample` with mock fallback. See [Operations Center](operations-center.md) for UI architecture.

---

## Testing

```bash
cd data-service-python
python -m unittest tests.test_monitoring_backend -v
```
