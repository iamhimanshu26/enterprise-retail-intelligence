"""Product and category demand forecasting."""

from __future__ import annotations

import pandas as pd

from app.forecasting.features import trend_direction
from app.forecasting.models import DemandForecast, DemandForecastRow


def _demand_row(
    dimension: str,
    dimension_type: str,
    predicted: float,
    history: pd.Series,
    model_name: str = "moving_average",
) -> DemandForecastRow:
    return DemandForecastRow(
        dimension=dimension,
        dimension_type=dimension_type,
        predicted_demand=round(predicted, 2),
        trend_direction=trend_direction(history.values.astype(float)),
        model_name=model_name,
    )


def compute_demand_forecast(df: pd.DataFrame) -> DemandForecast:
    product_qty = df.groupby("product_code")["quantity"].sum().sort_values(ascending=False)
    category_qty = df.groupby("category")["quantity"].sum().sort_values(ascending=False)

    product_demand = []
    for code in product_qty.head(10).index:
        hist = df[df["product_code"] == code].groupby("transaction_date")["quantity"].sum()
        window = min(7, len(hist))
        pred = float(hist.tail(window).mean()) if len(hist) else 0.0
        product_demand.append(_demand_row(str(code), "product", pred, hist))

    category_demand = []
    for cat in category_qty.index:
        hist = df[df["category"] == cat].groupby("transaction_date")["quantity"].sum()
        window = min(7, len(hist))
        pred = float(hist.tail(window).mean()) if len(hist) else 0.0
        category_demand.append(_demand_row(str(cat), "category", pred, hist))

    fast_codes = product_qty.head(5).index.tolist()
    slow_codes = product_qty.tail(5).index.tolist()

    fast_moving = [
        _demand_row(
            str(code),
            "fast_moving",
            float(product_qty[code]) / max(len(df[df["product_code"] == code]), 1),
            df[df["product_code"] == code].groupby("transaction_date")["quantity"].sum(),
        )
        for code in fast_codes
    ]
    slow_moving = [
        _demand_row(
            str(code),
            "slow_moving",
            float(product_qty[code]) / max(len(df[df["product_code"] == code]), 1),
            df[df["product_code"] == code].groupby("transaction_date")["quantity"].sum(),
            model_name="seasonal_naive",
        )
        for code in slow_codes
    ]

    return DemandForecast(
        product_demand=product_demand,
        category_demand=category_demand,
        fast_moving=fast_moving,
        slow_moving=slow_moving,
    )
