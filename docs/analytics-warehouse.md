# Analytics Warehouse

Sprint 4.3 completes Phase 4 with an **Analytics Warehouse Layer** that loads cleaned, transformed retail data into a star schema optimized for analytics, forecasting, and business intelligence.

---

## Architecture

```text
Operational Data (Phase 2 schema)
        ↓
   ETL Pipeline (4.1–4.3)
        ↓
   Transformation & Cleaning
        ↓
   Analytics Warehouse (star schema)
        ↓
   Business Analytics & Executive Intelligence (Phase 5 ✅)
        ↓
   Data Visualization Platform (Phase 6 ✅)
        ↓
   Forecasting (Phase 7 🚀)
        ↓
   AI Insights (Phase 11)
```

**Module location:** `data-service-python/app/etl/`

| Module | Responsibility |
|--------|----------------|
| `warehouse.py` | Star schema tables, DuckDB/PostgreSQL loaders, summary API |
| `load_engine.py` | Full, incremental, append, replace strategies with row tracking |
| `enterprise_pipeline.py` | Full Phase 4 orchestrator (cleaning + warehouse + lineage) |
| `lineage.py` | Dataset lineage graph metadata |
| `execution_history.py` | In-memory execution history (PostgreSQL in future) |
| `metrics.py` | Throughput, timing, resource placeholders |

---

## Star Schema

```text
              dim_store
                   |
dim_customer --- fact_sales --- dim_product
                   |
              dim_date
                   |
             dim_supplier
```

### Why star schema?

- **Query performance** — analytics queries join facts to a small number of denormalized dimensions
- **Simplicity** — business users and BI tools understand fact/dimension relationships
- **Aggregation** — pre-joined dimensions enable fast rollups by region, category, date
- **Separation** — operational OLTP schema (Phase 2) stays normalized; warehouse is analytics-optimized

### Warehouse tables

| Table | Type | Description |
|-------|------|-------------|
| `fact_sales` | Fact | Sales transactions with amounts, quantities, dates |
| `fact_returns` | Fact | Return transactions |
| `dim_store` | Dimension | Store attributes (region, prefecture, type) |
| `dim_product` | Dimension | Product attributes (category, price) |
| `dim_customer` | Dimension | Customer demographics |
| `dim_supplier` | Dimension | Supplier information |
| `dim_date` | Dimension | Date keys for time-series analytics |

---

## Load Strategies

| Strategy | Behavior |
|----------|----------|
| `full` | Replace entire table with new dataset |
| `incremental` | Insert new keys, update existing keys |
| `append` | Add rows to existing table |
| `replace` | Drop and recreate table |

### Row tracking

Every load reports:

- `inserted` — new rows added
- `updated` — existing rows modified
- `skipped` — rows not changed
- `failed` — rows that failed validation

---

## Execution History

Each pipeline run records:

| Field | Description |
|-------|-------------|
| `pipeline_id` | Unique run identifier |
| `start_time` / `end_time` | Execution timestamps |
| `duration_seconds` | Total runtime |
| `status` | `success` or `failed` |
| `processed_rows` | Input row count |
| `failed_rows` | Rows that failed validation |
| `quality_score` | Data Quality Index |

**API:** `GET /api/v1/etl/history`

Future versions will persist to PostgreSQL for long-term audit and scheduler integration.

---

## Data Lineage

Example lineage chain:

```text
sales.csv → validation → cleaning → normalization → transformation → aggregation → fact_sales
```

Structured metadata includes `nodes`, `edges`, and `flow` arrays for UI visualization.

**API:** `GET /api/v1/etl/lineage/sample`

---

## Quality Metrics

Six enterprise dimensions plus Data Quality Index (DQI):

| Dimension | Measures |
|-----------|----------|
| Completeness | Non-null coverage |
| Accuracy | Numeric and relationship correctness |
| Consistency | Standardization success |
| Validity | Schema and business rule pass rate |
| Timeliness | Date freshness and future-date checks |
| Uniqueness | Primary key and duplicate metrics |

**DQI** = weighted average of all six dimensions.

**API:** `GET /api/v1/etl/quality/dashboard`

---

## Warehouse Summary

Enterprise-scale summary statistics for dashboard display:

| Entity | Representative scale |
|--------|---------------------|
| Stores | 500 |
| Products | 120,000 |
| Customers | 2,000,000 |
| Sales | 15,000,000 |
| Returns | 120,000 |

**API:** `GET /api/v1/etl/warehouse/summary`

---

## API Endpoints (Sprint 4.3)

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/etl/warehouse/summary` | Warehouse row counts |
| `GET /api/v1/etl/history` | Execution history |
| `GET /api/v1/etl/lineage/sample` | Sample lineage graph |
| `GET /api/v1/etl/quality/dashboard` | Quality dimensions + DQI |
| `POST /api/v1/etl/run/sample` | Full enterprise pipeline run |

---

## Future Warehouse Targets

`BaseWarehouseLoader` interface supports extension to:

- Snowflake
- BigQuery
- Amazon Redshift
- Databricks

No changes to star schema or load engine required — only new loader implementations.

---

## Related Documentation

- [ETL Pipeline (Sprint 4.1)](etl-pipeline.md)
- [Data Cleaning Engine (Sprint 4.2)](data-cleaning-engine.md)
- [Enterprise Audit (Phase 4)](enterprise-audit-phase-4.md)
- [Architecture Guide](architecture.md)
