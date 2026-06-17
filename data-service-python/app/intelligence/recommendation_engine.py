"""Rule-based business recommendations — deterministic, no AI."""

from __future__ import annotations

from app.analytics.models import BusinessAnalyticsReport
from app.intelligence.models import AnomalyItem, RecommendationItem


def generate_recommendations(
    report: BusinessAnalyticsReport,
    anomalies: list,
) -> list:
    recs: list = []
    counter = 1

    def add(priority: str, title: str, description: str, action: str, area: str) -> None:
        nonlocal counter
        recs.append(
            RecommendationItem(
                id=f"rec-{counter:03d}",
                priority=priority,
                title=title,
                description=description,
                action=action,
                area=area,
            )
        )
        counter += 1

    if report.inventory.stock_risk_score > 50:
        region = report.sales.by_region[0].dimension if report.sales.by_region else "key regions"
        add(
            "high",
            "Increase inventory replenishment",
            f"Inventory levels are critically low across {report.inventory.low_stock_count} SKUs.",
            "Increase replenishment quantity by 15% in high-velocity locations.",
            region,
        )

    kpis = {m.id: m for m in report.kpis.metrics}
    discount = kpis.get("discount_rate")
    if discount and discount.value > 12:
        add(
            "medium",
            "Reduce promotional discount depth",
            "Discount rate exceeds sustainable margin targets.",
            "Reduce average discount rate by 3–5 percentage points.",
            "Promotions",
        )

    if report.suppliers.delayed_suppliers:
        sid = report.suppliers.delayed_suppliers[0]
        add(
            "medium",
            "Review supplier reliability",
            f"Supplier {sid} shows lower reliability scores.",
            "Schedule supplier performance review and backup sourcing.",
            "Supply Chain",
        )

    if kpis.get("return_rate") and kpis["return_rate"].value > 10:
        add(
            "high",
            "Investigate elevated returns",
            "Return rate exceeds the 10% warning threshold.",
            "Audit top return SKUs and update quality controls.",
            "Operations",
        )

    if report.products.top_by_revenue:
        top = report.products.top_by_revenue[0].product_code
        add(
            "low",
            "Promote high-performing products",
            f"{top} leads revenue contribution.",
            "Expand placement and cross-promotion for top performers.",
            "Merchandising",
        )

    if report.stores.underperformers:
        store = report.stores.underperformers[0]
        add(
            "medium",
            "Improve underperforming store",
            f"Store {store} ranks below performance targets.",
            "Deploy store operations review and localized promotions.",
            "Store Operations",
        )

    for anomaly in anomalies[:3]:
        if isinstance(anomaly, AnomalyItem):
            add(
                anomaly.severity,
                f"Address {anomaly.anomaly_type.replace('_', ' ')}",
                anomaly.explanation,
                "Investigate root cause and apply corrective action within 7 days.",
                anomaly.metric,
            )

    return recs[:8]
