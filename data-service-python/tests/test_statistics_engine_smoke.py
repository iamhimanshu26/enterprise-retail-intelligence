"""Smoke tests for statistics engine and API."""

import unittest

from fastapi.testclient import TestClient

from app.main import app
from app.statistics.engine import StatisticsEngine, run_sample_statistics


class StatisticsEngineTest(unittest.TestCase):
    def test_engine_runs(self):
        report = run_sample_statistics()
        self.assertIsNotNone(report.business)
        self.assertGreater(len(report.descriptive), 0)
        self.assertGreater(len(report.distributions), 0)
        self.assertGreater(report.health.total_records, 0)

    def test_overview_api(self):
        client = TestClient(app)
        response = client.get("/api/v1/statistics/overview")
        self.assertEqual(response.status_code, 200)
        data = response.json()["data"]
        self.assertEqual(data["sprint"], "5.1")

    def test_business_api(self):
        client = TestClient(app)
        response = client.get("/api/v1/statistics/business")
        self.assertEqual(response.status_code, 200)
        data = response.json()["data"]
        self.assertIn("average_order_value", data)

    def test_run_sample_api(self):
        client = TestClient(app)
        response = client.post("/api/v1/statistics/run-sample")
        self.assertEqual(response.status_code, 200)
        data = response.json()["data"]
        self.assertIn("business", data)
        self.assertIn("regional", data)


if __name__ == "__main__":
    unittest.main()
