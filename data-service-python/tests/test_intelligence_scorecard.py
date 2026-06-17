"""Tests for executive scorecard."""

import unittest

from app.analytics.engine import BusinessAnalyticsEngine
from app.intelligence.scorecard import build_executive_scorecard


class ScorecardTest(unittest.TestCase):
    def test_overall_health_score(self):
        report = BusinessAnalyticsEngine().run()
        scorecard, health = build_executive_scorecard(report)
        self.assertEqual(len(scorecard.dimensions), 7)
        self.assertGreaterEqual(scorecard.overall_score, 0)
        self.assertLessEqual(scorecard.overall_score, 100)
        self.assertTrue(health.strongest_area)
        self.assertTrue(health.weakest_area)


if __name__ == "__main__":
    unittest.main()
