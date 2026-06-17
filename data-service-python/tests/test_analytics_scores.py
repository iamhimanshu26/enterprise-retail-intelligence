"""Tests for inventory and supplier risk scores."""

import unittest

import pandas as pd

from app.analytics.inventory_analytics import compute_inventory_analytics
from app.analytics.supplier_analytics import compute_supplier_analytics


class InventoryRiskScoreTest(unittest.TestCase):
    def test_stock_risk_detects_low_stock(self):
        df = pd.DataFrame({
            "product_code": ["P1", "P2", "P3"],
            "stock_on_hand": [0, 5, 100],
            "reorder_level": [10, 10, 20],
            "unit_cost": [10, 20, 5],
            "quantity": [1, 2, 50],
            "revenue": [100, 200, 500],
        })
        result = compute_inventory_analytics(df)
        self.assertEqual(result.out_of_stock_count, 1)
        self.assertGreater(result.stock_risk_score, 0)
        self.assertGreater(len(result.reorder_candidates), 0)


class SupplierRiskScoreTest(unittest.TestCase):
    def test_supplier_ranking_and_risk(self):
        df = pd.DataFrame({
            "supplier_id": ["SUP-1", "SUP-1", "SUP-2"],
            "supplier_name": ["Alpha", "Alpha", "Beta"],
            "product_code": ["P1", "P2", "P3"],
            "revenue": [5000, 3000, 1000],
        })
        result = compute_supplier_analytics(df)
        self.assertEqual(len(result.rankings), 2)
        top = result.rankings[0]
        self.assertEqual(top.supplier_id, "SUP-1")
        self.assertGreater(top.reliability_score, top.risk_score)


if __name__ == "__main__":
    unittest.main()
