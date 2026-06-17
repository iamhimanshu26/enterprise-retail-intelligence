# Forecasting Engine

Phase 7 delivers the **Forecasting & Predictive Analytics** platform — reusable Python services, FastAPI endpoints, and the Forecasting Center UI for sales, revenue, demand, inventory, and store performance prediction with accuracy metrics and scenario planning.

---

## Objective

Provide enterprise predictive analytics APIs and UI that consume warehouse-ready retail data (Phase 4) and analytics/statistics outputs (Phase 5). Phase 7.2 adds the Forecasting Center at `/forecasting`.

---

## Architecture

```text
Analytics Warehouse
        ↓
Statistics Engine
        ↓
Business Analytics Engine
        ↓
Forecasting Engine (Phase 7.1)
        ↓
Scenario Planning
        ↓
Executive Visualization (Phase 6)
        ↓
Forecast UI & Accuracy Dashboard (Phase 7.2)
```

### Module layout

```text
data-service-python/app/forecasting/
├── models.py              # Pydantic request/response models
├── engine.py              # ForecastingEngine orchestrator
├── features.py            # Feature engineering + model helpers
├── sales_forecast.py
├── revenue_forecast.py
├── demand_forecast.py
├── inventory_forecast.py
├── store_forecast.py
├── accuracy.py            # MAE, RMSE, MAPE, SMAPE, bias
├── scenarios.py           # Optimistic / realistic / pessimistic
└── exceptions.py
```

---

## Supported Forecasts

| Module | Outputs |
|--------|---------|
| Sales | Daily, weekly, monthly sales volume |
| Revenue | Daily, weekly, monthly, quarterly revenue |
| Demand | Product, category, fast/slow-moving demand |
| Inventory | Expected usage, stock-out risk, reorder placeholders |
| Stores | Revenue/order trends, growth/decline classification |
| Accuracy | MAE, RMSE, MAPE, SMAPE, bias, accuracy score |
| Scenarios | +10% optimistic, base realistic, -10% pessimistic |

---

## Feature Engineering

`features.py` provides reusable utilities:

- Date features (day of week, month, quarter, weekend, seasonality)
- Promotion flag placeholder
- Region and category dummy features
- Rolling averages and lag features
- Time-series aggregation (daily, weekly, monthly, quarterly)

---

## Model Strategy

Explainable baseline models (no black-box ensembles in 7.1):

| Model | Use |
|-------|-----|
| Moving average | Short-horizon sales/revenue |
| Linear regression | Trend extrapolation |
| Seasonal naive | Monthly/quarterly patterns |
| Exponential smoothing | Revenue smoothing baseline |

---

## Accuracy Metrics

`accuracy.py` computes backtest-style metrics on holdout windows:

- MAE · RMSE · MAPE · SMAPE (placeholder) · Bias · Accuracy score (0–100)

---

## Scenario Planning

`scenarios.py` applies fixed adjustment bands:

- Optimistic: +10%
- Realistic: base forecast
- Pessimistic: -10%

Advanced scenario UI arrives in Phase 7.2.

---

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/forecasting/overview` | Engine overview and module list |
| `GET /api/v1/forecasting/sales` | Sales forecast |
| `GET /api/v1/forecasting/revenue` | Revenue forecast |
| `GET /api/v1/forecasting/demand` | Demand forecast |
| `GET /api/v1/forecasting/inventory` | Inventory forecast |
| `GET /api/v1/forecasting/stores` | Store performance forecast |
| `GET /api/v1/forecasting/accuracy` | Accuracy report |
| `GET /api/v1/forecasting/scenarios` | Scenario outputs |
| `POST /api/v1/forecasting/run-sample` | Unified forecasting report |

Data loads via `load_analytics_data()` — warehouse `fact_sales` when available, else synthetic sample.

---

## Future UI Integration (Phase 7.2 — Complete)

Phase 7.2 added:

- Forecasting Center at `/forecasting`
- Forecast overview KPI cards
- Revenue and sales historical vs forecast charts
- Demand, inventory, and store forecast sections
- Scenario planning workspace with placeholder controls
- Accuracy dashboard with methodology tooltips
- Mock fallback adapter layer

See [Forecasting Center](forecasting-center.md) for UI architecture details.

---

## Related Documentation

- [Business Analytics Engine](business-analytics-engine.md)
- [Statistics Engine](statistics-engine.md)
- [Visualization Framework](visualization-framework.md)
- [Phase Plan](phase-plan.md)
