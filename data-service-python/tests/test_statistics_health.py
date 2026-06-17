"""Tests for dataset health statistics."""

import unittest

import pandas as pd

from app.statistics.quality import compute_dataset_health


class DatasetHealthTest(unittest.TestCase):
    def test_health_metrics(self):
        df = pd.DataFrame({
            "transaction_id": ["T1", "T2", "T2"],
            "revenue": [100, None, 200],
            "transaction_date": ["2024-01-01", "2024-01-02", "2024-01-03"],
            "region": ["KANTO", "KANSAI", "KANTO"],
        })
        health = compute_dataset_health(df)
        self.assertEqual(health.total_records, 3)
        self.assertGreater(health.null_percentage, 0)
        self.assertGreater(health.duplicate_percentage, 0)


if __name__ == "__main__":
    unittest.main()
