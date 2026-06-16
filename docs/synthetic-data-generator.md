# Synthetic Retail Data Generator

Phase 3 delivers an enterprise-scale **Synthetic Retail Data Generator** for the Enterprise Retail Intelligence & Forecasting Platform. Generated datasets feed future ETL pipelines, analytics, statistics, forecasting, and AI insight engines.

---

## Architecture

```text
React Generator Dashboard (/generator)
        │
        ▼ HTTPS REST
FastAPI /api/v1/generator
        │
        ▼
GenerationEngine (background thread)
        │
        ├── stores.py · products.py · customers.py · suppliers.py
        ├── inventory.py · promotions.py · sales.py · returns.py
        ├── validation.py (data quality injection)
        └── export.py (CSV · JSON · Excel)
```

The generator runs **in-process background jobs** with progress polling. Datasets are held in memory per job for preview and export. Future phases will persist jobs and bulk loads to PostgreSQL.

**Module location:** `data-service-python/app/generator/`

| Module | Responsibility |
|--------|----------------|
| `engine.py` | Orchestrates generation pipeline and summary |
| `job_manager.py` | Background jobs, progress, preview, export |
| `stores.py` | Store locations across Japan regions |
| `products.py` | Product catalog with pricing and popularity |
| `customers.py` | Customer profiles and membership tiers |
| `suppliers.py` | Supplier master data |
| `inventory.py` | Per-store stock levels (auto: stores × products, capped) |
| `promotions.py` | Campaigns with regional and category targeting |
| `sales.py` | Transactions and line items with demand simulation |
| `returns.py` | Return transactions linked to sales |
| `validation.py` | Missing, duplicate, invalid, outlier, null injection |
| `export.py` | CSV, JSON, Excel export (Parquet placeholder) |

---

## Libraries

| Library | Role |
|---------|------|
| **Faker** (`ja_JP`) | Realistic Japanese names, addresses, companies, emails |
| **NumPy** | Weighted sampling, popularity scores, demand multipliers |
| **Pandas** | Tabular datasets, preview, export |
| **openpyxl** | Excel (XLSX) workbook export |
| **FastAPI** | REST API, background generation, file downloads |

---

## Generation Strategy

1. **Suppliers** — vendor master with reliability scores
2. **Stores** — weighted by Japanese regional population (Kanto ~36%, Kansai ~18%, etc.)
3. **Products** — categorized catalog with unit/cost pricing and optional supplier link
4. **Customers** — membership tiers, demographics, regional spread
5. **Inventory** — store × product cross (full grid up to 1M rows, sampled beyond)
6. **Promotions** — time-bounded campaigns with category/region targeting
7. **Sales** — chunked transaction generation with line items
8. **Returns** — sampled from sales line items
9. **Data quality** — configurable defect injection on all entities

### Simulation engine

| Option | Effect |
|--------|--------|
| Start / end date | Transaction and promotion date ranges |
| Seasonal demand | Sinusoidal monthly demand multiplier |
| Weekend sales boost | Elevated weekend transaction volume |
| Holiday sales boost | December/January uplift |
| Promotion impact | Category-matched active promotion boost |
| Regional distribution | Population-weighted store/customer regions |
| Store / product popularity | Beta-distributed popularity weights for sales sampling |

### Data quality simulation

Configurable percentages for missing values, duplicate rows, invalid records, outliers, and null values — designed for Phase 4 ETL validation testing.

---

## Supported Entities

| Entity | Config range | Notes |
|--------|--------------|-------|
| Stores | 1 – 500 | 9 Japan regions |
| Products | 100 – 100,000 | Categories and brands |
| Customers | 100 – 1,000,000 | Membership tiers |
| Suppliers | 10 – 10,000 | Reliability scoring |
| Sales transactions | 1,000 – 10,000,000 | With line items |
| Promotions | 0 – 5,000 | Optional |
| Returns | 0 – 1,000,000 | Linked to sales |
| Inventory | Auto | `stores × products` (max 1M) |

Aligns with Phase 2 PostgreSQL schema in `retail` schema (`docs/data-model.md`).

---

## Export Formats

| Format | Phase 3 | Notes |
|--------|---------|-------|
| CSV | ✅ | Per-entity or combined |
| JSON | ✅ | Records array |
| Excel (XLSX) | ✅ | Multi-sheet for `all` export |
| Parquet | 🔒 Phase 4 | Placeholder response |

Downloads are served from FastAPI with `Content-Disposition` for local browser download.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/generator/defaults` | Default configuration |
| `POST` | `/api/v1/generator/start` | Start background job |
| `GET` | `/api/v1/generator/jobs` | List jobs |
| `GET` | `/api/v1/generator/jobs/{id}` | Job status and summary |
| `GET` | `/api/v1/generator/jobs/{id}/preview/{entity}` | Sample rows |
| `GET` | `/api/v1/generator/jobs/{id}/export/{entity}/{format}` | Download file |

---

## Frontend

**Route:** `/generator`

**Components** (`frontend/src/features/generator/components/`):

- `ConfigurationPanel` — entity volumes, simulation, data quality
- `ProgressCard` — progress bar, elapsed/remaining time
- `PreviewTable` — sample rows per entity
- `DatasetCard` / `SummaryCard` — record counts and regional stats
- `ExportPanel` — format and entity selection
- `GenerationHistoryPanel` — localStorage history

Uses the existing enterprise design system (`SectionContainer`, `PageHeader`, `DataTable`, `ActionToolbar`).

---

## Future ETL Usage (Phase 4+)

1. Export CSV/JSON/Excel from the generator dashboard
2. ETL pipeline ingests files with schema validation against `retail` tables
3. Data quality defects exercise validation rules (missing, duplicates, outliers)
4. Normalized load into PostgreSQL `retail` schema
5. Analytics and dashboard layers replace mock data

Direct PostgreSQL bulk insert from the generator API is planned as an optional Phase 4 enhancement.

---

## Local Development

**Python:** 3.12 recommended (matches Docker). Use `pyenv` or see `.python-version`.

```bash
# Install & verify (from repo root)
chmod +x scripts/verify-generator.sh
./scripts/verify-generator.sh

# Or manually
cd data-service-python
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python scripts/verify_generator.py
uvicorn app.main:app --reload --port 8000
```

Open http://localhost:5173/generator (login required). Ensure `VITE_DATA_SERVICE_URL` points to `http://localhost:8000`.

---

## Related Documentation

- [Data Model](data-model.md)
- [Architecture Guide](architecture.md)
- [Development Phase Plan](phase-plan.md)
