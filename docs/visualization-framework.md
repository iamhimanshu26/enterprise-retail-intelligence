# Enterprise Visualization Framework

Sprint 6.1 establishes the **Enterprise Data Visualization Framework** — reusable chart infrastructure, centralized theming, data adapters, and a Visualization Studio for all future analytical experiences.

---

## Architecture

```text
Analytics Warehouse
        ↓
Statistics Engine
        ↓
Business Analytics
        ↓
Executive Intelligence
        ↓
Visualization Framework (Sprint 6.1)
        ↓
Interactive Analytics Dashboards (Sprint 6.2)
        ↓
Forecasting (Phase 7)
        ↓
AI Insights (Phase 11)
```

### Module layout

```text
frontend/src/features/visualization/
├── charts/           # Recharts-based chart primitives
├── containers/       # ChartCard, toolbar, legend, section wrappers
├── dashboard/        # Shared analytics dashboard layout (Sprint 6.2)
├── dashboards/       # Eight interactive dashboard views (Sprint 6.2)
├── hooks/            # useChartData, useInteractiveDashboardData
├── adapters/         # chartAdapters, dashboardAdapters, filterChartData
├── utils/            # chartTheme, chartFormatter
└── pages/            # VisualizationStudio
```

---

## Chart System

Built on **Recharts 3.x**. Supported chart types:

| Component | Type |
|-----------|------|
| `EnterpriseLineChart` | Line |
| `EnterpriseBarChart` | Bar / horizontal bar |
| `EnterpriseAreaChart` | Area |
| `EnterprisePieChart` | Pie |
| `EnterpriseDonutChart` | Donut |
| `EnterpriseStackedBarChart` | Stacked bar |
| `EnterpriseHeatMap` | Grid heat map |
| `EnterpriseScatterPlot` | Scatter |

Each chart supports loading/empty via `ChartCard`, tooltips, legends, responsive layout, and export placeholders.

---

## Reusable Components

| Component | Purpose |
|-----------|---------|
| `ChartCard` | Title, subtitle, toolbar, loading/empty states |
| `ChartToolbar` | Refresh, export, fullscreen, filter, settings placeholders |
| `MetricChartCard` | KPI metric + chart |
| `TrendChartCard` | Time-series wrapper |
| `DistributionChartCard` | Distribution breakdown |
| `ComparisonChartCard` | Comparative analysis |
| `VisualizationSection` | Section grid layout |

Existing `ChartContainer` in `components/analytics/` remains for legacy dashboard charts.

---

## Theming

Centralized in `utils/chartTheme.ts`:

- Enterprise oklch color palette
- Axis, grid, legend, tooltip styles via CSS variables
- Automatic light/dark inheritance from design tokens
- Shared margins, bar radius, stroke widths

---

## Data Adapters

UI remains independent of backend shape. Adapters in `adapters/chartAdapters.ts`:

| Source | Adapter |
|--------|---------|
| `AnalyticsBreakdownRow` | `breakdownToChartData` |
| `TimeSeriesPoint` | `timeSeriesToChartData` |
| `DistributionBucket` | `distributionToChartData` |
| `RegionalStatRow` | `regionalToChartData` |
| KPI metrics | `kpiToChartData` |

`useChartData` composes `runAnalyticsSample()` + `runStatisticsSample()` for Visualization Studio.

`useInteractiveDashboardData` composes analytics, statistics, intelligence, and ETL quality for interactive dashboards. See [Interactive Analytics Dashboards](interactive-analytics-dashboards.md).

---

## Visualization Strategy

1. **Sprint 6.1** — Framework, theme, adapters, Visualization Studio ✅
2. **Sprint 6.2** — Interactive analytics dashboards across sales, inventory, customer, supplier, product, regional, ETL, executive ✅
3. **Sprint 6.3+** — Advanced interactions, export, fullscreen
4. **Phase 7** — Forecasting overlays on trend charts

---

## API & Routes

| Route | Page |
|-------|------|
| `/visualization` | Visualization Studio |
| `/sales` | Sales Analytics Dashboard |
| `/inventory` | Inventory Analytics Dashboard |
| `/customers` | Customer Analytics Dashboard |
| `/suppliers` | Supplier Analytics Dashboard |
| `/products` | Product Analytics Dashboard |
| `/regional` | Regional Analytics Dashboard |
| `/etl-quality` | ETL Quality Dashboard |
| `/executive-intelligence` | Executive Intelligence Dashboard |

Sections: Revenue, Customer, Product, Inventory, Regional, Time-Series, KPI charts.

---

## Future Forecasting Integration

Forecasting (Phase 7) will:

- Extend `useChartData` with forecast series
- Add forecast bands to `TrendChartCard` / `EnterpriseAreaChart`
- Reuse adapters for historical vs projected comparison

---

## Related Documentation

- [Interactive Analytics Dashboards](interactive-analytics-dashboards.md)
- [Business Analytics Engine](business-analytics-engine.md)
- [Executive Intelligence Platform](executive-intelligence.md)
- [Statistics Engine](statistics-engine.md)
- [Phase Plan](phase-plan.md)
