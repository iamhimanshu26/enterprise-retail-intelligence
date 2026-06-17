"""Tests for data lineage engine."""

import unittest

from app.etl.lineage import build_pipeline_lineage, LineageTracker


class LineageTest(unittest.TestCase):
    def test_build_pipeline_lineage(self):
        lineage = build_pipeline_lineage("sales.csv", "stores", ["dim_store", "fact_sales"])
        data = lineage.to_dict()
        self.assertGreater(len(data["nodes"]), 0)
        self.assertGreater(len(data["edges"]), 0)
        self.assertIn("sales.csv", data["flow"])

    def test_lineage_tracker(self):
        tracker = LineageTracker()
        tracker.add_node("src", "sales.csv", "source")
        tracker.add_node("clean", "cleaning", "stage")
        tracker.add_edge("src", "clean", "cleaning")
        data = tracker.to_dict()
        self.assertEqual(len(data["nodes"]), 2)
        self.assertEqual(len(data["edges"]), 1)


if __name__ == "__main__":
    unittest.main()
