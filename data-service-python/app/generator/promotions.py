"""Synthetic promotion generation."""

from datetime import date, timedelta
from typing import Any, Dict, List

import numpy as np
import pandas as pd
from faker import Faker

from app.generator.constants import JAPAN_REGIONS, PROMOTION_STATUSES, PROMOTION_TYPES, PRODUCT_CATEGORIES


def generate_promotions(
    count: int,
    faker: Faker,
    rng: np.random.Generator,
    start_date: date,
    end_date: date,
    promotion_impact: float,
) -> pd.DataFrame:
    if count == 0:
        return pd.DataFrame(
            columns=[
                "promotion_code",
                "promotion_name",
                "promotion_type",
                "start_date",
                "end_date",
                "discount_rate",
                "target_category",
                "target_region",
                "status",
                "impact_multiplier",
            ]
        )

    span_days = max((end_date - start_date).days, 1)
    rows: List[Dict[str, Any]] = []

    for i in range(count):
        promo_start_offset = int(rng.integers(0, max(span_days - 7, 1)))
        promo_start = start_date + timedelta(days=promo_start_offset)
        promo_end = min(promo_start + timedelta(days=int(rng.integers(7, 60))), end_date)
        category = PRODUCT_CATEGORIES[i % len(PRODUCT_CATEGORIES)][0]
        promo_type = rng.choice(PROMOTION_TYPES)

        discount_rate = None
        if promo_type == "PERCENTAGE":
            discount_rate = round(float(rng.uniform(5, 40)), 2)
        elif promo_type == "FIXED_AMOUNT":
            discount_rate = round(float(rng.uniform(100, 2000)), 2)

        rows.append(
            {
                "promotion_code": f"PROM-{i + 1:05d}",
                "promotion_name": f"{faker.catch_phrase()} Campaign",
                "promotion_type": promo_type,
                "start_date": promo_start.isoformat(),
                "end_date": promo_end.isoformat(),
                "discount_rate": discount_rate,
                "target_category": category,
                "target_region": rng.choice(JAPAN_REGIONS),
                "status": rng.choice(PROMOTION_STATUSES, p=[0.5, 0.2, 0.2, 0.1]),
                "impact_multiplier": round(1.0 + promotion_impact * rng.uniform(0.5, 1.5), 3),
            }
        )

    return pd.DataFrame(rows)
