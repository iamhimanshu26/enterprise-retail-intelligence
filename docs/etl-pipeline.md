# Enterprise ETL Pipeline

Sprint 4.1 establishes the **modular ETL foundation** for the Enterprise Retail Intelligence & Forecasting Platform. The pipeline processes synthetic retail datasets (and future uploads) through independent, reusable stages that feed analytics, statistics, forecasting, and AI modules.

---

## Architecture

```text
Synthetic Data / Upload / API
        ↓
     Extract
        ↓
     Validate
        ↓
      Clean
        ↓
   Transform
        ↓
   Normalize
        ↓
   Aggregate
        ↓
      Load
        ↓
  Analytics Layer
        ↓
 Success Report
```

**Module location:** `data-service-python/app/etl/`

| Module | Responsibility |
|--------|----------------|
| `pipeline.py` | Orchestrates all stages end-to-end |
| `extract.py` | CSV, Excel, JSON, PostgreSQL (interface), in-memory |
| `validate.py` | Schema, types, PKs, enums, dates — structured reports |
| `clean.py` | Nulls, duplicates, trim, invalid flags — auditable changes |
| `transform.py` | Currency, dates, derived metrics, margins |
| `normalize.py` | Regions, payment methods, statuses, categories |
| `aggregate.py` | Sales by region, store, category, month |
| `load.py` | PostgreSQL (interface) and DuckDB loaders |
| `report.py` | Execution metrics, quality score, success rate |
| `config.py` | Entity schemas, pipeline settings, stage metadata |
| `exceptions.py` | Stage-specific error types |

---

## Execution Flow

1. **Extract** — Load raw data via pluggable `BaseExtractor` implementations.
2. **Validate** — Compare against `ENTITY_SCHEMAS` in `config.py`; produce `ValidationReport`.
3. **Clean** — Apply `CleanConfig` rules; track every change in `CleaningReport`.
4. **Transform** — Configurable transforms per entity (margins, currency precision, dates).
5. **Normalize** — Map aliases to canonical enum values (e.g. `kanto` → `KANTO`).
6. **Aggregate** — Build analytics-ready rollups (optional per run).
7. **Load** — Write to DuckDB (in-memory) or prepare PostgreSQL dry-run.
8. **Report** — `EtlExecutionReport` with rows processed, quality score, timing.

Each stage returns a structured report object for future dashboard visualization.

---

## Design Principles

| Principle | Implementation |
|-----------|----------------|
| **Separation** | One module per stage; no monolithic pipeline script |
| **Reusability** | Stages callable independently outside full pipeline |
| **Auditability** | Cleaning and validation track changes — no silent drops |
| **Extensibility** | `BaseExtractor` / `BaseLoader` interfaces for new sources |
| **Compatibility** | Preserves Phase 2 schemas and Phase 3 generator exports |
| **Progressive delivery** | Sprint 4.1 = architecture; execution UI expands in 4.2+ |

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
| `POST` | `/api/v1/etl/run/sample` | Execute sample in-memory pipeline |
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

Sprint 4.1 UI shows:

- Pipeline status and flow diagram
- Eight stage placeholder cards (Extract → Report)
- Metrics: stages, schemas, load targets

Interactive file upload and live execution UI planned for Sprint 4.2+.

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

- [Synthetic Data Generator](synthetic-data-generator.md)
- [Data Model](data-model.md)
- [Architecture Guide](architecture.md)
