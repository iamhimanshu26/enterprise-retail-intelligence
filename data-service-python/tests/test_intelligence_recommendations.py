"""Tests for recommendation engine."""

import unittest

from app.analytics.engine import BusinessAnalyticsEngine
from app.intelligence.anomaly_detector import detect_anomalies
from app.intelligence.recommendation_engine import generate_recommendations


class RecommendationEngineTest(unittest.TestCase):
    def test_generates_recommendations(self):
        from app.analytics.data import load_analytics_data
        df, _ = load_analytics_data()
        report = BusinessAnalyticsEngine(df=df).run()
        anomalies = detect_anomalies(df, report)
        recs = generate_recommendations(report, anomalies)
        self.assertGreater(len(recs), 0)
        for rec in recs:
            self.assertTrue(rec.action)
            self.assertIn(rec.priority, {"high", "medium", "low", "warning", "critical"})


if __name__ == "__main__":
    unittest.main()
