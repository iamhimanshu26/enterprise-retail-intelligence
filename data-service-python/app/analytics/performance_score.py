"""Formula-based performance scoring — no ML."""

from __future__ import annotations

from typing import Dict

import pandas as pd


def _normalize_series(values: pd.Series) -> pd.Series:
    mn, mx = values.min(), values.max()
    if mx == mn:
        return pd.Series(50.0, index=values.index)
    return (values - mn) / (mx - mn) * 100


def score_stores(df: pd.DataFrame) -> Dict[str, float]:
    """Store Performance Score = 40% revenue + 30% profit + 20% orders + 10% AOV (normalized)."""
    if "store_code" not in df.columns:
        return {}

    agg = df.groupby("store_code").agg(
        revenue=("revenue", "sum"),
        profit=("profit", "sum"),
        orders=("revenue", "count"),
    )
    agg["aov"] = agg["revenue"] / agg["orders"].clip(lower=1)

    rev_n = _normalize_series(agg["revenue"])
    prof_n = _normalize_series(agg["profit"])
    ord_n = _normalize_series(agg["orders"])
    aov_n = _normalize_series(agg["aov"])

    scores = rev_n * 0.4 + prof_n * 0.3 + ord_n * 0.2 + aov_n * 0.1
    return {str(k): round(float(v), 2) for k, v in scores.items()}


def score_products(df: pd.DataFrame) -> Dict[str, float]:
    """Product Performance Score = 40% revenue + 35% units + 25% profit contribution."""
    if "product_code" not in df.columns:
        return {}

    agg = df.groupby("product_code").agg(
        revenue=("revenue", "sum"),
        units=("quantity", "sum"),
        profit=("profit", "sum"),
    )
    rev_n = _normalize_series(agg["revenue"])
    units_n = _normalize_series(agg["units"])
    prof_n = _normalize_series(agg["profit"])
    scores = rev_n * 0.4 + units_n * 0.35 + prof_n * 0.25
    return {str(k): round(float(v), 2) for k, v in scores.items()}


def compute_performance_scores(
    df: pd.DataFrame,
    store_analytics,
    product_analytics,
    customer_analytics,
    inventory_analytics,
    supplier_analytics,
) -> dict:
    from app.analytics.models import PerformanceScores

    supplier_risk = 0.0
    if supplier_analytics.rankings:
        supplier_risk = sum(r.risk_score for r in supplier_analytics.rankings) / len(supplier_analytics.rankings)

    return PerformanceScores(
        store_scores={r.store_code: r.performance_score for r in store_analytics.rankings[:10]},
        product_scores={r.product_code: r.performance_score for r in product_analytics.top_by_revenue[:10]},
        customer_segment_score=customer_analytics.segment_score,
        inventory_risk_score=inventory_analytics.stock_risk_score,
        supplier_risk_score=round(supplier_risk, 2),
    )
