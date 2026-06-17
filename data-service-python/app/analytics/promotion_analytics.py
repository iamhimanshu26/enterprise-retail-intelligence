"""Promotion effectiveness analytics."""

from __future__ import annotations

import pandas as pd

from app.analytics.models import BreakdownRow, PromotionAnalytics


def compute_promotion_analytics(df: pd.DataFrame) -> PromotionAnalytics:
    work = df.copy()
    work["revenue"] = pd.to_numeric(work.get("revenue"), errors="coerce").fillna(0)
    work["discount_rate"] = pd.to_numeric(work.get("discount_rate"), errors="coerce").fillna(0)

    if "is_promotional" in work.columns:
        promo_mask = work["is_promotional"].astype(bool)
    elif "promotion_id" in work.columns:
        promo_mask = work["promotion_id"].notna()
    else:
        promo_mask = work["discount_rate"] > 5

    promo_rev = float(work.loc[promo_mask, "revenue"].sum())
    non_promo = float(work.loc[~promo_mask, "revenue"].sum())
    discount_eff = float(work.loc[promo_mask, "discount_rate"].mean()) if promo_mask.any() else 0.0

    cat_perf = []
    if "category" in work.columns and promo_mask.any():
        cat = work.loc[promo_mask].groupby("category")["revenue"].sum().sort_values(ascending=False)
        for name, val in cat.items():
            cat_perf.append(BreakdownRow(dimension=str(name), value=round(float(val), 2)))

    region_perf = []
    if "region" in work.columns and promo_mask.any():
        reg = work.loc[promo_mask].groupby("region")["revenue"].sum().sort_values(ascending=False)
        for name, val in reg.items():
            region_perf.append(BreakdownRow(dimension=str(name), value=round(float(val), 2)))

    roi = round(promo_rev / max(non_promo, 1) * 100, 2) if promo_rev > 0 else None

    return PromotionAnalytics(
        promotional_revenue=round(promo_rev, 2),
        non_promotional_revenue=round(non_promo, 2),
        discount_effectiveness_pct=round(discount_eff, 2),
        category_performance=cat_perf,
        region_performance=region_perf,
        promotion_roi_placeholder=roi,
    )
