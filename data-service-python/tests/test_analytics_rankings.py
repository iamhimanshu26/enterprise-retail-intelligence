"""Tests for store and product ranking analytics."""

import unittest

import pandas as pd

from app.analytics.product_analytics import compute_product_analytics
from app.analytics.store_analytics import compute_store_analytics


class StoreRankingTest(unittest.TestCase):
    def test_store_ranking_order(self):
        df = pd.DataFrame({
            "store_code": ["S1", "S1", "S2", "S2"],
            "revenue": [1000, 500, 2000, 1000],
            "profit": [100, 50, 400, 200],
            "quantity": [1, 1, 2, 1],
            "product_code": ["P1", "P2", "P3", "P4"],
        })
        result = compute_store_analytics(df)
        self.assertGreaterEqual(len(result.rankings), 2)
        s2 = next(r for r in result.rankings if r.store_code == "S2")
        self.assertEqual(s2.revenue, 3000.0)
        self.assertGreater(s2.performance_score, 0)


class ProductRankingTest(unittest.TestCase):
    def test_top_product_by_revenue(self):
        df = pd.DataFrame({
            "product_code": ["P1", "P1", "P2"],
            "revenue": [1000, 500, 2000],
            "profit": [100, 50, 400],
            "quantity": [2, 1, 5],
            "returned": [False, False, True],
            "category": ["A", "A", "B"],
            "brand": ["X", "X", "Y"],
        })
        result = compute_product_analytics(df)
        self.assertEqual(result.top_by_revenue[0].product_code, "P2")
        self.assertGreater(result.top_by_revenue[0].contribution_pct, 0)


if __name__ == "__main__":
    unittest.main()
