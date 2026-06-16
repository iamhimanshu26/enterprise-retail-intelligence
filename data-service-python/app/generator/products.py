"""Synthetic product generation."""

from typing import Any, Dict, List

import numpy as np
import pandas as pd
from faker import Faker

from app.generator.constants import PRODUCT_CATEGORIES, PRODUCT_STATUSES


def generate_products(
    count: int,
    faker: Faker,
    rng: np.random.Generator,
    supplier_count: int,
    product_popularity: bool,
) -> pd.DataFrame:
    rows: List[Dict[str, Any]] = []
    popularity = rng.beta(2, 5, size=count) if product_popularity else np.ones(count)

    for i in range(count):
        category, subcats = PRODUCT_CATEGORIES[i % len(PRODUCT_CATEGORIES)]
        sub_category = rng.choice(subcats)
        unit_price = round(float(rng.uniform(5, 500)), 2)
        margin = float(rng.uniform(0.15, 0.55))
        cost_price = round(unit_price * (1 - margin), 2)
        supplier_idx = int(rng.integers(0, max(supplier_count, 1)))

        rows.append(
            {
                "product_code": f"PRD-{category[:3].upper()}-{i + 1:06d}",
                "product_name": f"{faker.word().capitalize()} {sub_category} {faker.word()}",
                "category": category,
                "sub_category": sub_category,
                "brand": faker.company(),
                "unit_price": unit_price,
                "cost_price": cost_price,
                "status": rng.choice(PRODUCT_STATUSES, p=[0.85, 0.1, 0.05]),
                "supplier_index": supplier_idx,
                "popularity_score": float(popularity[i]),
            }
        )

    return pd.DataFrame(rows)
