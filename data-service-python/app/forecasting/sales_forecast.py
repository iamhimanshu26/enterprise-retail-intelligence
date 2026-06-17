"""Sales volume forecasting."""

from __future__ import annotations

import pandas as pd

from app.forecasting.features import aggregate_time_series, build_forecast_points
from app.forecasting.models import ForecastPoint, ForecastSeries, SalesForecast


def _series_from_points(points: list, granularity: str, model_name: str, horizon: int) -> ForecastSeries:
    return ForecastSeries(
        granularity=granularity,
        model_name=model_name,
        horizon=horizon,
        points=[ForecastPoint(**p) for p in points],
    )


def compute_sales_forecast(df: pd.DataFrame) -> SalesForecast:
    """Forecast daily, weekly, and monthly sales (order counts)."""
    daily_series = aggregate_time_series(df, "quantity", "D")
    weekly_series = aggregate_time_series(df, "quantity", "W")
    monthly_series = aggregate_time_series(df, "quantity", "ME")

    daily_points = build_forecast_points(daily_series, 14, "moving_average", "daily", "D")
    weekly_points = build_forecast_points(weekly_series, 8, "linear_regression", "weekly", "W")
    monthly_points = build_forecast_points(monthly_series, 6, "seasonal_naive", "monthly", "ME")

    return SalesForecast(
        daily=_series_from_points(daily_points, "daily", daily_points[0]["model_name"], 14),
        weekly=_series_from_points(weekly_points, "weekly", weekly_points[0]["model_name"], 8),
        monthly=_series_from_points(monthly_points, "monthly", monthly_points[0]["model_name"], 6),
    )
