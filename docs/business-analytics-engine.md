# Business Analytics Engine

Sprint 5.2 delivers the **Business Analytics Engine** — a reusable Python layer that converts Sprint 5.1 statistics outputs and warehouse-ready retail data into enterprise KPIs, performance scores, rankings, and operational analytics.

---

## Purpose

- Transform statistical and transactional data into **retail business intelligence**
- Provide **API-ready analytics modules** for executive dashboards and intelligence pages
- Demonstrate **formula-based performance scoring** without ML
- Prepare outputs for Phase 6 visualization and Phase 7 forecasting

---

## Architecture

```text
Analytics Warehouse
        ↓
Statistics Engine (Sprint 5.1)
        ↓
Business Analytics Engine (Sprint 5.2)
        ↓
Executive Dashboard + Intelligence Pages
        ↓
Forecasting & AI Insights (future)
```

### Module layout

```text
data-service-python/app/analytics/
├── data.py              # Sample + warehouse data loading
├── models.py            # Pydantic API models
├── exceptions.py        # Analytics errors
├── kpi.py               # Enterprise KPIs
├── sales_analytics.py   # Revenue breakdowns & trends
├── store_analytics.py   # Store rankings & performance
├── product_analytics.py # Product contribution & returns
├── customer_analytics.py# Segments, CLV placeholder
├── inventory_analytics.py # Stock risk & reorder
├── supplier_analytics.py  # Supplier reliability
├── promotion_analytics.py # Promotion impact
├── performance_score.py   # Formula-based scores
└── engine.py              # Orchestrator
```

The orchestrator `BusinessAnalyticsEngine.run()` returns a unified `BusinessAnalyticsReport`.

---

## KPIs

| KPI | Description |
|-----|-------------|
| Total Revenue | Sum of transaction revenue |
| Total Profit | Sum of profit |
| Gross Margin | Gross profit / revenue × 100 |
| Net Sales | Revenue minus refunds (placeholder) |
| Total Orders | Transaction count |
| Average Order Value | Revenue / orders |
| Units Sold | Sum of quantity |
| Active Customers | Unique customer_id count |
| Active Stores | Unique store_code count |
| Return Rate | From statistics business metrics |
| Discount Rate | From statistics business metrics |
| Sales Growth | Half-period revenue comparison |
| Profit Growth | Half-period profit comparison |
| Inventory Value | stock_on_hand × unit_cost |
| Stock Risk Count | Items at or below reorder level |

---

## Formulas

| Metric | Formula |
|--------|---------|
| Gross Margin | Gross Profit / Revenue × 100 |
| Average Order Value | Revenue / Orders |
| Store Performance Score | 40% revenue + 30% profit + 20% orders + 10% AOV (normalized) |
| Product Performance Score | 40% revenue + 35% units + 25% profit (normalized) |
| Inventory Risk Score | Weighted by low/out-of-stock ratio across catalog |
| Supplier Risk Score | 100 − reliability score (revenue-based placeholder) |
| CLV Placeholder | average_spend × purchase_frequency × 1.2 |

---

## Scoring Models

All scores are **explainable and formula-based** — no machine learning.

- **Store Performance Score** — normalized composite of revenue, profit, order volume, and AOV
- **Product Performance Score** — revenue, units sold, and profit contribution
- **Customer Segment Score** — spend and frequency heuristic
- **Inventory Risk Score** — stock status vs reorder levels and velocity
- **Supplier Risk Score** — inverse of reliability placeholder

---

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/analytics/overview` | Engine overview and module list |
| `GET /api/v1/analytics/kpis` | Enterprise KPI metrics |
| `GET /api/v1/analytics/sales` | Sales breakdowns and trends |
| `GET /api/v1/analytics/stores` | Store rankings |
| `GET /api/v1/analytics/products` | Product rankings |
| `GET /api/v1/analytics/customers` | Customer segmentation |
| `GET /api/v1/analytics/inventory` | Inventory risk analytics |
| `GET /api/v1/analytics/suppliers` | Supplier rankings |
| `GET /api/v1/analytics/promotions` | Promotion impact |
| `POST /api/v1/analytics/run-sample` | Full unified report |

All responses use the standard `ApiResponse` wrapper.

---

## Frontend Usage

| Route | Page |
|-------|------|
| `/sales` | Sales Intelligence |
| `/inventory` | Inventory Intelligence |
| `/customers` | Customer Analytics |
| `/suppliers` | Supplier Analytics |
| `/` | Executive Dashboard — Business Analytics KPI section |

Client helpers live in `frontend/src/lib/dataServiceApi.ts`. Types in `frontend/src/types/analytics.ts`. Shared hook: `useBusinessAnalytics`.

Intelligence pages include:

- KPI grids and breakdown tables
- Ranking tables for stores, products, suppliers
- Performance score panels
- Formula & explanation cards

---

## Future Forecasting Integration

Phase 7 forecasting will consume:

- Time-series outputs from `sales_analytics` (daily/monthly revenue)
- Product velocity from `product_analytics` and `inventory_analytics`
- Store performance scores from `performance_score`
- Statistics Engine time-series and distribution modules

The Business Analytics Engine remains the **semantic BI layer** between raw statistics and forecast features.

---

## Related Documentation

- [Statistics Engine](statistics-engine.md)
- [Analytics Warehouse](analytics-warehouse.md)
- [Architecture](architecture.md)
- [Phase Plan](phase-plan.md)
