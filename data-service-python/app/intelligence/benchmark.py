"""Business benchmark engine — actual vs target."""

from __future__ import annotations

from typing import Dict

from app.analytics.models import BusinessAnalyticsReport
from app.intelligence.models import BenchmarkItem

# Target as fraction of actual baseline (actual / target = achievement)
TARGET_FACTORS: Dict[str, float] = {
    "Revenue": 0.88,
    "Profit": 0.85,
    "Orders": 0.90,
    "Customers": 0.92,
    "Inventory Value": 0.95,
    "Return Rate": 1.15,  # target is higher (lower is better for actual)
}


def compute_benchmarks(report: BusinessAnalyticsReport) -> list:
    kpis = {m.id: m for m in report.kpis.metrics}
    rows: list = []

    specs = [
        ("Revenue", "total_revenue", "JPY", False),
        ("Profit", "total_profit", "JPY", False),
        ("Orders", "total_orders", "orders", False),
        ("Customers", "active_customers", "customers", False),
        ("Inventory Value", "inventory_value", "JPY", False),
        ("Return Rate", "return_rate", "%", True),
    ]

    for name, key, unit, lower_better in specs:
        m = kpis.get(key)
        if not m:
            continue
        factor = TARGET_FACTORS.get(name, 0.9)
        if lower_better:
            target = m.value * factor
            achievement = (target / max(m.value, 0.01)) * 100
        else:
            target = m.value * factor
            achievement = (m.value / max(target, 1)) * 100
        rows.append(
            BenchmarkItem(
                metric=name,
                actual=round(m.value, 2),
                target=round(target, 2),
                achievement_pct=round(achievement, 1),
                unit=unit,
            )
        )

    return rows
