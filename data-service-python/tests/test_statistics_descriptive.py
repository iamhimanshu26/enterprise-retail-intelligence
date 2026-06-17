"""Tests for descriptive statistics."""

import unittest

import pandas as pd

from app.statistics.descriptive import compute_descriptive_stats


class DescriptiveStatsTest(unittest.TestCase):
    def test_numeric_stats(self):
        df = pd.DataFrame({
            "revenue": [100, 200, 300, 400, 500],
            "profit": [10, 20, 30, 40, 50],
        })
        stats = compute_descriptive_stats(df)
        self.assertEqual(len(stats), 2)
        rev = next(s for s in stats if s.column == "revenue")
        self.assertEqual(rev.count, 5)
        self.assertEqual(rev.mean, 300.0)
        self.assertEqual(rev.median, 300.0)
        self.assertIsNotNone(rev.std)


if __name__ == "__main__":
    unittest.main()
