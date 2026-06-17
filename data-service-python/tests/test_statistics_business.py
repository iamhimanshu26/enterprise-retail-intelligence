"""Tests for business metrics."""

import unittest

import pandas as pd

from app.statistics.business import compute_business_metrics


class BusinessMetricsTest(unittest.TestCase):
    def test_aov_and_margin(self):
        df = pd.DataFrame({
            "revenue": [1000, 2000],
            "cost": [600, 1200],
            "profit": [400, 800],
            "quantity": [2, 4],
            "discount_rate": [5, 10],
            "store_code": ["S1", "S2"],
            "customer_id": ["C1", "C2"],
            "product_code": ["P1", "P2"],
            "returned": [False, True],
        })
        m = compute_business_metrics(df)
        self.assertEqual(m.total_orders, 2)
        self.assertEqual(m.total_revenue, 3000)
        self.assertEqual(m.average_order_value, 1500)
        self.assertEqual(m.profit_margin_pct, 40.0)
        self.assertEqual(m.return_rate_pct, 50.0)


if __name__ == "__main__":
    unittest.main()
