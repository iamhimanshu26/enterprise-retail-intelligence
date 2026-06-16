"""Synthetic return transaction generation."""

from datetime import datetime, timedelta
from typing import Any, Dict, List

import numpy as np
import pandas as pd

from app.generator.constants import RETURN_REASONS, RETURN_STATUSES


def generate_returns(
    return_count: int,
    sales_df: pd.DataFrame,
    sales_items_df: pd.DataFrame,
    rng: np.random.Generator,
) -> pd.DataFrame:
    if return_count == 0 or sales_df.empty or sales_items_df.empty:
        return pd.DataFrame(
            columns=[
                "return_code",
                "transaction_index",
                "product_index",
                "store_index",
                "customer_index",
                "return_date",
                "quantity",
                "refund_amount",
                "reason",
                "status",
            ]
        )

    max_returns = min(return_count, len(sales_items_df))
    sampled_items = sales_items_df.sample(n=max_returns, random_state=int(rng.integers(0, 1_000_000)))

    rows: List[Dict[str, Any]] = []
    for i, item in enumerate(sampled_items.itertuples(index=False)):
        tx = sales_df.iloc[int(item.transaction_index)]
        quantity = max(1, int(item.quantity * rng.uniform(0.2, 1.0)))
        refund = round(float(item.line_total) * (quantity / max(item.quantity, 1)), 2)
        tx_date = datetime.fromisoformat(tx.transaction_date)
        return_date = tx_date + timedelta(days=int(rng.integers(1, 30)))

        rows.append(
            {
                "return_code": f"RET-{return_date.strftime('%Y%m%d')}-{i + 1:07d}",
                "transaction_index": int(item.transaction_index),
                "product_index": int(item.product_index),
                "store_index": int(tx.store_index),
                "customer_index": tx.customer_index,
                "return_date": return_date.isoformat(),
                "quantity": quantity,
                "refund_amount": refund,
                "reason": rng.choice(RETURN_REASONS),
                "status": rng.choice(RETURN_STATUSES, p=[0.85, 0.08, 0.04, 0.03]),
            }
        )

    return pd.DataFrame(rows)
