# Forecasting Center

Phase 7.2 delivers the **Forecasting Center** UI at `/forecasting` — the executive-ready presentation layer for the Phase 7.1 forecasting engine.

---

## Objective

Make forecasting visible, explainable, and actionable for executives without AI/LLM insights (Phase 11). The center consumes `/api/v1/forecasting/run-sample` with mock fallback when the data service is unavailable.

---

## UI Architecture

```text
frontend/src/features/forecasting/
├── pages/ForecastingCenter.tsx      # Main page shell
├── components/
│   ├── ForecastOverview.tsx         # KPI forecast cards
│   ├── ForecastSummaryCard.tsx
│   ├── ForecastChart.tsx            # Historical vs forecast dual-line charts
│   ├── DemandForecastTable.tsx
│   ├── InventoryRiskForecast.tsx
│   ├── StoreForecastTable.tsx
│   ├── ScenarioPlanner.tsx
│   ├── ForecastAccuracyCard.tsx     # Accuracy dashboard
│   └── ForecastMethodologyPanel.tsx
├── adapters/forecastingAdapter.ts # API → chart/KPI transforms
├── mock/forecastingMock.ts        # Offline fallback data
└── hooks/useForecastingData.ts    # TanStack Query + fallback
```

Types live in `frontend/src/types/forecasting.ts`. API client functions are in `frontend/src/lib/dataServiceApi.ts`.

---

## Supported Forecast Sections

| Section | Content |
|---------|---------|
| Forecast Overview | Predicted revenue, sales, demand, stock-out risk, accuracy, growth outlook |
| Revenue & Sales Charts | Historical vs forecast, monthly revenue, weekly sales |
| Demand Forecast | Product/category tables, fast/slow movers, growth charts |
| Inventory Forecast | Risk scores, days to stock-out, reorder placeholders |
| Store Performance | High-growth/declining stores, revenue and order forecasts |
| Scenario Planning | Optimistic, realistic, pessimistic with placeholder sliders |
| Accuracy Dashboard | MAE, RMSE, MAPE, bias, accuracy score with tooltips |
| Methodology | Moving average, regression, seasonal naive, feature engineering |
| Recommendations | Placeholder for Phase 11 AI insights |

---

## Scenario Planning Design

- **Backend (7.1):** Fixed +10% / 0% / -10% bands via `scenarios.py`
- **UI (7.2):** Placeholder sliders for demand increase, discount impact, seasonal boost, and inventory constraint
- Client-side `applyScenarioControls()` adjusts comparison cards without requiring backend recalculation
- Future: wire sliders to a scenario API when planning workflows need server-side simulation

---

## Accuracy Metrics

Displayed with explanation tooltips:

- **MAE** — average absolute error
- **RMSE** — penalizes larger errors
- **MAPE** — percentage error
- **Bias** — over/under prediction tendency
- **Accuracy Score** — 0–100 composite from backtest holdout

---

## Frontend Adapter Strategy

1. `runForecastingSample()` POSTs to `/api/v1/forecasting/run-sample`
2. `buildForecastingCenterBundle()` transforms `ForecastingReport` into KPIs and chart series
3. `buildHistoricalVsForecastChart()` synthesizes historical baseline alongside forecast points for dual-line charts
4. On API failure, `FORECASTING_MOCK_REPORT` ensures the page still loads

---

## Future Backend Integration

- Per-endpoint GET calls (`/sales`, `/revenue`, etc.) for partial refresh
- Real historical series from analytics warehouse instead of synthesized baseline
- Server-side scenario recalculation with persisted planning sessions
- WebSocket push when batch forecast jobs complete (Phase 10)

---

## Future AI Insights Integration

Phase 11 will add narrative recommendations to the **Forecast Recommendations** placeholder — executive summaries, anomaly explanations, and reorder narratives powered by the AI Business Insight Engine. Phase 7.2 intentionally keeps forecasts explainable and statistical.

---

## Related Documentation

- [Forecasting Engine](forecasting-engine.md) — Phase 7.1 backend
- [Visualization Framework](visualization-framework.md) — Phase 6 chart components reused here
- [Phase Plan](phase-plan.md)
