"""Smoke tests for Sprint 4.2 cleaning transformation pipeline."""

import unittest

from fastapi.testclient import TestClient

from app.etl.cleaning_pipeline import run_cleaning_sample
from app.main import app

client = TestClient(app)


class CleaningPipelineSmokeTest(unittest.TestCase):
    def test_cleaning_sample_runs(self) -> None:
        result = run_cleaning_sample()
        self.assertTrue(result["success"])
        self.assertIn("quality_score", result)
        self.assertGreater(result["quality_score"]["overall"], 0)
        report = result["report"]
        self.assertIn("audit_log", report)
        self.assertIn("profile", report["stage_reports"])

    def test_cleaning_stages_api(self) -> None:
        response = client.get("/api/v1/etl/cleaning/stages")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()["data"]), 10)

    def test_sample_run_returns_quality_score(self) -> None:
        response = client.post("/api/v1/etl/run/sample")
        self.assertEqual(response.status_code, 200)
        data = response.json()["data"]
        self.assertTrue(data["success"])
        self.assertIsNotNone(data.get("quality_score"))


if __name__ == "__main__":
    unittest.main()
