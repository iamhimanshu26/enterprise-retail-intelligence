"""Revenue forecasting."""

from __future__ import annotations

import pandas as pd

from app.forecasting.features import aggregate_time_series, build_forecast_points
from app.forecasting.models import ForecastPoint, ForecastSeries, RevenueForecast


def _series_from_points(points: list, granularity: str, model_name: str, horizon: int) -> ForecastSeries:
    return ForecastSeries(
        granularity=granularity,
        model_name=model_name,
        horizon=horizon,
        points=[ForecastPoint(**p) for p in points],
    )


def compute_revenue_forecast(df: pd.DataFrame) -> RevenueForecast:
    daily_series = aggregate_time_series(df, "revenue", "D")
    weekly_series = aggregate_time_series(df, "revenue", "W")
    monthly_series = aggregate_time_series(df, "revenue", "ME")
    quarterly_series = aggregate_time_series(df, "revenue", "QE")

    daily_points = build_forecast_points(daily_series, 14, "exponential_smoothing", "daily", "D")
    weekly_points = build_forecast_points(weekly_series, 8, "moving_average", "weekly", "W")
    monthly_points = build_forecast_points(monthly_series, 6, "linear_regression", "monthly", "ME")

    if len(quarterly_series) >= 2:
        quarterly_points = build_forecast_points(
            quarterly_series,
            min(4, len(quarterly_series)),
            "seasonal_naive",
            "quarterly",
            "QE",
        )
    else:
        base = float(daily_series.tail(min(14, len(daily_series))).mean() * 90)
        last = daily_series.index.max()
        quarterly_points = [
            {
                "forecast_date": (last + pd.Timedelta(days=90 * (i + 1))).strftime("%Y-%m-%d"),
                "predicted_value": round(base, 2),
                "confidence_low": round(base * 0.9, 2),
                "confidence_high": round(base * 1.1, 2),
                "trend_direction": "stable",
                "model_name": "moving_average",
                "forecast_horizon": i + 1,
            }
            for i in range(4)
        ]

    return RevenueForecast(
        daily=_series_from_points(daily_points, "daily", daily_points[0]["model_name"], 14),
        weekly=_series_from_points(weekly_points, "weekly", weekly_points[0]["model_name"], 8),
        monthly=_series_from_points(monthly_points, "monthly", monthly_points[0]["model_name"], 6),
        quarterly=_series_from_points(quarterly_points, "quarterly", quarterly_points[0]["model_name"], 4),
    )
