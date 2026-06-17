# Enterprise ETL Pipeline

Sprint 4.1 establishes the **modular ETL foundation** for the Enterprise Retail Intelligence & Forecasting Platform. Sprint 4.2 adds the cleaning engine; Sprint 4.3 completes Phase 4 with the analytics warehouse.

## Sprint Status

- ✅ Sprint 4.1 — ETL Foundation & Pipeline Framework
- ✅ Sprint 4.2 — Data Cleaning & Transformation Engine
- ✅ Sprint 4.3 — Analytics Warehouse & Data Quality Platform
- ✅ Phase 4 — Python ETL & Data Engineering Pipeline Completed

---

## Complete Pipeline (Phase 4)

```text
Synthetic Data / Upload / API
        ↓
     Extract
        ↓
     Validate
        ↓
     Profile
        ↓
      Clean
        ↓
   Normalize
        ↓
   Transform
        ↓
 Business Rules
        ↓
   Aggregate
        ↓
      Load
        ↓
 Analytics Warehouse
        ↓
 Data Lineage · Execution History · Quality Score · Metrics
        ↓
 Analytics Ready (Phase 5)
```

### Stage capabilities

| Stage | Module(s) | Output |
|-------|-----------|--------|
| **Extract** | `extract.py` | Raw DataFrame from CSV, Excel, JSON, PostgreSQL interface, memory |
| **Validate** | `validate.py` | Schema, types, PKs, enums — `ValidationReport` |
| **Profile** | `profiling.py` | Row/column stats, nulls, distributions — `ProfilingReport` |
| **Clean** | `clean.py`, `missing_values.py`, `duplicates.py` | Tracked cleaning with audit trail |
| **Normalize** | `normalize.py`, `standardize.py` | Regions, prefectures, store names, categories |
| **Transform** | `transform.py`, `dates.py`, `currency.py` | Dates, currency, derived metrics |
| **Business rules** | `business_rules.py` | Revenue, inventory, discount, date validation |
| **Aggregate** | `aggregate.py` | Sales by region, store, category, month |
| **Load** | `load.py`, `load_engine.py` | Full, incremental, append, replace strategies |
| **Analytics warehouse** | `warehouse.py` | Star schema: `fact_sales`, `dim_store`, etc. |
| **Lineage** | `lineage.py` | Structured dataset movement metadata |
| **Execution history** | `execution_history.py` | Pipeline runs with timing and quality score |
| **Quality scoring** | `quality_score.py` | Six dimensions + Data Quality Index |
| **Metrics** | `metrics.py` | Throughput, execution time, resource placeholders |
| **Reporting** | `quality_report.py`, `report.py` | JSON execution and quality reports |

Orchestrators: `pipeline.py` (4.1), `cleaning_pipeline.py` (4.2), `enterprise_pipeline.py` (4.3 full flow).

---

## Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Separation** | One module per stage; no monolithic pipeline script |
| **Reusability** | Stages callable independently outside full pipeline |
| **Auditability** | Cleaning and validation track changes — no silent drops |
| **Extensibility** | `BaseExtractor` / `BaseLoader` interfaces for new sources |
| **Compatibility** | Preserves Phase 2 schemas and Phase 3 generator exports |
| **Progressive delivery** | Sprints 4.1–4.3 delivered incrementally; Phase 4 complete |

---

## Supported Entities (Sprint 4.1)

| Entity | Primary key | Validation focus |
|--------|-------------|------------------|
| `stores` | `store_code` | Japan regions, store types, dates |
| `products` | `product_code` | Pricing numerics, status enums |
| `sales_transactions` | `transaction_code` | Payment methods, amounts, dates |

Additional entities from Phase 2 schema will plug into the same pattern.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/etl/overview` | Pipeline flow, stages, supported sources/targets |
| `GET` | `/api/v1/etl/stages` | Stage metadata for UI |
| `GET` | `/api/v1/etl/schemas` | Entity validation schemas |
| `GET` | `/api/v1/etl/config/defaults` | Default `PipelineConfig` |
| `GET` | `/api/v1/etl/cleaning/stages` | Cleaning engine stages |
| `GET` | `/api/v1/etl/warehouse/summary` | Warehouse row counts |
| `GET` | `/api/v1/etl/history` | Execution history |
| `GET` | `/api/v1/etl/lineage/sample` | Sample lineage graph |
| `GET` | `/api/v1/etl/quality/dashboard` | Quality dimensions + DQI |
| `POST` | `/api/v1/etl/run/sample` | Execute full enterprise sample pipeline |
| `POST` | `/api/v1/etl/run` | Execute pipeline with config |

---

## Libraries

| Library | Usage |
|---------|--------|
| **Pandas** | Primary tabular processing across all stages |
| **NumPy** | Numeric transforms and margin calculations |
| **Polars** | Available for future high-performance transforms |
| **DuckDB** | In-memory analytics load target |
| **Pydantic** | Pipeline configuration and API schemas |

---

## Extension Strategy

### New data sources

Implement `BaseExtractor` and register in `extract.py` `_EXTRACTORS` map.

### New load targets

Implement `BaseLoader` and register in `load.py` `_LOADERS` map.

### New entities

Add schema to `ENTITY_SCHEMAS` in `config.py` — validation auto-applies.

### Generator integration

Export CSV/JSON/Excel from `/generator` → pass bytes to `extract_data(SourceFormat.CSV, content=...)`.

### Future analytics

Aggregation outputs (`sales_by_region`, etc.) are designed as DataFrames ready for REST APIs and dashboard replacement of mock data.

---

## Frontend

**Route:** `/etl` — ETL Pipeline Studio

The studio includes:

- Enterprise ETL flow diagram (Phase 4 complete)
- Run Sample Pipeline execution
- Data Quality Index and six quality dimensions
- Warehouse summary and analytics warehouse cards
- Data lineage flow and execution history table
- Pipeline metrics (throughput, timing)
- Cleaning engine stages (Sprint 4.2) and foundation stages (Sprint 4.1)

---

## Local Development

```bash
cd data-service-python
source .venv/bin/activate
pip install -r requirements.txt
python scripts/verify_generator.py   # includes ETL smoke tests
uvicorn app.main:app --reload --port 8000
```

Test sample pipeline:

```bash
curl -X POST http://localhost:8000/api/v1/etl/run/sample
```

---

## Related Documentation

- [Data Cleaning Engine (Sprint 4.2)](data-cleaning-engine.md)
- [Analytics Warehouse (Sprint 4.3)](analytics-warehouse.md)
- [Synthetic Data Generator](synthetic-data-generator.md)
- [Data Model](data-model.md)
- [Enterprise Audit (Phase 4)](enterprise-audit-phase-4.md)
- [Architecture Guide](architecture.md)
