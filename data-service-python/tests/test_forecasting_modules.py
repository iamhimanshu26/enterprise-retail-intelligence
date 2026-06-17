"""Unit tests for forecasting feature engineering and accuracy."""

import unittest

import numpy as np
import pandas as pd

from app.forecasting.accuracy import compute_accuracy_metrics, compute_accuracy_report
from app.forecasting.features import (
    add_date_features,
    build_forecast_points,
    generate_forecast,
    trend_direction,
)
from app.forecasting.scenarios import build_scenario_outputs
from app.forecasting.sales_forecast import compute_sales_forecast
from app.forecasting.revenue_forecast import compute_revenue_forecast
from app.forecasting.demand_forecast import compute_demand_forecast
from app.forecasting.inventory_forecast import compute_inventory_forecast
from app.forecasting.store_forecast import compute_store_forecast
from app.analytics.data import generate_analytics_retail_data
from app.statistics.engine import generate_sample_retail_data


class ForecastingFeatureTest(unittest.TestCase):
    def test_date_features(self):
        df = generate_sample_retail_data(rows=50)
        enriched = add_date_features(df)
        self.assertIn("day_of_week", enriched.columns)
        self.assertIn("is_weekend", enriched.columns)

    def test_generate_forecast(self):
        series = np.array([10, 12, 11, 13, 14, 15, 16], dtype=float)
        preds, model = generate_forecast(pd.Series(series), horizon=3, model_name="moving_average")
        self.assertEqual(len(preds), 3)
        self.assertEqual(model, "moving_average")

    def test_build_forecast_points(self):
        dates = pd.date_range("2024-01-01", periods=20, freq="D")
        series = pd.Series(np.linspace(100, 200, 20), index=dates)
        points = build_forecast_points(series, 5, "linear_regression", "daily", "D")
        self.assertEqual(len(points), 5)
        self.assertIn("forecast_date", points[0])

    def test_trend_direction(self):
        self.assertEqual(trend_direction(np.array([1, 2, 3, 4, 5])), "upward")
        self.assertEqual(trend_direction(np.array([5, 4, 3, 2, 1])), "downward")


class ForecastingModulesTest(unittest.TestCase):
    def setUp(self):
        self.df = generate_analytics_retail_data(rows=800)

    def test_sales_forecast(self):
        result = compute_sales_forecast(self.df)
        self.assertGreater(len(result.daily.points), 0)

    def test_revenue_forecast(self):
        result = compute_revenue_forecast(self.df)
        self.assertGreater(len(result.quarterly.points), 0)

    def test_demand_forecast(self):
        result = compute_demand_forecast(self.df)
        self.assertGreater(len(result.product_demand), 0)

    def test_inventory_forecast(self):
        result = compute_inventory_forecast(self.df)
        self.assertGreater(len(result.items), 0)

    def test_store_forecast(self):
        result = compute_store_forecast(self.df)
        self.assertGreater(len(result.stores), 0)


class ForecastingAccuracyScenarioTest(unittest.TestCase):
    def test_accuracy_metrics(self):
        actual = np.array([100, 110, 105, 115])
        predicted = np.array([102, 108, 107, 112])
        metrics = compute_accuracy_metrics(actual, predicted, "revenue", "moving_average")
        self.assertGreater(metrics.accuracy_score, 0)

    def test_accuracy_report(self):
        values = np.linspace(100, 200, 30)
        report = compute_accuracy_report(values)
        self.assertGreater(report.overall_accuracy_score, 0)

    def test_scenarios(self):
        scenarios = build_scenario_outputs(10000000, metric="revenue")
        self.assertEqual(len(scenarios.scenarios), 3)
        optimistic = next(s for s in scenarios.scenarios if s.scenario == "optimistic")
        self.assertGreater(optimistic.adjusted_value, optimistic.base_value)


if __name__ == "__main__":
    unittest.main()
