"""Tests for regional statistics."""

import unittest

import pandas as pd

from app.statistics.regional import compute_regional_stats


class RegionalStatsTest(unittest.TestCase):
    def test_regional_aggregation(self):
        df = pd.DataFrame({
            "region": ["KANTO", "KANTO", "KANSAI"],
            "revenue": [1000, 500, 800],
            "profit": [200, 100, 160],
            "customer_id": ["C1", "C2", "C3"],
            "returned": [False, False, True],
        })
        stats = compute_regional_stats(df)
        self.assertEqual(len(stats.rows), 2)
        self.assertEqual(stats.top_region, "KANTO")
        kanto = next(r for r in stats.rows if r.region == "KANTO")
        self.assertEqual(kanto.revenue, 1500)


if __name__ == "__main__":
    unittest.main()
