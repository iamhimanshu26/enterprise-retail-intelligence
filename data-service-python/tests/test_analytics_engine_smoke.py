"""Smoke tests for business analytics orchestrator."""

import unittest

from app.analytics.engine import BusinessAnalyticsEngine, run_sample_analytics


class AnalyticsEngineSmokeTest(unittest.TestCase):
    def test_run_sample_report(self):
        report = run_sample_analytics()
        self.assertEqual(report.overview.sprint, "5.2")
        self.assertEqual(len(report.kpis.metrics), 15)
        self.assertGreater(len(report.sales.by_region), 0)
        self.assertGreater(len(report.stores.rankings), 0)
        self.assertGreater(len(report.products.top_by_revenue), 0)

    def test_engine_modules(self):
        report = BusinessAnalyticsEngine().run()
        self.assertIn("performance", report.overview.modules)
        self.assertGreaterEqual(report.performance.inventory_risk_score, 0)


if __name__ == "__main__":
    unittest.main()
