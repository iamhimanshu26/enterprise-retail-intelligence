"""Smoke tests for forecasting engine and API."""

import unittest

from fastapi.testclient import TestClient

from app.forecasting.engine import ForecastingEngine, run_sample_forecasting
from app.main import app


class ForecastingEngineSmokeTest(unittest.TestCase):
    def test_run_sample_report(self):
        report = run_sample_forecasting()
        self.assertEqual(report.overview.sprint, "7.1")
        self.assertGreater(len(report.sales.daily.points), 0)
        self.assertGreater(len(report.revenue.monthly.points), 0)
        self.assertGreater(len(report.demand.product_demand), 0)
        self.assertGreater(len(report.inventory.items), 0)
        self.assertGreater(len(report.accuracy.metrics), 0)
        self.assertEqual(len(report.scenarios.scenarios), 3)

    def test_overview_api(self):
        client = TestClient(app)
        response = client.get("/api/v1/forecasting/overview")
        self.assertEqual(response.status_code, 200)
        data = response.json()["data"]
        self.assertEqual(data["sprint"], "7.1")

    def test_run_sample_api(self):
        client = TestClient(app)
        response = client.post("/api/v1/forecasting/run-sample")
        self.assertEqual(response.status_code, 200)
        data = response.json()["data"]
        self.assertIn("sales", data)
        self.assertIn("revenue", data)
        self.assertIn("accuracy", data)

    def test_sales_endpoint(self):
        client = TestClient(app)
        response = client.get("/api/v1/forecasting/sales")
        self.assertEqual(response.status_code, 200)
        self.assertIn("daily", response.json()["data"])


if __name__ == "__main__":
    unittest.main()
