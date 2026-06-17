# Data Cleaning & Transformation Engine

Sprint 4.2 extends the Sprint 4.1 ETL foundation with a **production-grade Data Cleaning & Transformation Engine**. Phase 4 is now complete — see [Analytics Warehouse (Sprint 4.3)](analytics-warehouse.md) and [Enterprise Audit](enterprise-audit-phase-4.md).

---

## Architecture

```text
Raw Dataset
    ↓
Schema Validation
    ↓
Data Profiling
    ↓
Missing Value Detection
    ↓
Duplicate Detection
    ↓
Data Cleaning
    ↓
Standardization
    ↓
Normalization
    ↓
Transformation (dates, currency)
    ↓
Business Rule Validation
    ↓
Quality Scoring
    ↓
Load
    ↓
Quality Report + Audit Log
    ↓
Analytics Ready
```

**Module location:** `data-service-python/app/etl/`

| Module | Responsibility |
|--------|----------------|
| `cleaning_pipeline.py` | Orchestrates the full cleaning engine on top of 4.1 stages |
| `profiling.py` | Row/column stats, nulls, duplicates, min/max, mean, std |
| `missing_values.py` | Detect and handle nulls, empties, placeholders |
| `duplicates.py` | Exact, partial, and business-key duplicate handling |
| `standardize.py` | Store names, categories, customer names |
| `normalize.py` | Regions, prefectures, cities (Tokyo, 東京都 → Tokyo) |
| `dates.py` | Multi-format date parsing, timezone normalization, validation |
| `currency.py` | ¥1,000 / string / int → decimal |
| `business_rules.py` | Revenue ≥ cost, inventory, discount, promotion dates |
| `quality_score.py` | Completeness, consistency, validity, accuracy, uniqueness |
| `quality_report.py` | Structured JSON execution report |
| `audit_log.py` | Per-transformation audit trail with timestamps |

Sprint 4.1 modules (`extract`, `validate`, `clean`, `transform`, `load`, `report`) remain unchanged and are reused inside the cleaning pipeline.

---

## Cleaning Strategies

### Missing values

Detected types: `null`, empty string, whitespace-only, invalid placeholders (`N/A`, `null`, `-`, etc.).

| Strategy | Behavior |
|----------|----------|
| `remove_row` | Drop affected rows — counted in report, never silent |
| `mean` | Replace with column mean (numeric) |
| `median` | Replace with column median |
| `mode` | Replace with most frequent value |
| `constant` | Replace with configured constant |
| `forward_fill` | Forward-fill within column |
| `backward_fill` | Backward-fill within column |
| `mark` | Flag missing values without removal |

Configuration is extensible via `MissingValueConfig` in `missing_values.py`.

### Duplicates

| Type | Detection |
|------|-----------|
| Exact | Full row match |
| Partial | Configurable column subset |
| Business key | Primary key / entity key columns |

| Action | Behavior |
|--------|----------|
| `remove` | Drop duplicate rows |
| `keep_first` | Retain first occurrence |
| `keep_last` | Retain last occurrence |
| `mark` | Flag duplicates without removal |

---

## Normalization & Standardization

### Store names

`AEON TOKYO`, `Aeon Tokyo`, `aeon tokyo` → `AEON Tokyo`

### Product categories

`electronics`, `Electronics`, `ELECTRONICS` → `Electronics`

### Customer names

Trim spaces, normalize capitalization, normalize punctuation.

### Regions & prefectures

`Tokyo`, `TOKYO`, `tokyo`, `東京都` → `Tokyo`

Applied to prefectures, regions, and cities so downstream analytics always receive canonical values.

---

## Transformations

### Dates

Supported input formats:

- `yyyy/MM/dd`
- `yyyy-MM-dd`
- `dd/MM/yyyy`
- `MM-dd-yyyy`

Output: ISO `yyyy-MM-dd`. Invalid and future transaction dates are reported in business rule validation.

### Currency

Supports integer, decimal, and string currency (`¥1,000`, `1000`, `1000.00`) normalized to `Decimal` with configurable precision.

---

## Business Rules

| Rule | Validation |
|------|------------|
| Revenue | `unit_price >= cost_price` / `total_amount >= total_cost` |
| Inventory | `quantity_on_hand >= 0` |
| Discount | `0 <= discount_rate <= 100` |
| Transaction date | Cannot be in the future |
| Promotion | `end_date >= start_date` |

Invalid records are reported in `BusinessRuleReport` — not silently ignored.

---

## Quality Scoring

Enterprise quality dimensions (percentage scores):

| Dimension | Measures |
|-----------|----------|
| Completeness | Non-null coverage across columns |
| Consistency | Standardization and normalization success |
| Validity | Schema and business rule pass rate |
| Accuracy | Numeric range and relationship checks |
| Uniqueness | Primary key and duplicate metrics |
| Overall | Weighted composite score |

Scores are returned in API responses and embedded in the quality report JSON for future dashboard visualization.

---

## Audit Logging

Every transformation is recorded:

```text
Original:    electronics
Transformed: Electronics
Reason:      Category normalization
Timestamp:   2026-01-20T12:00:00+00:00
```

Batch operations record `rows_affected` and `reason`. The audit log is included in the quality report (`audit_log` key) and capped at 500 entries per run for API payload size.

---

## Quality Report (JSON)

The `build_quality_report()` function produces a structured object:

| Field | Description |
|-------|-------------|
| `rows_processed` | Input row count |
| `rows_cleaned` | Output row count after cleaning |
| `duplicates_removed` | Duplicate rows removed |
| `missing_values_fixed` | Missing values handled |
| `invalid_records` | Business rule violations |
| `transformations_applied` | Audit log entry count |
| `quality_score` | Dimension scores |
| `execution_time_seconds` | Pipeline duration |
| `success_rate` | Output / input percentage |
| `audit_log` | Full audit trail |
| `stage_reports` | Per-stage structured reports |

---

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/etl/overview` | Pipeline overview including cleaning stages (sprint 4.2) |
| `GET /api/v1/etl/cleaning/stages` | Ten cleaning engine stages |
| `POST /api/v1/etl/run/sample` | Run sample cleaning pipeline |
| `POST /api/v1/etl/run` | Run with `use_cleaning_engine: true` (default) |

---

## Frontend

The ETL Studio (`/etl`) displays:

- Cleaning engine execution flow (Sprint 4.2)
- ETL foundation stages (Sprint 4.1)
- Placeholder cards for profiling, missing values, duplicates, standardization, transformation, validation, quality score, and audit log

---

## Performance

The engine uses vectorized Pandas and NumPy operations. Polars and DuckDB are available for large-scale batch processing and load targets. Stages are modular so individual steps can be profiled and optimized for million-row datasets.

---

## Analytics & Forecasting Readiness

Clean, standardized, and scored datasets flow into:

- **Analytics pipeline** (Phase 5) — dimensional models and OLAP
- **Statistics engine** — hypothesis testing and regression on validated data
- **Forecasting engine** — demand models trained on consistent time series and regions

Quality scores and audit logs provide data governance metadata required for enterprise ML pipelines and regulatory traceability.

---

## Related Documentation

- [ETL Pipeline (Sprint 4.1)](etl-pipeline.md)
- [Synthetic Data Generator](synthetic-data-generator.md)
- [Architecture Guide](architecture.md)
