"""Tests for KPI analytics."""

import unittest

import pandas as pd

from app.analytics.kpi import compute_kpi_analytics


class KpiAnalyticsTest(unittest.TestCase):
    def test_kpi_count_and_revenue(self):
        df = pd.DataFrame({
            "revenue": [1000, 2000, 1500],
            "profit": [200, 400, 300],
            "cost": [800, 1600, 1200],
            "quantity": [2, 4, 3],
            "discount_rate": [5, 10, 8],
            "store_code": ["S1", "S2", "S1"],
            "customer_id": ["C1", "C2", "C3"],
            "product_code": ["P1", "P2", "P1"],
            "returned": [False, True, False],
            "transaction_date": pd.to_datetime(["2024-01-01", "2024-01-02", "2024-01-03"]),
            "stock_on_hand": [10, 5, 0],
            "reorder_level": [20, 10, 5],
            "unit_cost": [100, 200, 150],
        })
        result = compute_kpi_analytics(df)
        self.assertEqual(len(result.metrics), 15)
        ids = {m.id for m in result.metrics}
        self.assertIn("total_revenue", ids)
        self.assertIn("gross_margin", ids)
        revenue = next(m for m in result.metrics if m.id == "total_revenue")
        self.assertEqual(revenue.value, 4500.0)


if __name__ == "__main__":
    unittest.main()
