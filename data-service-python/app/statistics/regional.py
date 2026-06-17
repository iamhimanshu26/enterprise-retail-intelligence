"""Regional statistics using Japanese retail regions."""

from __future__ import annotations

import pandas as pd

from app.statistics.models import RegionalStatRow, RegionalStats

JAPAN_REGIONS = [
    "HOKKAIDO", "TOHOKU", "KANTO", "CHUBU", "KANSAI",
    "CHUGOKU", "SHIKOKU", "KYUSHU", "OKINAWA",
]


def compute_regional_stats(df: pd.DataFrame) -> RegionalStats:
    if "region" not in df.columns:
        return RegionalStats()

    work = df.copy()
    work["region"] = work["region"].astype(str).str.upper()
    work["revenue"] = pd.to_numeric(work.get("revenue"), errors="coerce").fillna(0)
    work["profit"] = pd.to_numeric(work.get("profit"), errors="coerce")
    if work["profit"].isna().all() and "cost" in work.columns:
        work["profit"] = work["revenue"] - pd.to_numeric(work["cost"], errors="coerce").fillna(0)
    work["profit"] = work["profit"].fillna(0)

    if "returned" in work.columns:
        work["_returned"] = work["returned"].astype(bool)
    else:
        refunds = pd.to_numeric(work.get("refund_amount"), errors="coerce").fillna(0)
        work["_returned"] = refunds > 0

    rows: list = []
    for region, group in work.groupby("region"):
        orders = len(group)
        customers = group["customer_id"].nunique() if "customer_id" in group.columns else orders
        rev = float(group["revenue"].sum())
        rows.append(
            RegionalStatRow(
                region=str(region),
                revenue=round(rev, 2),
                profit=round(float(group["profit"].sum()), 2),
                orders=orders,
                customers=int(customers),
                average_order_value=round(rev / max(orders, 1), 2),
                return_rate_pct=round(group["_returned"].sum() / max(orders, 1) * 100, 2),
            )
        )

    rows.sort(key=lambda r: r.revenue, reverse=True)
    top = rows[0].region if rows else None
    lowest = rows[-1].region if rows else None

    return RegionalStats(
        rows=rows,
        top_region=top,
        lowest_region=lowest,
        fastest_growing_region=None,
    )
