"""Smoke tests for synthetic data generator API and export paths."""

import time
import unittest

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)

MINIMAL_GENERATION_PAYLOAD = {
    "dataset_name": "smoke_test_dataset",
    "counts": {
        "stores": 3,
        "products": 100,
        "customers": 100,
        "suppliers": 10,
        "sales_transactions": 1000,
        "promotions": 2,
        "returns": 5,
    },
    "simulation": {
        "start_date": "2024-01-01",
        "end_date": "2024-06-30",
        "seasonal_demand": True,
        "weekend_sales_boost": 0.15,
        "holiday_sales_boost": 0.25,
        "promotion_impact": 0.2,
        "regional_distribution": True,
        "store_popularity": True,
        "product_popularity": True,
    },
    "data_quality": {
        "missing_values_pct": 1.0,
        "duplicate_rows_pct": 0.5,
        "invalid_records_pct": 0.3,
        "outliers_pct": 0.5,
        "null_values_pct": 0.5,
    },
    "seed": 42,
}


class GeneratorSmokeTest(unittest.TestCase):
    def test_health_endpoint(self) -> None:
        response = client.get("/api/v1/health")
        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertTrue(body["success"])
        self.assertEqual(body["data"]["status"], "UP")

    def test_generator_defaults(self) -> None:
        response = client.get("/api/v1/generator/defaults")
        self.assertEqual(response.status_code, 200)
        body = response.json()
        self.assertTrue(body["success"])
        self.assertIn("stores", body["data"]["counts"])
        self.assertIn("stores", body["data"]["entities"])

    def test_generator_dependencies_import(self) -> None:
        import faker
        import numpy
        import openpyxl
        import pandas

        self.assertTrue(hasattr(faker, "Faker"))
        self.assertTrue(hasattr(numpy, "random"))
        self.assertTrue(hasattr(pandas, "DataFrame"))
        self.assertTrue(hasattr(openpyxl, "Workbook"))

    def test_full_generation_preview_and_export(self) -> None:
        start = client.post("/api/v1/generator/start", json=MINIMAL_GENERATION_PAYLOAD)
        self.assertEqual(start.status_code, 200, start.text)
        job_id = start.json()["data"]["job_id"]

        status_data = None
        for _ in range(60):
            status = client.get(f"/api/v1/generator/jobs/{job_id}")
            self.assertEqual(status.status_code, 200)
            status_data = status.json()["data"]
            if status_data["status"] in ("completed", "failed"):
                break
            time.sleep(0.1)

        self.assertIsNotNone(status_data)
        self.assertEqual(status_data["status"], "completed", status_data.get("error"))
        self.assertGreater(status_data["summary"]["total_records"], 0)

        preview = client.get(f"/api/v1/generator/jobs/{job_id}/preview/stores")
        self.assertEqual(preview.status_code, 200)
        self.assertEqual(preview.json()["data"]["row_count"], 3)

        csv_response = client.get(f"/api/v1/generator/jobs/{job_id}/export/stores/csv")
        self.assertEqual(csv_response.status_code, 200)
        self.assertGreater(len(csv_response.content), 0)

        json_response = client.get(f"/api/v1/generator/jobs/{job_id}/export/stores/json")
        self.assertEqual(json_response.status_code, 200)
        self.assertGreater(len(json_response.content), 0)

        xlsx_response = client.get(f"/api/v1/generator/jobs/{job_id}/export/stores/xlsx")
        self.assertEqual(xlsx_response.status_code, 200)
        self.assertGreater(len(xlsx_response.content), 0)

        parquet_response = client.get(f"/api/v1/generator/jobs/{job_id}/export/stores/parquet")
        self.assertEqual(parquet_response.status_code, 400)


if __name__ == "__main__":
    unittest.main()
