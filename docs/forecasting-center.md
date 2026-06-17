# Forecasting Center

Phase 7 delivers the **Forecasting Center** UI at `/forecasting` — the executive-ready presentation layer for the forecasting engine.

---

## Objective

Make forecasting visible, explainable, and actionable for executives. The center consumes `/api/v1/forecasting/run-sample` with mock fallback when the data service is unavailable.

---

## UI Architecture

```text
frontend/src/features/forecasting/
├── pages/ForecastingCenter.tsx
├── components/
│   ├── ForecastOverview.tsx           # Executive Forecast Summary
│   ├── ForecastSummaryCard.tsx
│   ├── ForecastChart.tsx              # Historical vs forecast dual-line charts
│   ├── DemandForecastTable.tsx
│   ├── InventoryRiskForecast.tsx
│   ├── StoreForecastTable.tsx
│   ├── ScenarioPlanner.tsx
│   ├── ForecastAccuracyCard.tsx
│   ├── ForecastMethodologyPanel.tsx
│   └── ModelInformationPanel.tsx
├── adapters/forecastingAdapter.ts
├── mock/forecastingMock.ts
└── hooks/useForecastingData.ts
```

---

## Supported Sections

| Section | Content |
|---------|---------|
| Executive Forecast Summary | Revenue, sales, demand, stock-out risk, accuracy, growth KPI cards |
| Revenue Forecast | Historical vs forecast, monthly, quarterly charts |
| Sales Forecast | Historical vs forecast, weekly volume chart |
| Demand Forecast | Product/category tables, fast/slow movers, demand charts |
| Inventory Forecast | Risk table, stock-out metrics, inventory risk chart |
| Store Forecast | Performance table, revenue/order forecast chart |
| Scenario Planning | Optimistic, expected, pessimistic with planning controls |
| Forecast Accuracy | MAE, RMSE, MAPE, SMAPE, bias, accuracy score with gauges |
| Model Information | Supported models and engine modules |
| Methodology | Formulas and business explanations |
| Recommendations | Placeholder for Phase 11 AI insights |

---

## Scenario Planning

- **Backend:** Fixed scenario bands via `scenarios.py` (+10% / base / -10%)
- **UI:** Client-side controls for demand %, promotion %, seasonality %, growth %, inventory constraint %
- Comparison cards and bar chart via `applyScenarioControls()` and `buildScenarioComparisonChart()`

---

## Accuracy Metrics

| Metric | Explanation |
|--------|-------------|
| MAE | Average absolute error |
| RMSE | Penalizes larger errors |
| MAPE | Percentage error vs actuals |
| SMAPE | Symmetric percentage error |
| Bias | Over/under prediction tendency |
| Accuracy Score | 0–100 composite from holdout backtest |

---

## Frontend Adapter Strategy

1. `runForecastingSample()` loads unified `ForecastingReport`
2. `buildForecastingCenterBundle()` transforms API data into KPIs and chart series
3. Individual GET endpoints available via `dataServiceApi` for partial refresh
4. `FORECASTING_MOCK_REPORT` ensures offline resilience

---

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/forecasting/overview` | Engine overview |
| `GET /api/v1/forecasting/sales` | Sales forecast |
| `GET /api/v1/forecasting/revenue` | Revenue forecast |
| `GET /api/v1/forecasting/demand` | Demand forecast |
| `GET /api/v1/forecasting/inventory` | Inventory forecast |
| `GET /api/v1/forecasting/stores` | Store forecast |
| `GET /api/v1/forecasting/accuracy` | Accuracy report |
| `GET /api/v1/forecasting/scenarios` | Scenario outputs |
| `POST /api/v1/forecasting/run-sample` | Unified report |

---

## Future Integration

- Server-side scenario recalculation with persisted planning sessions
- Real historical series from analytics warehouse for chart baselines
- Phase 11 AI narrative recommendations in the recommendations placeholder

---

## Related Documentation

- [Forecasting Engine](forecasting-engine.md)
- [Visualization Framework](visualization-framework.md)
- [Phase Plan](phase-plan.md)
