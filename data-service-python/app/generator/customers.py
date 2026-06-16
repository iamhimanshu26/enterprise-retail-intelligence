"""Synthetic customer generation."""

from datetime import date, timedelta
from typing import Any, Dict, List

import numpy as np
import pandas as pd
from faker import Faker

from app.generator.utils import get_region_weights
from app.generator.constants import (
    AGE_GROUPS,
    CUSTOMER_STATUSES,
    GENDERS,
    MEMBERSHIP_TIERS,
    REGION_PREFECTURES,
    JAPAN_REGIONS,
)


def generate_customers(
    count: int,
    faker: Faker,
    rng: np.random.Generator,
    regional_distribution: bool,
    start_date: date,
) -> pd.DataFrame:
    regions = JAPAN_REGIONS
    weights = get_region_weights(regional_distribution)

    rows: List[Dict[str, Any]] = []
    for i in range(count):
        region = rng.choice(regions, p=weights) if weights else rng.choice(regions)
        prefecture = rng.choice(REGION_PREFECTURES[region])
        joined_offset = int(rng.integers(30, 1825))
        joined_date = start_date - timedelta(days=joined_offset)

        rows.append(
            {
                "customer_code": f"CUS-{i + 1:08d}",
                "first_name": faker.first_name(),
                "last_name": faker.last_name(),
                "email": faker.email(),
                "phone": faker.phone_number(),
                "gender": rng.choice(GENDERS),
                "age_group": rng.choice(AGE_GROUPS),
                "prefecture": prefecture,
                "city": faker.city(),
                "membership_tier": rng.choice(MEMBERSHIP_TIERS, p=[0.55, 0.25, 0.15, 0.05]),
                "joined_date": joined_date.isoformat(),
                "status": rng.choice(CUSTOMER_STATUSES, p=[0.93, 0.05, 0.02]),
            }
        )

    return pd.DataFrame(rows)
