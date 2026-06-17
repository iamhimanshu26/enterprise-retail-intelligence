# Operations Center

Phase 8.2 delivers the **Pipeline Operations Center** at `/pipeline` — an enterprise monitoring console for pipeline health, execution history, data quality, failures, retries, lineage, and service health.

---

## Architecture

```text
frontend/src/features/monitoring/
├── pages/OperationsCenter.tsx
├── components/
│   ├── OperationalKpiSummary.tsx
│   ├── PipelineStatusBoard.tsx
│   ├── ExecutionHistoryDashboard.tsx
│   ├── DataQualityCenter.tsx
│   ├── PipelineMetricsDashboard.tsx
│   ├── FailureAnalysisCenter.tsx
│   ├── RetryManagementDashboard.tsx
│   ├── LineageVisualization.tsx
│   └── ServiceHealthDashboard.tsx
├── adapters/operationsAdapter.ts
├── mock/monitoringMock.ts
└── hooks/useOperationsData.ts
```

Backend: `data-service-python/app/monitoring/` with `/api/v1/monitoring/*` endpoints.

---

## Monitoring Flow

```text
Pipeline Execution → Execution Tracking → Quality Monitoring
        → Failure Analysis → Retry Management → Operations Center → Future Airflow
```

---

## Sections

| Section | Purpose |
|---------|---------|
| Executive Monitoring Overview | Total runs, success/fail counts, platform health |
| Pipeline Status Board | 8 platform modules with status, duration, quality |
| Execution History | Run ID, pipeline, timing, status, trigger source |
| Data Quality Center | 6 dimensions + quality history chart |
| Pipeline Metrics | Success rate, throughput, slowest stage |
| Failure Analysis | Category/severity charts + remediation table |
| Retry Management | Queue, recommendations, retryable flags |
| Lineage Visualization | Synthetic → Forecasting flow with node tooltips |
| Service Health | Green/yellow/red indicators for 7 services |

---

## Quality Metrics

Completeness, Accuracy, Consistency, Validity, Timeliness, Uniqueness, Overall Quality Index.

---

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/monitoring/overview` | Engine overview |
| `GET /api/v1/monitoring/pipelines` | Module status board |
| `GET /api/v1/monitoring/executions` | Execution history |
| `GET /api/v1/monitoring/quality` | Quality center |
| `GET /api/v1/monitoring/metrics` | Pipeline metrics |
| `GET /api/v1/monitoring/failures` | Failure analysis |
| `GET /api/v1/monitoring/retries` | Retry queue |
| `GET /api/v1/monitoring/lineage` | Platform lineage |
| `GET /api/v1/monitoring/health` | Service health |
| `POST /api/v1/monitoring/run-sample` | Unified monitoring report |

---

## Related Documentation

- [Pipeline Monitoring Engine](pipeline-monitoring.md)
- [ETL Pipeline](etl-pipeline.md)
- [Phase Plan](phase-plan.md)
