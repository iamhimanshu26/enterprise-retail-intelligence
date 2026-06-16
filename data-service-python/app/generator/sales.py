"""Synthetic sales transaction generation."""

from datetime import date, datetime, timedelta
from typing import Any, Callable, Dict, List, Optional, Tuple

import numpy as np
import pandas as pd

from app.generator.constants import PAYMENT_METHODS, TRANSACTION_STATUSES


def generate_sales(
    transaction_count: int,
    store_df: pd.DataFrame,
    product_df: pd.DataFrame,
    customer_df: pd.DataFrame,
    promotion_df: pd.DataFrame,
    rng: np.random.Generator,
    start_date: date,
    end_date: date,
    seasonal_demand: bool,
    weekend_boost: float,
    holiday_boost: float,
    promotion_impact: float,
    progress_callback: Optional[Callable[[float], None]] = None,
    chunk_size: int = 5000,
) -> Tuple[pd.DataFrame, pd.DataFrame]:
    if transaction_count == 0 or store_df.empty or product_df.empty:
        return pd.DataFrame(), pd.DataFrame()

    span_seconds = max((end_date - start_date).days * 86400, 86400)
    store_pop = store_df["popularity_score"].to_numpy() if "popularity_score" in store_df else np.ones(len(store_df))
    product_pop = product_df["popularity_score"].to_numpy() if "popularity_score" in product_df else np.ones(len(product_df))
    store_weights = store_pop / store_pop.sum()
    product_weights = product_pop / product_pop.sum()

    transaction_rows: List[Dict[str, Any]] = []
    item_rows: List[Dict[str, Any]] = []
    item_id = 0

    for chunk_start in range(0, transaction_count, chunk_size):
        chunk_end = min(chunk_start + chunk_size, transaction_count)
        for tx_idx in range(chunk_start, chunk_end):
            store_idx = int(rng.choice(len(store_df), p=store_weights))
            customer_idx = int(rng.integers(0, len(customer_df))) if len(customer_df) > 0 and rng.random() < 0.75 else None

            offset = int(rng.integers(0, span_seconds))
            tx_datetime = datetime.combine(start_date, datetime.min.time()) + timedelta(seconds=offset)
            demand_multiplier = _demand_multiplier(
                tx_datetime,
                seasonal_demand,
                weekend_boost,
                holiday_boost,
                promotion_impact,
                promotion_df,
                product_df.iloc[int(rng.choice(len(product_df), p=product_weights))]["category"],
            )

            line_count = max(1, int(rng.integers(1, 6) * demand_multiplier))
            line_count = min(line_count, 12)

            total_amount = 0.0
            total_cost = 0.0
            discount_total = 0.0
            tax_total = 0.0

            for _ in range(line_count):
                product_idx = int(rng.choice(len(product_df), p=product_weights))
                product = product_df.iloc[product_idx]
                quantity = max(1, int(rng.integers(1, 4) * demand_multiplier))
                unit_price = float(product["unit_price"])
                cost_price = float(product["cost_price"])
                line_discount = round(unit_price * quantity * float(rng.uniform(0, 0.15)), 2)
                line_total = round(unit_price * quantity - line_discount, 2)
                line_profit = round(line_total - cost_price * quantity, 2)

                item_rows.append(
                    {
                        "item_id": item_id,
                        "transaction_index": tx_idx,
                        "product_index": product_idx,
                        "quantity": quantity,
                        "unit_price": unit_price,
                        "cost_price": cost_price,
                        "discount_amount": line_discount,
                        "line_total": line_total,
                        "gross_profit": line_profit,
                    }
                )
                item_id += 1
                total_amount += line_total
                total_cost += cost_price * quantity
                discount_total += line_discount

            tax_total = round(total_amount * 0.1, 2)
            gross_profit = round(total_amount - total_cost, 2)

            transaction_rows.append(
                {
                    "transaction_index": tx_idx,
                    "transaction_code": f"TX-{tx_datetime.strftime('%Y%m%d')}-{tx_idx + 1:08d}",
                    "store_index": store_idx,
                    "customer_index": customer_idx,
                    "transaction_date": tx_datetime.isoformat(),
                    "payment_method": rng.choice(PAYMENT_METHODS),
                    "total_amount": round(total_amount + tax_total, 2),
                    "total_cost": round(total_cost, 2),
                    "gross_profit": gross_profit,
                    "discount_amount": round(discount_total, 2),
                    "tax_amount": tax_total,
                    "transaction_status": rng.choice(TRANSACTION_STATUSES, p=[0.94, 0.03, 0.02, 0.01]),
                }
            )

        if progress_callback:
            progress_callback(chunk_end / transaction_count)

    return pd.DataFrame(transaction_rows), pd.DataFrame(item_rows)


def _demand_multiplier(
    tx_datetime: datetime,
    seasonal_demand: bool,
    weekend_boost: float,
    holiday_boost: float,
    promotion_impact: float,
    promotion_df: pd.DataFrame,
    product_category: str,
) -> float:
    multiplier = 1.0

    if seasonal_demand:
        month = tx_datetime.month
        seasonal = 1.0 + 0.2 * np.sin((month - 1) * np.pi / 6)
        multiplier *= seasonal

    if tx_datetime.weekday() >= 5:
        multiplier *= 1.0 + weekend_boost

    if tx_datetime.month == 12 or tx_datetime.month == 1:
        multiplier *= 1.0 + holiday_boost

    if not promotion_df.empty and promotion_impact > 0:
        tx_date = tx_datetime.date()
        active = promotion_df[
            (promotion_df["start_date"] <= tx_date.isoformat())
            & (promotion_df["end_date"] >= tx_date.isoformat())
        ]
        if not active.empty:
            category_match = active[active["target_category"] == product_category]
            if not category_match.empty:
                multiplier *= 1.0 + promotion_impact

    return max(multiplier, 0.5)
