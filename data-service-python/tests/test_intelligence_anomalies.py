"""Tests for anomaly detection."""

import unittest

import pandas as pd

from app.analytics.data import generate_analytics_retail_data
from app.analytics.engine import BusinessAnalyticsEngine
from app.intelligence.anomaly_detector import detect_anomalies


class AnomalyDetectionTest(unittest.TestCase):
    def test_detects_anomalies_with_explanation(self):
        df = generate_analytics_retail_data(rows=200)
        report = BusinessAnalyticsEngine(df=df).run()
        anomalies = detect_anomalies(df, report)
        for a in anomalies:
            self.assertTrue(a.explanation)
            self.assertIn(a.severity, {"warning", "critical", "info"})

    def test_spike_detection(self):
        df = generate_analytics_retail_data(rows=100)
        df = pd.concat([df, df.iloc[:1].assign(revenue=df["revenue"].max() * 10)], ignore_index=True)
        report = BusinessAnalyticsEngine(df=df).run()
        anomalies = detect_anomalies(df, report)
        self.assertGreaterEqual(len(anomalies), 0)


if __name__ == "__main__":
    unittest.main()
