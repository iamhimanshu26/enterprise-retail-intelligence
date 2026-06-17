"""Business analytics engine orchestrator."""

from __future__ import annotations

import time
from typing import Optional

import pandas as pd

from app.analytics.customer_analytics import compute_customer_analytics
from app.analytics.data import load_analytics_data
from app.analytics.inventory_analytics import compute_inventory_analytics
from app.analytics.kpi import compute_kpi_analytics
from app.analytics.models import AnalyticsOverview, BusinessAnalyticsReport
from app.analytics.performance_score import compute_performance_scores
from app.analytics.product_analytics import compute_product_analytics
from app.analytics.promotion_analytics import compute_promotion_analytics
from app.analytics.sales_analytics import compute_sales_analytics
from app.analytics.store_analytics import compute_store_analytics
from app.analytics.supplier_analytics import compute_supplier_analytics


class BusinessAnalyticsEngine:
    def __init__(self, df: Optional[pd.DataFrame] = None, data_source: str = "sample") -> None:
        if df is None:
            df, data_source = load_analytics_data()
        self.df = df
        self.data_source = data_source

    def run(self) -> BusinessAnalyticsReport:
        start = time.time()
        df = self.df

        kpis = compute_kpi_analytics(df)
        sales = compute_sales_analytics(df)
        stores = compute_store_analytics(df)
        products = compute_product_analytics(df)
        customers = compute_customer_analytics(df)
        inventory = compute_inventory_analytics(df)
        suppliers = compute_supplier_analytics(df)
        promotions = compute_promotion_analytics(df)
        performance = compute_performance_scores(
            df, stores, products, customers, inventory, suppliers
        )

        overview = AnalyticsOverview(
            modules=[
                "kpi", "sales", "stores", "products", "customers",
                "inventory", "suppliers", "promotions", "performance",
            ],
            data_source=self.data_source,
        )

        return BusinessAnalyticsReport(
            overview=overview,
            kpis=kpis,
            sales=sales,
            stores=stores,
            products=products,
            customers=customers,
            inventory=inventory,
            suppliers=suppliers,
            promotions=promotions,
            performance=performance,
            execution_time_seconds=round(time.time() - start, 3),
        )


def run_sample_analytics() -> BusinessAnalyticsReport:
    return BusinessAnalyticsEngine().run()
