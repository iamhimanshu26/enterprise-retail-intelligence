"""Statistics engine orchestrator — unified report from warehouse or sample data."""

from __future__ import annotations

import time
from typing import Optional, Tuple

import numpy as np
import pandas as pd

from app.etl.warehouse import get_warehouse_loader
from app.statistics.business import compute_business_metrics
from app.statistics.descriptive import compute_descriptive_stats
from app.statistics.distribution import compute_distributions
from app.statistics.models import StatisticsOverview, UnifiedStatisticsReport
from app.statistics.quality import compute_dataset_health
from app.statistics.regional import compute_regional_stats
from app.statistics.time_series import compute_time_series_stats


def generate_sample_retail_data(rows: int = 500) -> pd.DataFrame:
    """Representative retail transaction dataset for statistics demos."""
    rng = np.random.default_rng(42)
    regions = ["KANTO", "KANSAI", "CHUBU", "KYUSHU", "HOKKAIDO"]
    categories = ["Electronics", "Groceries", "Apparel", "Home", "Beauty"]
    payments = ["CASH", "CREDIT_CARD", "DEBIT_CARD", "MOBILE_PAY"]
    age_groups = ["18-24", "25-34", "35-44", "45-54", "55+"]

    dates = pd.date_range("2024-01-01", periods=rows, freq="6h")
    quantities = rng.integers(1, 6, size=rows)
    unit_prices = rng.uniform(500, 15000, size=rows).round(2)
    discount_rates = rng.uniform(0, 15, size=rows).round(1)
    revenue = (unit_prices * quantities * (1 - discount_rates / 100)).round(2)
    cost = (revenue * rng.uniform(0.55, 0.85, size=rows)).round(2)
    profit = (revenue - cost).round(2)
    returned = rng.random(rows) < 0.04
    refund_amount = np.where(returned, revenue * rng.uniform(0.5, 1.0, size=rows), 0.0).round(2)

    return pd.DataFrame({
        "transaction_id": [f"TX-{i:06d}" for i in range(rows)],
        "transaction_date": dates,
        "store_code": [f"ST-{rng.choice(regions)[:3]}-{rng.integers(1, 50):05d}" for _ in range(rows)],
        "customer_id": [f"CU-{rng.integers(1, 200):06d}" for _ in range(rows)],
        "product_code": [f"PR-{rng.integers(1, 80):06d}" for _ in range(rows)],
        "region": rng.choice(regions, size=rows),
        "category": rng.choice(categories, size=rows),
        "payment_method": rng.choice(payments, size=rows),
        "age_group": rng.choice(age_groups, size=rows),
        "quantity": quantities,
        "discount_rate": discount_rates,
        "revenue": revenue,
        "cost": cost,
        "profit": profit,
        "refund_amount": refund_amount,
        "returned": returned,
        "inventory_quantity": rng.integers(0, 500, size=rows),
    })


def _warehouse_to_transactions() -> Optional[pd.DataFrame]:
    """Build transaction-like frame from warehouse tables if available."""
    loader = get_warehouse_loader()
    fact = loader.get_table("fact_sales") if hasattr(loader, "get_table") else None
    dim_store = loader.get_table("dim_store") if hasattr(loader, "get_table") else None

    if fact is None or fact.empty:
        return None

    df = fact.copy()
    if dim_store is not None and not dim_store.empty:
        store_key = "store_key" if "store_key" in dim_store.columns else "store_code"
        region_col = "region" if "region" in dim_store.columns else None
        if store_key in dim_store.columns and region_col:
            merge_key = "store_key" if "store_key" in df.columns else "store_code"
            if merge_key in df.columns:
                df = df.merge(
                    dim_store[[store_key, region_col]].drop_duplicates(),
                    left_on=merge_key,
                    right_on=store_key,
                    how="left",
                )
    return df


def load_statistics_data(use_sample: bool = True) -> Tuple[pd.DataFrame, str]:
    if not use_sample:
        wh = _warehouse_to_transactions()
        if wh is not None and not wh.empty:
            return wh, "warehouse"

    wh = _warehouse_to_transactions()
    if wh is not None and len(wh) >= 10:
        return wh, "warehouse"

    return generate_sample_retail_data(), "sample"


class StatisticsEngine:
    def __init__(self, df: Optional[pd.DataFrame] = None, data_source: str = "sample") -> None:
        if df is None:
            df, data_source = load_statistics_data()
        self.df = df
        self.data_source = data_source

    def run(self) -> UnifiedStatisticsReport:
        start = time.time()
        df = self.df

        descriptive = compute_descriptive_stats(df)
        business = compute_business_metrics(df)
        distributions = compute_distributions(df)
        time_series = compute_time_series_stats(df)
        regional = compute_regional_stats(df)
        health = compute_dataset_health(df)

        overview = StatisticsOverview(
            modules=[
                "descriptive", "business", "distribution",
                "time_series", "regional", "health",
            ],
            supported_metrics=[
                "mean", "median", "variance", "std", "AOV", "profit_margin",
                "return_rate", "regional_revenue", "monthly_revenue",
            ],
            data_source=self.data_source,
        )

        return UnifiedStatisticsReport(
            overview=overview,
            descriptive=descriptive,
            business=business,
            distributions=distributions,
            time_series=time_series,
            regional=regional,
            health=health,
            execution_time_seconds=round(time.time() - start, 3),
        )


def run_sample_statistics() -> UnifiedStatisticsReport:
    """Run full statistics report on sample or warehouse data."""
    engine = StatisticsEngine()
    return engine.run()
