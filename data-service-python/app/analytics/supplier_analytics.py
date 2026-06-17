"""Supplier analytics and reliability scoring."""

from __future__ import annotations

import pandas as pd

from app.analytics.models import SupplierAnalytics, SupplierRankRow


def compute_supplier_analytics(df: pd.DataFrame) -> SupplierAnalytics:
    if "supplier_id" not in df.columns:
        return SupplierAnalytics()

    work = df.copy()
    work["revenue"] = pd.to_numeric(work.get("revenue"), errors="coerce").fillna(0)
    total = float(work["revenue"].sum()) or 1.0

    rankings: list = []
    for sid, group in work.groupby("supplier_id"):
        rev = float(group["revenue"].sum())
        products = group["product_code"].nunique() if "product_code" in group.columns else len(group)
        name = group["supplier_name"].iloc[0] if "supplier_name" in group.columns else str(sid)
        reliability = min(100.0, 70 + (rev / total * 100))
        risk = max(0.0, 100 - reliability)
        rankings.append(
            SupplierRankRow(
                supplier_id=str(sid),
                supplier_name=str(name),
                product_count=int(products),
                revenue_contribution=round(rev / total * 100, 2),
                reliability_score=round(reliability, 2),
                risk_score=round(risk, 2),
            )
        )

    rankings.sort(key=lambda r: r.revenue_contribution, reverse=True)
    delayed = [r.supplier_id for r in sorted(rankings, key=lambda r: r.reliability_score)[:3]]

    return SupplierAnalytics(rankings=rankings[:15], delayed_suppliers=delayed)
