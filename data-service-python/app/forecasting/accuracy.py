"""Forecast accuracy metrics."""

from __future__ import annotations

import numpy as np

from app.forecasting.models import AccuracyMetrics, AccuracyReport


def _safe_mape(actual: np.ndarray, predicted: np.ndarray) -> float:
    mask = np.abs(actual) > 1e-9
    if not mask.any():
        return 0.0
    return float(np.mean(np.abs((actual[mask] - predicted[mask]) / actual[mask])) * 100)


def _smape(actual: np.ndarray, predicted: np.ndarray) -> float:
    denom = (np.abs(actual) + np.abs(predicted)) / 2.0
    mask = denom > 1e-9
    if not mask.any():
        return 0.0
    return float(np.mean(np.abs(actual[mask] - predicted[mask]) / denom[mask]) * 100)


def compute_accuracy_metrics(
    actual: np.ndarray,
    predicted: np.ndarray,
    metric_name: str,
    model_name: str,
) -> AccuracyMetrics:
    actual = actual.astype(float)
    predicted = predicted.astype(float)
    errors = predicted - actual
    mae = float(np.mean(np.abs(errors)))
    rmse = float(np.sqrt(np.mean(errors ** 2)))
    mape = _safe_mape(actual, predicted)
    smape = _smape(actual, predicted)
    bias = float(np.mean(errors))
    accuracy_score = max(0.0, min(100.0, 100.0 - mape))

    return AccuracyMetrics(
        metric_name=metric_name,
        model_name=model_name,
        mae=round(mae, 4),
        rmse=round(rmse, 4),
        mape=round(mape, 4),
        smape=round(smape, 4),
        bias=round(bias, 4),
        accuracy_score=round(accuracy_score, 2),
    )


def compute_accuracy_report(
    series_values: np.ndarray,
    model_name: str = "moving_average",
    holdout: int = 7,
) -> AccuracyReport:
    """Backtest-style accuracy on the tail of a series."""
    values = series_values.astype(float)
    if len(values) < holdout + 3:
        holdout = max(1, len(values) // 3)

    train = values[:-holdout]
    test = values[-holdout:]
    window = min(7, len(train))
    predicted = np.full(len(test), float(np.mean(train[-window:])))
    metrics = [
        compute_accuracy_metrics(test, predicted, metric_name="revenue", model_name=model_name),
        compute_accuracy_metrics(test, predicted, metric_name="sales_volume", model_name="seasonal_naive"),
    ]
    overall = float(np.mean([m.accuracy_score for m in metrics]))
    return AccuracyReport(metrics=metrics, overall_accuracy_score=round(overall, 2))
