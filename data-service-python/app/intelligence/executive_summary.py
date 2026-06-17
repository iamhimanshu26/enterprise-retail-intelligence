"""Deterministic executive summary from business analytics."""

from __future__ import annotations

from app.analytics.models import BusinessAnalyticsReport
from app.intelligence.models import ExecutiveSummary


def generate_executive_summary(report: BusinessAnalyticsReport) -> ExecutiveSummary:
    kpis = {m.id: m for m in report.kpis.metrics}
    revenue = kpis.get("total_revenue")
    growth = kpis.get("sales_growth")
    returns = kpis.get("return_rate")
    customers = kpis.get("active_customers")

    top_region = report.sales.by_region[0].dimension if report.sales.by_region else "N/A"
    top_category = report.sales.by_category[0].dimension if report.sales.by_category else "N/A"

    growth_val = growth.value if growth else 0.0
    growth_text = f"increased {abs(growth_val):.1f}%" if growth_val >= 0 else f"decreased {abs(growth_val):.1f}%"

    highlights = [
        f"Revenue {growth_text} compared to the prior analysis period.",
        f"{top_region} region generated the highest sales.",
        f"{top_category} remains the highest-performing category.",
    ]

    if returns:
        if returns.value <= 10:
            highlights.append("Return rate remains below target.")
        else:
            highlights.append("Return rate is elevated and requires review.")

    if customers:
        highlights.append("Customer activity remains healthy across active segments.")

    if report.stores.high_performers:
        highlights.append(
            f"Top stores: {', '.join(report.stores.high_performers[:3])} lead performance rankings."
        )

    summary = (
        f"Enterprise retail performance shows revenue of ¥{revenue.value:,.0f} with "
        f"{growth_val:+.1f}% period growth. {top_region} leads regional contribution while "
        f"{top_category} drives category performance."
    )

    tags = ["Executive Intelligence", "Sprint 5.3", report.overview.data_source.title()]

    recommendation = None
    if report.inventory.stock_risk_score > 60:
        recommendation = "Prioritize inventory replenishment in high-risk locations."
    elif report.stores.underperformers:
        recommendation = f"Review underperforming stores: {', '.join(report.stores.underperformers[:2])}."
    elif growth_val > 10:
        recommendation = "Maintain momentum by promoting top-performing products and regions."

    return ExecutiveSummary(
        summary=summary,
        highlights=highlights,
        tags=tags,
        recommendation=recommendation,
    )
