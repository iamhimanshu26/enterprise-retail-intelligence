"""Synthetic inventory generation."""

from datetime import datetime, timedelta
from typing import Any, Dict, List

import numpy as np
import pandas as pd

from app.generator.constants import MAX_INVENTORY_CROSS_PRODUCT, STOCK_STATUSES


def generate_inventory(
    store_count: int,
    product_count: int,
    rng: np.random.Generator,
) -> pd.DataFrame:
    cross = store_count * product_count
    rows: List[Dict[str, Any]] = []

    if cross <= MAX_INVENTORY_CROSS_PRODUCT:
        for store_idx in range(store_count):
            for product_idx in range(product_count):
                quantity = int(rng.integers(0, 500))
                reorder_level = int(rng.integers(10, 80))
                rows.append(_inventory_row(store_idx, product_idx, quantity, reorder_level, rng))
    else:
        # Sample representative inventory when cross product exceeds cap
        sample_size = min(MAX_INVENTORY_CROSS_PRODUCT, cross)
        store_indices = rng.integers(0, store_count, size=sample_size)
        product_indices = rng.integers(0, product_count, size=sample_size)
        seen = set()
        for store_idx, product_idx in zip(store_indices, product_indices):
            key = (int(store_idx), int(product_idx))
            if key in seen:
                continue
            seen.add(key)
            quantity = int(rng.integers(0, 500))
            reorder_level = int(rng.integers(10, 80))
            rows.append(_inventory_row(int(store_idx), int(product_idx), quantity, reorder_level, rng))

    return pd.DataFrame(rows)


def _inventory_row(
    store_idx: int,
    product_idx: int,
    quantity: int,
    reorder_level: int,
    rng: np.random.Generator,
) -> Dict[str, Any]:
    if quantity == 0:
        stock_status = "OUT_OF_STOCK"
    elif quantity <= reorder_level:
        stock_status = "LOW_STOCK"
    elif quantity > reorder_level * 4:
        stock_status = "OVERSTOCK"
    else:
        stock_status = "IN_STOCK"

    restock_days = int(rng.integers(1, 90))
    last_restocked = datetime.utcnow() - timedelta(days=restock_days)

    return {
        "store_index": store_idx,
        "product_index": product_idx,
        "quantity_on_hand": quantity,
        "reorder_level": reorder_level,
        "reorder_quantity": int(rng.integers(50, 300)),
        "stock_status": stock_status if stock_status in STOCK_STATUSES else rng.choice(STOCK_STATUSES),
        "last_restocked_at": last_restocked.isoformat(),
    }
