"""Trend analysis using existing statistics — no predictive modeling."""

from __future__ import annotations

from app.analytics.models import BusinessAnalyticsReport
from app.intelligence.models import TrendAnalysisItem


def _classify(change: float) -> str:
    if change > 15:
        return "growth_acceleration"
    if change > 5:
        return "upward"
    if change < -15:
        return "growth_slowdown"
    if change < -5:
        return "downward"
    return "stable"


def analyze_trends(report: BusinessAnalyticsReport) -> list:
    kpis = {m.id: m for m in report.kpis.metrics}
    trends: list = []

    mappings = [
        ("total_revenue", "Revenue", kpis.get("sales_growth")),
        ("total_profit", "Profit", kpis.get("profit_growth")),
        ("total_orders", "Orders", kpis.get("sales_growth")),
        ("return_rate", "Return Rate", kpis.get("return_rate")),
        ("average_order_value", "Average Order Value", None),
    ]

    for metric_id, label, growth_metric in mappings:
        m = kpis.get(metric_id)
        if not m:
            continue
        change = growth_metric.value if growth_metric and metric_id != "return_rate" else 0.0
        if metric_id == "return_rate":
            change = m.value
        direction = _classify(change)
        desc = {
            "upward": f"{label} is trending upward with positive momentum.",
            "downward": f"{label} is trending downward and needs attention.",
            "stable": f"{label} remains stable within expected bounds.",
            "growth_acceleration": f"{label} shows accelerated growth.",
            "growth_slowdown": f"{label} growth is slowing compared to prior period.",
        }[direction]
        trends.append(
            TrendAnalysisItem(
                metric=label,
                direction=direction,
                change_pct=round(change, 2),
                description=desc,
                seasonal_note="Seasonal pattern analysis reserved for Phase 7 forecasting.",
            )
        )

    if report.sales.growth_trend_pct is not None:
        direction = _classify(report.sales.growth_trend_pct)
        trends.append(
            TrendAnalysisItem(
                metric="Daily Sales Trend",
                direction=direction,
                change_pct=report.sales.growth_trend_pct,
                description=f"Daily revenue trend is {direction.replace('_', ' ')}.",
                seasonal_note="Seasonal placeholder — no forecasting applied.",
            )
        )

    return trends
