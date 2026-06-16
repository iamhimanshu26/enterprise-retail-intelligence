"""Synthetic store generation."""

from datetime import date, timedelta
from typing import Any, Dict, List

import numpy as np
import pandas as pd
from faker import Faker

from app.generator.utils import get_region_weights
from app.generator.constants import (
    JAPAN_REGIONS,
    REGION_PREFECTURES,
    STORE_STATUSES,
    STORE_TYPES,
)


def generate_stores(
    count: int,
    faker: Faker,
    rng: np.random.Generator,
    regional_distribution: bool,
    store_popularity: bool,
    start_date: date,
) -> pd.DataFrame:
    regions = JAPAN_REGIONS
    weights = get_region_weights(regional_distribution)

    rows: List[Dict[str, Any]] = []
    popularity_scores = rng.beta(2, 5, size=count) if store_popularity else np.ones(count)

    for i in range(count):
        region = rng.choice(regions, p=weights) if weights else rng.choice(regions)
        prefecture = rng.choice(REGION_PREFECTURES[region])
        city = faker.city()
        store_type = rng.choice(STORE_TYPES)
        opening_offset = rng.integers(365, 3650)
        opening_date = start_date - timedelta(days=int(opening_offset))

        rows.append(
            {
                "store_code": f"ST-{region[:3]}-{i + 1:05d}",
                "store_name": f"{faker.company()} {store_type} Store",
                "region": region,
                "prefecture": prefecture,
                "city": city,
                "address": faker.address().replace("\n", ", "),
                "store_type": store_type,
                "opening_date": opening_date.isoformat(),
                "status": rng.choice(STORE_STATUSES, p=[0.92, 0.05, 0.03]),
                "popularity_score": float(popularity_scores[i]),
            }
        )

    return pd.DataFrame(rows)
