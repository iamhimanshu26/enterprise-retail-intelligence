"""Helper utilities for generator modules."""

from typing import Dict, List, Optional

import numpy as np

from app.generator.constants import JAPAN_REGIONS, REGION_WEIGHTS


def get_region_weights(regional_distribution: bool) -> Optional[List[float]]:
    if not regional_distribution:
        return None
    weights = np.array([REGION_WEIGHTS[r] for r in JAPAN_REGIONS], dtype=np.float64)
    weights /= weights.sum()
    return weights.tolist()
