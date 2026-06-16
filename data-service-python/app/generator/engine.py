"""Orchestrates synthetic retail dataset generation."""

import time
from datetime import date
from typing import Any, Callable, Dict, Optional

import numpy as np
import pandas as pd
from faker import Faker

from app.generator.customers import generate_customers
from app.generator.export import estimate_size_bytes
from app.generator.inventory import generate_inventory
from app.generator.products import generate_products
from app.generator.promotions import generate_promotions
from app.generator.returns import generate_returns
from app.generator.sales import generate_sales
from app.generator.stores import generate_stores
from app.generator.suppliers import generate_suppliers
from app.generator.validation import apply_data_quality


class GenerationEngine:
    """Coordinates entity generators and data quality simulation."""

    def __init__(self, config: Dict[str, Any], seed: Optional[int] = None):
        self.config = config
        self.seed = seed or int(time.time())
        self.rng = np.random.default_rng(self.seed)
        self.faker = Faker("ja_JP")
        Faker.seed(self.seed)

    def run(
        self,
        progress_callback: Optional[Callable[[str, float], None]] = None,
    ) -> Dict[str, pd.DataFrame]:
        cfg = self.config
        counts = cfg["counts"]
        simulation = cfg["simulation"]
        quality = cfg["data_quality"]

        start_date = date.fromisoformat(simulation["start_date"])
        end_date = date.fromisoformat(simulation["end_date"])

        steps = [
            ("suppliers", 0.08),
            ("stores", 0.12),
            ("products", 0.15),
            ("customers", 0.18),
            ("inventory", 0.22),
            ("promotions", 0.25),
            ("sales", 0.85),
            ("returns", 0.95),
            ("quality", 1.0),
        ]
        progress_base = 0.0

        def report(step: str, fraction: float = 1.0) -> None:
            if progress_callback:
                step_weight = next(s[1] for s in steps if s[0] == step)
                prev_weight = 0.0
                for name, weight in steps:
                    if name == step:
                        break
                    prev_weight = weight
                overall = prev_weight + (step_weight - prev_weight) * fraction
                progress_callback(step, overall * 100)

        report("suppliers", 0)
        suppliers = generate_suppliers(
            counts["suppliers"],
            self.faker,
            self.rng,
            simulation["regional_distribution"],
        )
        report("suppliers", 1)

        report("stores", 0)
        stores = generate_stores(
            counts["stores"],
            self.faker,
            self.rng,
            simulation["regional_distribution"],
            simulation["store_popularity"],
            start_date,
        )
        report("stores", 1)

        report("products", 0)
        products = generate_products(
            counts["products"],
            self.faker,
            self.rng,
            counts["suppliers"],
            simulation["product_popularity"],
        )
        report("products", 1)

        report("customers", 0)
        customers = generate_customers(
            counts["customers"],
            self.faker,
            self.rng,
            simulation["regional_distribution"],
            start_date,
        )
        report("customers", 1)

        report("inventory", 0)
        inventory = generate_inventory(counts["stores"], counts["products"], self.rng)
        report("inventory", 1)

        report("promotions", 0)
        promotions = generate_promotions(
            counts["promotions"],
            self.faker,
            self.rng,
            start_date,
            end_date,
            simulation["promotion_impact"],
        )
        report("promotions", 1)

        report("sales", 0)

        def sales_progress(fraction: float) -> None:
            report("sales", fraction)

        sales_transactions, sales_items = generate_sales(
            counts["sales_transactions"],
            stores,
            products,
            customers,
            promotions,
            self.rng,
            start_date,
            end_date,
            simulation["seasonal_demand"],
            simulation["weekend_sales_boost"],
            simulation["holiday_sales_boost"],
            simulation["promotion_impact"],
            progress_callback=sales_progress,
        )
        report("sales", 1)

        report("returns", 0)
        returns = generate_returns(
            counts["returns"],
            sales_transactions,
            sales_items,
            self.rng,
        )
        report("returns", 1)

        datasets: Dict[str, pd.DataFrame] = {
            "stores": stores,
            "suppliers": suppliers,
            "products": products,
            "customers": customers,
            "inventory": inventory,
            "promotions": promotions,
            "sales_transactions": sales_transactions,
            "sales_transaction_items": sales_items,
            "returns": returns,
        }

        report("quality", 0)
        for name, df in datasets.items():
            if not df.empty:
                datasets[name] = apply_data_quality(
                    df,
                    quality["missing_values_pct"],
                    quality["duplicate_rows_pct"],
                    quality["invalid_records_pct"],
                    quality["outliers_pct"],
                    quality["null_values_pct"],
                    self.rng,
                )
        report("quality", 1)

        return datasets

    def build_summary(self, datasets: Dict[str, pd.DataFrame], duration_seconds: float) -> Dict[str, Any]:
        entity_counts = {name: len(df) for name, df in datasets.items()}
        total_records = sum(entity_counts.values())
        size_bytes = estimate_size_bytes(datasets)

        region_breakdown: Dict[str, int] = {}
        if "stores" in datasets and not datasets["stores"].empty:
            region_breakdown = datasets["stores"]["region"].value_counts().to_dict()

        return {
            "entity_counts": entity_counts,
            "total_records": total_records,
            "estimated_size_bytes": size_bytes,
            "estimated_size_mb": round(size_bytes / (1024 * 1024), 2),
            "generation_duration_seconds": round(duration_seconds, 2),
            "region_breakdown": region_breakdown,
            "inventory_records": entity_counts.get("inventory", 0),
            "seed": self.seed,
        }
