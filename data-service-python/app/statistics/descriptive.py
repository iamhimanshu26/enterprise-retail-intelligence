"""Descriptive statistics for numeric retail columns."""

from __future__ import annotations

from typing import List, Optional

import numpy as np
import pandas as pd

from app.statistics.models import DescriptiveStats

NUMERIC_COLUMNS = [
    "revenue",
    "profit",
    "cost",
    "quantity",
    "discount_rate",
    "inventory_quantity",
    "refund_amount",
]


def compute_descriptive_stats(
    df: pd.DataFrame,
    columns: Optional[List[str]] = None,
) -> List[DescriptiveStats]:
    cols = columns or [c for c in NUMERIC_COLUMNS if c in df.columns]
    results: List[DescriptiveStats] = []

    for col in cols:
        series = pd.to_numeric(df[col], errors="coerce")
        valid = series.dropna()
        if valid.empty:
            results.append(DescriptiveStats(column=col))
            continue

        q1 = float(valid.quantile(0.25))
        q3 = float(valid.quantile(0.75))
        mn = float(valid.min())
        mx = float(valid.max())

        mode_vals = valid.mode()
        mode_val = float(mode_vals.iloc[0]) if len(mode_vals) > 0 else None

        skew = float(valid.skew()) if len(valid) > 2 else None
        kurt = float(valid.kurtosis()) if len(valid) > 3 else None

        results.append(
            DescriptiveStats(
                column=col,
                count=int(valid.count()),
                sum=round(float(valid.sum()), 2),
                mean=round(float(valid.mean()), 4),
                median=round(float(valid.median()), 4),
                mode=round(mode_val, 4) if mode_val is not None else None,
                min=round(mn, 4),
                max=round(mx, 4),
                range=round(mx - mn, 4),
                variance=round(float(valid.var()), 4) if len(valid) > 1 else 0.0,
                std=round(float(valid.std()), 4) if len(valid) > 1 else 0.0,
                q1=round(q1, 4),
                q3=round(q3, 4),
                p25=round(q1, 4),
                p75=round(q3, 4),
                p90=round(float(valid.quantile(0.90)), 4),
                p95=round(float(valid.quantile(0.95)), 4),
                skewness=round(skew, 4) if skew is not None else None,
                kurtosis=round(kurt, 4) if kurt is not None else None,
            )
        )

    return results
