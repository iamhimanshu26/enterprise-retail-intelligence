"""Forecasting engine orchestrator."""

from __future__ import annotations

import time
from typing import Optional, Tuple

import pandas as pd

from app.analytics.data import load_analytics_data
from app.forecasting.accuracy import compute_accuracy_report
from app.forecasting.demand_forecast import compute_demand_forecast
from app.forecasting.inventory_forecast import compute_inventory_forecast
from app.forecasting.models import ForecastingOverview, ForecastingReport
from app.forecasting.revenue_forecast import compute_revenue_forecast
from app.forecasting.sales_forecast import compute_sales_forecast
from app.forecasting.scenarios import build_scenario_outputs
from app.forecasting.store_forecast import compute_store_forecast
from app.forecasting.features import aggregate_time_series


class ForecastingEngine:
    def __init__(self, df: Optional[pd.DataFrame] = None, data_source: str = "sample") -> None:
        if df is None:
            df, data_source = load_analytics_data()
        self.df = df
        self.data_source = data_source

    def run(self) -> ForecastingReport:
        start = time.time()
        df = self.df

        sales = compute_sales_forecast(df)
        revenue = compute_revenue_forecast(df)
        demand = compute_demand_forecast(df)
        inventory = compute_inventory_forecast(df)
        stores = compute_store_forecast(df)

        daily_rev = aggregate_time_series(df, "revenue", "D")
        accuracy = compute_accuracy_report(daily_rev.values)
        base_forecast = float(revenue.monthly.points[0].predicted_value) if revenue.monthly.points else float(daily_rev.mean())
        scenarios = build_scenario_outputs(base_forecast, metric="revenue")

        overview = ForecastingOverview(
            modules=[
                "sales", "revenue", "demand", "inventory", "stores", "accuracy", "scenarios",
            ],
            data_source=self.data_source,
        )

        return ForecastingReport(
            overview=overview,
            sales=sales,
            revenue=revenue,
            demand=demand,
            inventory=inventory,
            stores=stores,
            accuracy=accuracy,
            scenarios=scenarios,
            execution_time_seconds=round(time.time() - start, 3),
        )


def load_forecasting_data() -> Tuple[pd.DataFrame, str]:
    return load_analytics_data()


def run_sample_forecasting() -> ForecastingReport:
    return ForecastingEngine().run()
