"""Store performance forecasting."""

from __future__ import annotations

import pandas as pd

from app.forecasting.features import trend_direction
from app.forecasting.models import StoreForecast, StoreForecastRow


def compute_store_forecast(df: pd.DataFrame) -> StoreForecast:
    stores: list[StoreForecastRow] = []
    high_growth: list[str] = []
    declining: list[str] = []

    if "store_code" not in df.columns:
        return StoreForecast(stores=[], high_growth=[], declining=[])

    for store_code, group in df.groupby("store_code"):
        daily_rev = group.groupby("transaction_date")["revenue"].sum()
        daily_orders = group.groupby("transaction_date").size()
        rev_trend = trend_direction(daily_rev.values.astype(float))
        order_trend = trend_direction(daily_orders.values.astype(float))
        pred_rev = float(daily_rev.tail(min(7, len(daily_rev))).mean())
        pred_orders = float(daily_orders.tail(min(7, len(daily_orders))).mean())

        if rev_trend == "upward":
            risk = 20.0
            classification = "high_growth"
            high_growth.append(str(store_code))
        elif rev_trend == "downward":
            risk = 75.0
            classification = "declining"
            declining.append(str(store_code))
        else:
            risk = 45.0
            classification = "stable"

        stores.append(
            StoreForecastRow(
                store_code=str(store_code),
                predicted_revenue=round(pred_rev * 30, 2),
                predicted_orders=round(pred_orders * 30, 2),
                revenue_trend=rev_trend,
                order_trend=order_trend,
                performance_risk_score=risk,
                classification=classification,
            )
        )

    stores.sort(key=lambda s: s.predicted_revenue, reverse=True)
    return StoreForecast(
        stores=stores[:20],
        high_growth_stores=high_growth[:5],
        declining_stores=declining[:5],
    )
