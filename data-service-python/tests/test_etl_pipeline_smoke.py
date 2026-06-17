"""Smoke tests for ETL API and full pipeline."""

import unittest

from fastapi.testclient import TestClient

from app.etl.pipeline import run_sample_pipeline
from app.main import app

client = TestClient(app)


class EtlPipelineSmokeTest(unittest.TestCase):
    def test_sample_pipeline_runs(self) -> None:
        result = run_sample_pipeline()
        self.assertTrue(result["success"])
        report = result["report"]
        self.assertGreater(report["rows_processed"], 0)
        self.assertIn("extract", report["stage_reports"])
        self.assertIn("load", report["stage_reports"])

    def test_etl_overview_endpoint(self) -> None:
        response = client.get("/api/v1/etl/overview")
        self.assertEqual(response.status_code, 200)
        data = response.json()["data"]
        self.assertEqual(len(data["stages"]), 8)

    def test_etl_sample_run_endpoint(self) -> None:
        response = client.post("/api/v1/etl/run/sample")
        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertTrue(body["success"])
        self.assertTrue(body["data"]["success"])


if __name__ == "__main__":
    unittest.main()
