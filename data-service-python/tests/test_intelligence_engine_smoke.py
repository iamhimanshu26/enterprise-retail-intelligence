"""Smoke tests for executive intelligence orchestrator."""

import unittest

from app.intelligence.executive_engine import ExecutiveIntelligenceEngine, run_sample_intelligence


class ExecutiveIntelligenceSmokeTest(unittest.TestCase):
    def test_run_sample_report(self):
        report = run_sample_intelligence()
        self.assertEqual(report.overview.sprint, "5.3")
        self.assertTrue(report.executive_summary.summary)
        self.assertGreater(len(report.kpi_intelligence), 0)
        self.assertGreater(len(report.benchmarks), 0)
        self.assertTrue(report.scorecard.methodology)

    def test_engine_modules(self):
        report = ExecutiveIntelligenceEngine().run()
        self.assertIn("scorecard", report.overview.modules)
        self.assertGreater(report.business_health.overall_score, 0)


if __name__ == "__main__":
    unittest.main()
