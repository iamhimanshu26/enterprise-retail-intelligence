"""Tests for benchmark calculations."""

import unittest

from app.analytics.engine import BusinessAnalyticsEngine
from app.intelligence.benchmark import compute_benchmarks


class BenchmarkTest(unittest.TestCase):
    def test_achievement_pct(self):
        report = BusinessAnalyticsEngine().run()
        benchmarks = compute_benchmarks(report)
        self.assertGreaterEqual(len(benchmarks), 4)
        for b in benchmarks:
            self.assertGreater(b.achievement_pct, 0)
            self.assertGreater(b.actual, 0)
            self.assertGreater(b.target, 0)


if __name__ == "__main__":
    unittest.main()
