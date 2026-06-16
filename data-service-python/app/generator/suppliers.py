"""Synthetic supplier generation."""

from typing import Any, Dict, List

import numpy as np
import pandas as pd
from faker import Faker

from app.generator.utils import get_region_weights
from app.generator.constants import JAPAN_REGIONS, SUPPLIER_STATUSES


def generate_suppliers(
    count: int,
    faker: Faker,
    rng: np.random.Generator,
    regional_distribution: bool,
) -> pd.DataFrame:
    regions = JAPAN_REGIONS
    weights = get_region_weights(regional_distribution)

    rows: List[Dict[str, Any]] = []
    for i in range(count):
        region = rng.choice(regions, p=weights) if weights else rng.choice(regions)
        rows.append(
            {
                "supplier_code": f"SUP-{i + 1:06d}",
                "supplier_name": f"{faker.company()} Trading Co.",
                "contact_email": faker.company_email(),
                "contact_phone": faker.phone_number(),
                "region": region,
                "country": "Japan",
                "reliability_score": round(float(rng.uniform(65, 99)), 2),
                "status": rng.choice(SUPPLIER_STATUSES, p=[0.9, 0.07, 0.03]),
            }
        )

    return pd.DataFrame(rows)
