"""Tests for enterprise ETL pipeline (Sprint 4.3)."""

import unittest

from fastapi.testclient import TestClient

from app.etl.enterprise_pipeline import run_enterprise_sample
from app.main import app


class EnterprisePipelineSmokeTest(unittest.TestCase):
    def test_enterprise_sample_runs(self):
        result = run_enterprise_sample()
        self.assertTrue(result["success"])
        self.assertIn("quality_score", result)
        self.assertIn("lineage", result)
        self.assertIn("metrics", result)
        self.assertIn("warehouse_summary", result)
        self.assertIn("pipeline_id", result)

    def test_warehouse_summary_api(self):
        client = TestClient(app)
        response = client.get("/api/v1/etl/warehouse/summary")
        self.assertEqual(response.status_code, 200)
        data = response.json()["data"]
        self.assertGreater(data["stores"], 0)

    def test_execution_history_api(self):
        run_enterprise_sample()
        client = TestClient(app)
        response = client.get("/api/v1/etl/history")
        self.assertEqual(response.status_code, 200)
        data = response.json()["data"]
        self.assertGreaterEqual(data["total"], 1)

    def test_quality_dashboard_api(self):
        client = TestClient(app)
        response = client.get("/api/v1/etl/quality/dashboard")
        self.assertEqual(response.status_code, 200)
        data = response.json()["data"]
        self.assertIn("data_quality_index", data)

    def test_lineage_sample_api(self):
        client = TestClient(app)
        response = client.get("/api/v1/etl/lineage/sample")
        self.assertEqual(response.status_code, 200)
        data = response.json()["data"]
        self.assertIn("nodes", data)


if __name__ == "__main__":
    unittest.main()
