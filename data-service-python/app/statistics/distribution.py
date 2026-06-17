"""Distribution statistics for chart-ready summaries."""

from __future__ import annotations

from typing import List, Optional

import pandas as pd

from app.statistics.models import DistributionBucket, DistributionSummary


def _bucket_numeric(
    series: pd.Series,
    name: str,
    bins: int = 5,
) -> DistributionSummary:
    valid = pd.to_numeric(series, errors="coerce").dropna()
    if valid.empty:
        return DistributionSummary(name=name, buckets=[])

    try:
        cut = pd.cut(valid, bins=bins, duplicates="drop")
        counts = cut.value_counts().sort_index()
    except ValueError:
        counts = valid.value_counts().head(bins)

    total = int(counts.sum())
    buckets = [
        DistributionBucket(
            label=str(label),
            count=int(count),
            percentage=round(count / max(total, 1) * 100, 2),
        )
        for label, count in counts.items()
    ]
    return DistributionSummary(name=name, buckets=buckets)


def _bucket_categorical(series: pd.Series, name: str, top_n: int = 8) -> DistributionSummary:
    valid = series.dropna().astype(str)
    if valid.empty:
        return DistributionSummary(name=name, buckets=[])

    counts = valid.value_counts().head(top_n)
    total = int(valid.count())
    buckets = [
        DistributionBucket(
            label=str(label),
            count=int(count),
            percentage=round(count / max(total, 1) * 100, 2),
        )
        for label, count in counts.items()
    ]
    return DistributionSummary(name=name, buckets=buckets)


def compute_distributions(df: pd.DataFrame) -> List[DistributionSummary]:
    distributions: List[DistributionSummary] = []

    if "revenue" in df.columns:
        distributions.append(_bucket_numeric(df["revenue"], "revenue_distribution"))
    if "profit" in df.columns:
        distributions.append(_bucket_numeric(df["profit"], "profit_distribution"))
    if "revenue" in df.columns:
        distributions.append(_bucket_numeric(df["revenue"], "order_value_distribution"))

    for col, name in [
        ("age_group", "customer_age_group_distribution"),
        ("category", "product_category_distribution"),
        ("payment_method", "payment_method_distribution"),
        ("region", "region_distribution"),
    ]:
        if col in df.columns:
            distributions.append(_bucket_categorical(df[col], name))

    if "store_code" in df.columns and "revenue" in df.columns:
        store_rev = df.groupby("store_code")["revenue"].sum().sort_values(ascending=False).head(10)
        total = float(store_rev.sum()) or 1.0
        buckets = [
            DistributionBucket(
                label=str(store),
                count=1,
                percentage=round(float(rev) / total * 100, 2),
            )
            for store, rev in store_rev.items()
        ]
        distributions.append(DistributionSummary(name="store_performance_distribution", buckets=buckets))

    return distributions


def compute_distributions_polars(df: pd.DataFrame) -> List[DistributionSummary]:
    """Optional Polars path for categorical counts — falls back to pandas."""
    try:
        import polars as pl

        pl_df = pl.from_pandas(df)
        results: List[DistributionSummary] = []
        if "region" in pl_df.columns:
            grouped = (
                pl_df.group_by("region")
                .agg(pl.len().alias("count"))
                .sort("count", descending=True)
            )
            total = grouped["count"].sum() or 1
            buckets = [
                DistributionBucket(
                    label=row["region"],
                    count=row["count"],
                    percentage=round(row["count"] / total * 100, 2),
                )
                for row in grouped.iter_rows(named=True)
            ]
            results.append(DistributionSummary(name="region_distribution_polars", buckets=buckets))
        return results if results else compute_distributions(df)
    except ImportError:
        return compute_distributions(df)
