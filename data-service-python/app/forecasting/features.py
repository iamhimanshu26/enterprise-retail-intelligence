"""Feature engineering utilities for forecasting models."""

from __future__ import annotations

from typing import Dict, List, Optional, Tuple

import numpy as np
import pandas as pd

from app.forecasting.exceptions import InsufficientForecastDataError

MIN_SERIES_LENGTH = 5


def ensure_date_column(df: pd.DataFrame, date_col: str = "transaction_date") -> pd.DataFrame:
    out = df.copy()
    out[date_col] = pd.to_datetime(out[date_col])
    return out


def add_date_features(df: pd.DataFrame, date_col: str = "transaction_date") -> pd.DataFrame:
    """Add calendar and seasonality feature columns."""
    out = ensure_date_column(df, date_col)
    out["day_of_week"] = out[date_col].dt.dayofweek
    out["month"] = out[date_col].dt.month
    out["quarter"] = out[date_col].dt.quarter
    out["year"] = out[date_col].dt.year
    out["is_weekend"] = out["day_of_week"].isin([5, 6])
    out["seasonality_flag"] = out["month"].isin([11, 12, 1, 2])
    out["promotion_flag"] = out["is_promotional"] if "is_promotional" in out.columns else False
    return out


def aggregate_time_series(
    df: pd.DataFrame,
    value_col: str,
    freq: str,
    date_col: str = "transaction_date",
) -> pd.Series:
    """Aggregate a numeric column to a time series by frequency."""
    out = ensure_date_column(df, date_col)
    series = out.set_index(date_col)[value_col].resample(freq).sum()
    return series.dropna()


def add_rolling_features(series: pd.Series, windows: List[int] = [3, 7, 14]) -> pd.DataFrame:
    """Rolling averages for lag-based features."""
    frame = pd.DataFrame({"value": series})
    for window in windows:
        frame[f"rolling_{window}"] = series.rolling(window, min_periods=1).mean()
    return frame


def add_lag_features(series: pd.Series, lags: List[int] = [1, 7, 14]) -> pd.DataFrame:
    frame = pd.DataFrame({"value": series})
    for lag in lags:
        frame[f"lag_{lag}"] = series.shift(lag)
    return frame


def region_feature_matrix(df: pd.DataFrame) -> pd.DataFrame:
    if "region" not in df.columns:
        return pd.DataFrame()
    return pd.get_dummies(df["region"].astype(str), prefix="region")


def category_feature_matrix(df: pd.DataFrame) -> pd.DataFrame:
    if "category" not in df.columns:
        return pd.DataFrame()
    return pd.get_dummies(df["category"].astype(str), prefix="category")


def trend_direction(values: np.ndarray) -> str:
    if len(values) < 2:
        return "stable"
    change = (values[-1] - values[0]) / max(abs(values[0]), 1e-9)
    if change > 0.05:
        return "upward"
    if change < -0.05:
        return "downward"
    return "stable"


def _moving_average_forecast(values: np.ndarray, horizon: int) -> np.ndarray:
    window = min(7, len(values))
    baseline = float(np.mean(values[-window:]))
    return np.full(horizon, baseline)


def _linear_regression_forecast(values: np.ndarray, horizon: int) -> np.ndarray:
    from sklearn.linear_model import LinearRegression

    x = np.arange(len(values)).reshape(-1, 1)
    y = values.astype(float)
    model = LinearRegression()
    model.fit(x, y)
    future_x = np.arange(len(values), len(values) + horizon).reshape(-1, 1)
    preds = model.predict(future_x)
    return np.maximum(preds, 0.0)


def _seasonal_naive_forecast(values: np.ndarray, horizon: int, season: int = 7) -> np.ndarray:
    season = max(1, min(season, len(values)))
    template = values[-season:]
    reps = int(np.ceil(horizon / season))
    extended = np.tile(template, reps)[:horizon]
    return extended.astype(float)


def _exponential_smoothing_forecast(values: np.ndarray, horizon: int, alpha: float = 0.35) -> np.ndarray:
    level = float(values[0])
    for value in values[1:]:
        level = alpha * float(value) + (1 - alpha) * level
    return np.full(horizon, max(level, 0.0))


def generate_forecast(
    series: pd.Series,
    horizon: int,
    model_name: str = "moving_average",
    granularity: str = "daily",
) -> Tuple[np.ndarray, str]:
    """Generate forecast values for a univariate series."""
    values = series.dropna().values.astype(float)
    if len(values) < MIN_SERIES_LENGTH:
        raise InsufficientForecastDataError(
            f"Need at least {MIN_SERIES_LENGTH} points for {granularity} forecast"
        )

    horizon = max(1, horizon)
    if model_name == "linear_regression":
        preds = _linear_regression_forecast(values, horizon)
    elif model_name == "seasonal_naive":
        season = 7 if granularity == "daily" else 4 if granularity == "weekly" else 3
        preds = _seasonal_naive_forecast(values, horizon, season=season)
    elif model_name == "exponential_smoothing":
        preds = _exponential_smoothing_forecast(values, horizon)
    else:
        preds = _moving_average_forecast(values, horizon)
        model_name = "moving_average"

    return preds, model_name


def build_forecast_points(
    series: pd.Series,
    horizon: int,
    model_name: str,
    granularity: str,
    freq: str,
) -> List[Dict[str, object]]:
    """Build forecast point dicts with dates and confidence placeholders."""
    clean = series.dropna()
    if len(clean) < 2:
        raise InsufficientForecastDataError(f"Need at least 2 points for {granularity} forecast")

    horizon = max(1, min(horizon, len(clean)))
    if len(clean) < MIN_SERIES_LENGTH:
        preds = np.full(horizon, float(clean.mean()))
        resolved_model = "moving_average"
    else:
        preds, resolved_model = generate_forecast(clean, horizon, model_name, granularity)

    last_date = clean.index.max()
    future_dates = pd.date_range(last_date, periods=horizon + 1, freq=freq)[1:]
    std = float(clean.std()) if len(clean) > 1 else float(clean.mean()) * 0.1
    direction = trend_direction(clean.values)

    points: List[Dict[str, object]] = []
    for i, (date, pred) in enumerate(zip(future_dates, preds)):
        pred_val = round(float(pred), 2)
        points.append(
            {
                "forecast_date": date.strftime("%Y-%m-%d"),
                "predicted_value": pred_val,
                "confidence_low": round(max(0.0, pred_val - std), 2),
                "confidence_high": round(pred_val + std, 2),
                "trend_direction": direction,
                "model_name": resolved_model,
                "forecast_horizon": i + 1,
            }
        )
    return points
