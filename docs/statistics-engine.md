# Statistics Engine

Sprint 5.1 delivers the **Enterprise Statistics Engine Foundation** — reusable Python modules that compute descriptive, business, distribution, time-based, regional, and dataset health statistics from Phase 4 warehouse-ready retail data.

---

## Purpose

The statistics engine bridges the analytics warehouse (Phase 4) and future business intelligence, forecasting, and AI insight modules. It demonstrates:

- Python statistical computation with Pandas and NumPy
- Chart-ready structured outputs for the frontend
- Retail KPI formulas with documented definitions
- Integration with Phase 4 data quality concepts

---

## Architecture

```text
Analytics Warehouse (Phase 4)
        ↓
Statistics Engine (Phase 5.1)
        ↓
Business Metrics
        ↓
Executive Dashboard (Phase 5.2+)
        ↓
Forecasting & AI Insights (Phase 6+)
```

**Module location:** `data-service-python/app/statistics/`

| Module | Responsibility |
|--------|----------------|
| `descriptive.py` | count, sum, mean, median, mode, variance, std, quartiles, percentiles |
| `business.py` | AOV, profit margin, return rate, revenue per store/customer/product |
| `distribution.py` | Revenue, category, region, payment method distributions |
| `time_series.py` | Daily/weekly/monthly revenue, MoM growth, rolling average |
| `regional.py` | Revenue, profit, AOV, return rate by Japan region |
| `quality.py` | Dataset health aligned with Phase 4 quality engine |
| `engine.py` | Orchestrator + sample retail dataset |
| `models.py` | Pydantic response models |
| `exceptions.py` | Statistics-specific errors |

---

## Business Formulas

| Metric | Formula |
|--------|---------|
| Average Order Value | Total Revenue / Total Orders |
| Profit Margin | Gross Profit / Revenue × 100 |
| Return Rate | Returned Transactions / Total Transactions × 100 |
| Revenue per Store | Total Revenue / Unique Stores |
| Revenue per Customer | Total Revenue / Unique Customers |
| Units per Transaction | Total Quantity / Total Orders |

Placeholders (future sprints): Inventory Turnover, Customer Lifetime Value, YoY growth, fastest growing region.

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/v1/statistics/overview` | Engine modules and supported metrics |
| `GET` | `/api/v1/statistics/descriptive` | Descriptive statistics |
| `GET` | `/api/v1/statistics/business` | Business KPIs |
| `GET` | `/api/v1/statistics/distribution` | Distribution summaries |
| `GET` | `/api/v1/statistics/time-series` | Time-based revenue stats |
| `GET` | `/api/v1/statistics/regional` | Regional breakdown |
| `GET` | `/api/v1/statistics/health` | Dataset health metrics |
| `POST` | `/api/v1/statistics/run-sample` | Unified statistics report |

---

## Data Flow

1. **Sample data** — `generate_sample_retail_data()` creates 500 representative transactions
2. **Warehouse data** — If `fact_sales` / `dim_store` loaded via ETL, engine reads from `get_warehouse_loader()`
3. **Computation** — Independent modules run on the same DataFrame
4. **Report** — `StatisticsEngine.run()` returns `UnifiedStatisticsReport`
5. **Frontend** — Statistics Lab at `/statistics` displays metrics and formula reference

---

## Libraries

| Library | Usage |
|---------|--------|
| **Pandas** | Primary DataFrame operations |
| **NumPy** | Sample data generation, numeric arrays |
| **Polars** | Optional categorical aggregation path |
| **DuckDB** | Available via warehouse loader |
| **Pydantic** | API models and validation |

---

## Frontend

**Route:** `/statistics` — Statistics Lab

Components:

- `StatsMetricCard` / `StatsMetricGrid` — KPI display
- `DistributionSummaryCard` — distribution buckets
- `RegionalStatsCard` — regional table
- `TimeSeriesStatsCard` — monthly revenue trends
- `DatasetHealthCard` — quality integration
- `MetricFormulaPanel` — formula reference

---

## Future Integration

| Phase | Integration |
|-------|-------------|
| Sprint 5.3 | Executive Intelligence Platform consumes analytics report for executive dashboard |
| Phase 6 | Visualization platform charts from analytics breakdown outputs |
| Phase 7 | Forecasting consumes time-series statistics and sales analytics |
| Phase 11 | AI insights explain business metric anomalies |

---

## Related Documentation

- [Analytics Warehouse](analytics-warehouse.md)
- [Executive Intelligence Platform](executive-intelligence.md)
- [ETL Pipeline](etl-pipeline.md)
