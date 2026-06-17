"""Statistical anomaly detection — z-score and IQR, no ML."""

from __future__ import annotations

import pandas as pd

from app.analytics.models import BusinessAnalyticsReport
from app.intelligence.models import AnomalyItem


def _zscore_anomalies(series: pd.Series, metric: str, anomaly_type: str) -> list:
    if len(series) < 5:
        return []
    mean = series.mean()
    std = series.std()
    if std == 0 or pd.isna(std):
        return []
    results = []
    for idx, val in series.items():
        z = (val - mean) / std
        if abs(z) >= 2.0:
            severity = "critical" if abs(z) >= 3 else "warning"
            direction = "spike" if z > 0 else "drop"
            results.append(
                AnomalyItem(
                    id=f"{anomaly_type}-{idx}",
                    anomaly_type=anomaly_type,
                    severity=severity,
                    metric=metric,
                    value=round(float(val), 2),
                    expected_range=f"{mean - 2*std:.0f} – {mean + 2*std:.0f}",
                    explanation=(
                        f"{metric} {direction} detected (z-score {z:.2f}). "
                        f"Value deviates from the expected range using ±2σ threshold."
                    ),
                )
            )
    return results[:5]


def detect_anomalies(df: pd.DataFrame, report: BusinessAnalyticsReport) -> list:
    anomalies: list = []

    if "transaction_date" in df.columns and "revenue" in df.columns:
        work = df.copy()
        work["transaction_date"] = pd.to_datetime(work["transaction_date"], errors="coerce")
        work = work.dropna(subset=["transaction_date"])
        daily = work.groupby(work["transaction_date"].dt.date)["revenue"].sum()
        anomalies.extend(_zscore_anomalies(daily, "Daily Revenue", "revenue_spike"))

    if "returned" in df.columns:
        ret_rate = df["returned"].astype(bool).mean() * 100
        if ret_rate > 20:
            anomalies.append(
                AnomalyItem(
                    id="return-rate-high",
                    anomaly_type="unusual_return_rate",
                    severity="warning",
                    metric="Return Rate",
                    value=round(ret_rate, 2),
                    expected_range="0 – 15%",
                    explanation="Return rate exceeds the 15% operational threshold.",
                )
            )

    if "stock_on_hand" in df.columns and "reorder_level" in df.columns:
        stock = pd.to_numeric(df["stock_on_hand"], errors="coerce").fillna(0)
        reorder = pd.to_numeric(df["reorder_level"], errors="coerce").fillna(0)
        low_ratio = (stock <= reorder).mean() * 100
        if low_ratio > 40:
            anomalies.append(
                AnomalyItem(
                    id="inventory-low",
                    anomaly_type="abnormal_inventory",
                    severity="critical" if low_ratio > 60 else "warning",
                    metric="Low Stock Ratio",
                    value=round(low_ratio, 2),
                    expected_range="0 – 35%",
                    explanation="Abnormally high proportion of SKUs at or below reorder level.",
                )
            )

    if "discount_rate" in df.columns:
        disc = pd.to_numeric(df["discount_rate"], errors="coerce").fillna(0)
        q1, q3 = disc.quantile(0.25), disc.quantile(0.75)
        iqr = q3 - q1
        upper = q3 + 1.5 * iqr
        high_disc = disc[disc > upper]
        if len(high_disc) > 0:
            anomalies.append(
                AnomalyItem(
                    id="discount-high",
                    anomaly_type="high_discount_usage",
                    severity="warning",
                    metric="Discount Rate",
                    value=round(float(high_disc.mean()), 2),
                    expected_range=f"0 – {upper:.1f}%",
                    explanation="Unusually high discount usage detected via IQR outlier rule.",
                )
            )

    if report.sales.growth_trend_pct is not None and report.sales.growth_trend_pct < -20:
        anomalies.append(
            AnomalyItem(
                id="sales-drop",
                anomaly_type="unexpected_sales_drop",
                severity="critical",
                metric="Sales Growth",
                value=report.sales.growth_trend_pct,
                expected_range="> -10%",
                explanation="Unexpected sales drop detected in daily revenue trend.",
            )
        )

    return anomalies
