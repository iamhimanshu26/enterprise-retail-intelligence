"""Executive scorecard and business health scoring."""

from __future__ import annotations

from app.analytics.models import BusinessAnalyticsReport
from app.intelligence.models import BusinessHealthCenter, ExecutiveScorecard, ScorecardDimension


def _status_from_score(score: float) -> str:
    if score >= 90:
        return "Excellent"
    if score >= 75:
        return "Good"
    if score >= 60:
        return "Warning"
    return "Critical"


def build_executive_scorecard(report: BusinessAnalyticsReport) -> tuple:
    perf = report.performance
    kpis = {m.id: m for m in report.kpis.metrics}
    growth_val = kpis.get("sales_growth").value if kpis.get("sales_growth") else 0.0
    margin_val = kpis.get("gross_margin").value if kpis.get("gross_margin") else 20.0

    revenue_score = min(100.0, max(0.0, 70 + growth_val))
    profit_score = min(100.0, max(0.0, margin_val))
    customer_score = min(100.0, report.customers.segment_score)
    inventory_score = max(0.0, 100 - report.inventory.stock_risk_score)
    store_scores = list(perf.store_scores.values())
    store_score = sum(store_scores) / max(len(store_scores), 1) if store_scores else 50.0
    product_scores = list(perf.product_scores.values())
    product_score = sum(product_scores) / max(len(product_scores), 1) if product_scores else 50.0
    supplier_score = max(0.0, 100 - perf.supplier_risk_score)

    dimensions = [
        ScorecardDimension(
            name="Revenue Score",
            score=round(revenue_score, 1),
            status=_status_from_score(revenue_score),
            explanation="Weighted from sales growth and revenue momentum.",
        ),
        ScorecardDimension(
            name="Profit Score",
            score=round(profit_score, 1),
            status=_status_from_score(profit_score),
            explanation="Derived from gross margin percentage.",
        ),
        ScorecardDimension(
            name="Customer Score",
            score=round(customer_score, 1),
            status=_status_from_score(customer_score),
            explanation="Segment score from spend and purchase frequency.",
        ),
        ScorecardDimension(
            name="Inventory Score",
            score=round(inventory_score, 1),
            status=_status_from_score(inventory_score),
            explanation="Inverse of stock risk score.",
        ),
        ScorecardDimension(
            name="Store Score",
            score=round(store_score, 1),
            status=_status_from_score(store_score),
            explanation="Average normalized store performance score.",
        ),
        ScorecardDimension(
            name="Product Score",
            score=round(product_score, 1),
            status=_status_from_score(product_score),
            explanation="Average normalized product performance score.",
        ),
        ScorecardDimension(
            name="Supplier Score",
            score=round(supplier_score, 1),
            status=_status_from_score(supplier_score),
            explanation="Inverse of supplier risk score.",
        ),
    ]

    overall = round(sum(d.score for d in dimensions) / len(dimensions), 1)
    overall_status = _status_from_score(overall)

    methodology = (
        "Business Health Score = average of Revenue, Profit, Customer, Inventory, "
        "Store, Product, and Supplier dimension scores (0–100). "
        "KPI Status uses configurable thresholds. Benchmark % = Actual / Target × 100."
    )

    scorecard = ExecutiveScorecard(
        dimensions=dimensions,
        overall_score=overall,
        overall_status=overall_status,
        methodology=methodology,
    )

    strongest = max(dimensions, key=lambda d: d.score)
    weakest = min(dimensions, key=lambda d: d.score)

    highest_risk = "Inventory" if inventory_score < 60 else "Returns" if (kpis.get("return_rate") and kpis["return_rate"].value > 10) else "Supplier"
    biggest_opportunity = strongest.name.replace(" Score", "")

    health = BusinessHealthCenter(
        overall_score=overall,
        overall_status=overall_status,
        strongest_area=strongest.name,
        weakest_area=weakest.name,
        highest_risk=highest_risk,
        biggest_opportunity=f"Expand {biggest_opportunity} momentum",
    )

    return scorecard, health
