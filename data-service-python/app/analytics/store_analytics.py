"""Store performance analytics."""

from __future__ import annotations

import pandas as pd

from app.analytics.models import StoreAnalytics, StoreRankRow
from app.analytics.performance_score import score_stores


def compute_store_analytics(df: pd.DataFrame) -> StoreAnalytics:
    if "store_code" not in df.columns:
        return StoreAnalytics()

    work = df.copy()
    work["revenue"] = pd.to_numeric(work.get("revenue"), errors="coerce").fillna(0)
    work["profit"] = pd.to_numeric(work.get("profit"), errors="coerce").fillna(0)

    scores = score_stores(work)
    rankings: list = []

    for store, group in work.groupby("store_code"):
        rev = float(group["revenue"].sum())
        orders = len(group)
        prof = float(group["profit"].sum())
        rankings.append(
            StoreRankRow(
                store_code=str(store),
                revenue=round(rev, 2),
                orders=orders,
                profit=round(prof, 2),
                average_order_value=round(rev / max(orders, 1), 2),
                performance_score=scores.get(str(store), 0.0),
            )
        )

    rankings.sort(key=lambda r: r.performance_score, reverse=True)
    high = [r.store_code for r in rankings[:3]]
    low = [r.store_code for r in rankings[-3:] if len(rankings) >= 3]

    return StoreAnalytics(rankings=rankings[:20], high_performers=high, underperformers=low)
