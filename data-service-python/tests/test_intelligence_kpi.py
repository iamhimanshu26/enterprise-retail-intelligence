"""Tests for KPI status classification."""

import unittest

from app.analytics.engine import BusinessAnalyticsEngine
from app.intelligence.kpi_monitor import generate_kpi_intelligence


class KpiStatusTest(unittest.TestCase):
    def test_kpi_intelligence_items(self):
        report = BusinessAnalyticsEngine().run()
        items = generate_kpi_intelligence(report)
        self.assertGreaterEqual(len(items), 8)
        statuses = {i.status for i in items}
        self.assertTrue(statuses.issubset({"excellent", "good", "warning", "critical"}))
        for item in items:
            self.assertIn(item.health_indicator, {"healthy", "at_risk", "critical", "unknown"})


if __name__ == "__main__":
    unittest.main()
