# Interactive Analytics Dashboards

Sprint 6.2 extends the **Enterprise Visualization Framework** (Sprint 6.1) into eight professional interactive analytics dashboards. Each dashboard connects statistics, business analytics, executive intelligence, and ETL quality outputs through a shared adapter layer — no hardcoded chart data inside components.

---

## Dashboard Architecture

```text
Statistics Engine
        ↓
Business Analytics Engine
        ↓
Executive Intelligence Engine
        ↓
ETL Quality API
        ↓
Visualization Adapter Layer (dashboardAdapters.ts)
        ↓
useInteractiveDashboardData hook
        ↓
Client-side filter scaling (filterChartData.ts)
        ↓
Interactive Dashboard Views
```

### Module layout

```text
frontend/src/features/visualization/
├── adapters/
│   ├── chartAdapters.ts          # Base mappers (Sprint 6.1)
│   ├── dashboardAdapters.ts      # Dashboard-specific bundles
│   └── filterChartData.ts        # Client-side filter placeholders
├── dashboard/                    # Shared layout components
│   ├── AnalyticsDashboardLayout
│   ├── DashboardFilterPanel
│   ├── DashboardExportToolbar
│   ├── InsightSummaryPanel
│   ├── ChartGrid / ChartSection
│   ├── VisualizationMetricCard
│   └── DashboardEmptyState
├── dashboards/                   # Eight dashboard views
└── hooks/
    └── useInteractiveDashboardData.ts
```

---

## Supported Dashboards

| Dashboard | Route | Data sources |
|-----------|-------|--------------|
| Sales Analytics | `/sales` | Business analytics — sales breakdowns |
| Inventory Analytics | `/inventory` | Business analytics — inventory module |
| Customer Analytics | `/customers` | Analytics + statistics time series |
| Supplier Analytics | `/suppliers` | Business analytics — supplier rankings |
| Product Analytics | `/products` | Business analytics — product performance |
| Regional Analytics | `/regional` | Statistics regional + sales by store |
| ETL Quality | `/etl-quality` | Quality dashboard + execution history |
| Executive Intelligence | `/executive-intelligence` | Executive intelligence report |

Existing routes (`/sales`, `/inventory`, `/customers`, `/suppliers`) remain unchanged. New routes were added for product, regional, ETL quality, and executive intelligence dashboards.

---

## Chart Adapter Strategy

`dashboardAdapters.ts` transforms API responses into `ChartSeriesPoint[]` and structured table data:

| Builder | Output |
|---------|--------|
| `buildSalesDashboard` | Revenue trend, regional/category breakdowns, store comparison |
| `buildInventoryDashboard` | Stock risk, movement, reorder candidates |
| `buildCustomerDashboard` | Growth, segments, membership tiers |
| `buildSupplierDashboard` | Reliability, risk, contribution |
| `buildProductDashboard` | Top products, returns, profit distribution |
| `buildRegionalDashboard` | Japanese regional performance |
| `buildEtlQualityDashboard` | Quality dimensions, failed records, duration |
| `buildExecutiveDashboard` | Health score, KPI status, benchmarks, anomalies |
| `buildInteractiveDashboardBundle` | Full bundle for `useInteractiveDashboardData` |

Chart components never import raw API types — they consume adapter output only.

---

## Reusable Components

| Component | Purpose |
|-----------|---------|
| `AnalyticsDashboardLayout` | Page header, breadcrumb, filters, export toolbar, loading skeleton |
| `DashboardFilterPanel` | Date range, region, store, category filters (reuses `FilterToolbar`) |
| `DashboardExportToolbar` | Refresh and export placeholders |
| `InsightSummaryPanel` | Summary tags above chart sections |
| `ChartGrid` / `ChartSection` | Responsive section layout |
| `VisualizationMetricCard` | KPI metric cards |
| `DashboardEmptyState` | Empty state for missing data |

All dashboards reuse Sprint 6.1 chart primitives (`EnterpriseLineChart`, `TrendChartCard`, etc.).

---

## Interactivity (API-ready placeholders)

Every dashboard supports:

- Date range filter (`7d`, `30d`, `90d`, `ytd`)
- Region filter
- Category filter (where relevant)
- Refresh placeholder (`onRefresh` via TanStack Query)
- Export placeholder (`DashboardExportToolbar`)
- Chart fullscreen placeholder (`ChartToolbar`)
- Tooltips and legends (chart components)
- Empty and loading states (`ChartCard`, `AnalyticsDashboardLayout`)

`filterChartData.ts` applies client-side scaling until backend filtering is wired. Filter state lives in `useDashboardStore` and is included in the `useInteractiveDashboardData` query key.

---

## Data Source Strategy

`useInteractiveDashboardData` fetches in parallel:

1. `runAnalyticsSample()` — business analytics report
2. `runStatisticsSample()` — unified statistics report
3. `runExecutiveIntelligenceSample()` — executive intelligence report
4. `getQualityDashboard()` — ETL quality scores
5. `getExecutionHistory(10)` — pipeline execution records

When the data service is unavailable, TanStack Query surfaces errors via `ErrorState` on each dashboard.

---

## Future Backend Integration

1. Replace sample endpoints with filtered analytics APIs (`?dateRange=&region=&category=`)
2. Move `applyDashboardFilters` logic server-side; keep adapter shape stable
3. Add real-time refresh via WebSocket or polling on execution history
4. Wire export toolbar to CSV/PNG generation endpoints

---

## Future Forecasting Visualization Support

Phase 7 forecasting will:

- Extend `dashboardAdapters` with forecast series on trend charts
- Add projected bands to `TrendChartCard` on Sales and Regional dashboards
- Reuse `useInteractiveDashboardData` with a forecast query branch

No forecasting logic is implemented in Sprint 6.2.

---

## Related Documentation

- [Visualization Framework](visualization-framework.md)
- [Business Analytics Engine](business-analytics-engine.md)
- [Executive Intelligence Platform](executive-intelligence.md)
- [Statistics Engine](statistics-engine.md)
- [ETL Pipeline](etl-pipeline.md)
- [Executive Visualization Studio](executive-visualization-studio.md)
