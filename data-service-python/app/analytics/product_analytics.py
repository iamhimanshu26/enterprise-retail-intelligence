"""Product performance analytics."""

from __future__ import annotations

import pandas as pd

from app.analytics.models import BreakdownRow, ProductAnalytics, ProductRankRow
from app.analytics.performance_score import score_products


def compute_product_analytics(df: pd.DataFrame) -> ProductAnalytics:
    if "product_code" not in df.columns:
        return ProductAnalytics()

    work = df.copy()
    work["revenue"] = pd.to_numeric(work.get("revenue"), errors="coerce").fillna(0)
    work["profit"] = pd.to_numeric(work.get("profit"), errors="coerce").fillna(0)
    work["quantity"] = pd.to_numeric(work.get("quantity"), errors="coerce").fillna(0)
    total_rev = float(work["revenue"].sum()) or 1.0

    if "returned" in work.columns:
        work["_ret"] = work["returned"].astype(bool)
    else:
        work["_ret"] = pd.to_numeric(work.get("refund_amount"), errors="coerce").fillna(0) > 0

    scores = score_products(work)
    rows: list = []

    for product, group in work.groupby("product_code"):
        rev = float(group["revenue"].sum())
        units = int(group["quantity"].sum())
        ret_rate = group["_ret"].sum() / max(len(group), 1) * 100
        rows.append(
            ProductRankRow(
                product_code=str(product),
                revenue=round(rev, 2),
                units_sold=units,
                profit=round(float(group["profit"].sum()), 2),
                return_rate_pct=round(float(ret_rate), 2),
                contribution_pct=round(rev / total_rev * 100, 2),
                performance_score=scores.get(str(product), 0.0),
            )
        )

    rows.sort(key=lambda r: r.revenue, reverse=True)
    by_units = sorted(rows, key=lambda r: r.units_sold, reverse=True)
    slow = [r.product_code for r in sorted(rows, key=lambda r: r.units_sold)[:5]]
    high_ret = [r.product_code for r in sorted(rows, key=lambda r: r.return_rate_pct, reverse=True)[:5]]

    cat_perf = []
    if "category" in work.columns:
        cat = work.groupby("category")["revenue"].sum().sort_values(ascending=False)
        for cat_name, val in cat.items():
            cat_perf.append(
                BreakdownRow(
                    dimension=str(cat_name),
                    value=round(float(val), 2),
                    percentage=round(float(val) / total_rev * 100, 2),
                )
            )

    brand_perf = []
    if "brand" in work.columns:
        brand = work.groupby("brand")["revenue"].sum().sort_values(ascending=False)
        for name, val in brand.items():
            brand_perf.append(
                BreakdownRow(dimension=str(name), value=round(float(val), 2))
            )

    return ProductAnalytics(
        top_by_revenue=rows[:10],
        top_by_units=by_units[:10],
        slow_moving=slow,
        high_return=high_ret,
        category_performance=cat_perf,
        brand_performance=brand_perf,
    )
