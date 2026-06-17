"""Sample retail dataset for business analytics — extends statistics sample."""

from __future__ import annotations

from typing import Optional, Tuple

import numpy as np
import pandas as pd

from app.statistics.engine import generate_sample_retail_data, load_statistics_data


def generate_analytics_retail_data(rows: int = 800) -> pd.DataFrame:
    """Rich transaction dataset with supplier, promotion, inventory, and customer fields."""
    rng = np.random.default_rng(42)
    base = generate_sample_retail_data(rows=rows)

    suppliers = [f"SUP-{i:04d}" for i in range(1, 21)]
    supplier_names = [f"Supplier {i}" for i in range(1, 21)]
    promotions = [("PROMO-001", "Summer Sale"), ("PROMO-002", "Member Discount"), (None, None)]
    brands = ["AEON", "Seven Premium", "TopValu", "Private Label", "Import Select"]
    tiers = ["Gold", "Silver", "Bronze", "Standard"]

    promo_choices = rng.choice(len(promotions), size=rows)
    promo_ids = [promotions[i][0] for i in promo_choices]
    promo_names = [promotions[i][1] for i in promo_choices]
    is_promo = [pid is not None for pid in promo_ids]

    stock = rng.integers(0, 400, size=rows)
    reorder = rng.integers(20, 80, size=rows)

    base["supplier_id"] = rng.choice(suppliers, size=rows)
    base["supplier_name"] = base["supplier_id"].map(
        {s: supplier_names[i] for i, s in enumerate(suppliers)}
    )
    base["promotion_id"] = promo_ids
    base["promotion_name"] = promo_names
    base["is_promotional"] = is_promo
    base["brand"] = rng.choice(brands, size=rows)
    base["membership_tier"] = rng.choice(tiers, size=rows, p=[0.15, 0.25, 0.3, 0.3])
    base["stock_on_hand"] = stock
    base["reorder_level"] = reorder
    base["is_new_customer"] = rng.random(rows) < 0.25
    base["unit_cost"] = (base["cost"] / base["quantity"].clip(lower=1)).round(2)

    return base


def load_analytics_data() -> Tuple[pd.DataFrame, str]:
    wh_df, source = load_statistics_data()
    if source == "warehouse" and wh_df is not None and len(wh_df) >= 10:
        return wh_df, "warehouse"
    return generate_analytics_retail_data(), "sample"
