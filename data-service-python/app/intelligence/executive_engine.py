"""Executive intelligence orchestrator."""

from __future__ import annotations

import time
from typing import Optional

import pandas as pd

from app.analytics.data import load_analytics_data
from app.analytics.engine import BusinessAnalyticsEngine
from app.intelligence.anomaly_detector import detect_anomalies
from app.intelligence.benchmark import compute_benchmarks
from app.intelligence.executive_summary import generate_executive_summary
from app.intelligence.kpi_monitor import generate_kpi_intelligence
from app.intelligence.models import ExecutiveIntelligenceReport, IntelligenceOverview
from app.intelligence.recommendation_engine import generate_recommendations
from app.intelligence.scorecard import build_executive_scorecard
from app.intelligence.trend_analyzer import analyze_trends


class ExecutiveIntelligenceEngine:
    def __init__(
        self,
        df: Optional[pd.DataFrame] = None,
        data_source: str = "sample",
    ) -> None:
        if df is None:
            df, data_source = load_analytics_data()
        self.df = df
        self.data_source = data_source
        self.analytics_report = BusinessAnalyticsEngine(df=df, data_source=data_source).run()

    def run(self) -> ExecutiveIntelligenceReport:
        start = time.time()
        report = self.analytics_report

        executive_summary = generate_executive_summary(report)
        kpi_intelligence = generate_kpi_intelligence(report)
        trends = analyze_trends(report)
        benchmarks = compute_benchmarks(report)
        anomalies = detect_anomalies(self.df, report)
        recommendations = generate_recommendations(report, anomalies)
        scorecard, business_health = build_executive_scorecard(report)

        overview = IntelligenceOverview(
            modules=[
                "executive_summary",
                "kpi_monitor",
                "trend_analyzer",
                "benchmark",
                "anomaly_detector",
                "recommendation_engine",
                "scorecard",
            ],
            data_source=self.data_source,
        )

        return ExecutiveIntelligenceReport(
            overview=overview,
            executive_summary=executive_summary,
            kpi_intelligence=kpi_intelligence,
            trends=trends,
            benchmarks=benchmarks,
            anomalies=anomalies,
            recommendations=recommendations,
            scorecard=scorecard,
            business_health=business_health,
            execution_time_seconds=round(time.time() - start, 3),
        )


def run_sample_intelligence() -> ExecutiveIntelligenceReport:
    return ExecutiveIntelligenceEngine().run()
