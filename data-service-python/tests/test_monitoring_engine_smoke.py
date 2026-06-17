"""Smoke tests for monitoring engine — Phase 8."""

import unittest

from app.monitoring.engine import run_monitoring_report


class MonitoringEngineSmokeTest(unittest.TestCase):
    def test_run_monitoring_report(self) -> None:
        report = run_monitoring_report()
        self.assertEqual(report.overview.status, "operations_center_ready")
        self.assertEqual(len(report.pipeline_modules), 8)
        self.assertGreaterEqual(len(report.lineage), 8)
        self.assertEqual(len(report.service_health), 7)
        self.assertGreater(report.operational_kpis.platform_health_score, 0)

    def test_quality_dimensions(self) -> None:
        report = run_monitoring_report()
        self.assertEqual(len(report.quality.dimensions), 6)
        self.assertGreater(report.quality.overall_quality_index, 0)


if __name__ == "__main__":
    unittest.main()
