"""Customer analytics and segmentation."""

from __future__ import annotations

import pandas as pd

from app.analytics.models import BreakdownRow, CustomerAnalytics


def compute_customer_analytics(df: pd.DataFrame) -> CustomerAnalytics:
    if "customer_id" not in df.columns:
        return CustomerAnalytics()

    work = df.copy()
    work["revenue"] = pd.to_numeric(work.get("revenue"), errors="coerce").fillna(0)

    new_count = int(work["is_new_customer"].sum()) if "is_new_customer" in work.columns else 0
    returning = work["customer_id"].nunique() - new_count if new_count else work["customer_id"].nunique()

    segments = []
    if "age_group" in work.columns:
        seg = work.groupby("age_group")["revenue"].agg(["sum", "count"]).reset_index()
        for _, row in seg.iterrows():
            segments.append(
                BreakdownRow(
                    dimension=str(row["age_group"]),
                    value=round(float(row["sum"]), 2),
                    count=int(row["count"]),
                )
            )

    membership = []
    if "membership_tier" in work.columns:
        mem = work.groupby("membership_tier").size()
        total = int(mem.sum()) or 1
        for tier, count in mem.items():
            membership.append(
                BreakdownRow(
                    dimension=str(tier),
                    count=int(count),
                    value=0,
                    percentage=round(count / total * 100, 2),
                )
            )

    cust_rev = work.groupby("customer_id")["revenue"].sum().sort_values(ascending=False).head(10)
    total = float(work["revenue"].sum()) or 1.0
    contribution = [
        BreakdownRow(
            dimension=str(cid),
            value=round(float(rev), 2),
            percentage=round(float(rev) / total * 100, 2),
        )
        for cid, rev in cust_rev.items()
    ]

    avg_spend = float(work.groupby("customer_id")["revenue"].sum().mean())
    freq = len(work) / max(work["customer_id"].nunique(), 1)
    clv = round(avg_spend * freq * 1.2, 2)

    segment_score = min(100.0, round(avg_spend / 1000 * 10 + freq * 5, 2))

    return CustomerAnalytics(
        new_customers=new_count,
        returning_customers=int(returning),
        segments=segments,
        membership_distribution=membership,
        revenue_contribution=contribution,
        average_spend=round(avg_spend, 2),
        purchase_frequency=round(freq, 2),
        clv_placeholder=clv,
        segment_score=segment_score,
    )
