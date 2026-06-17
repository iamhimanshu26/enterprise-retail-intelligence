"""KPI intelligence with configurable thresholds."""

from __future__ import annotations

from typing import Dict, Tuple

from app.analytics.models import BusinessAnalyticsReport
from app.intelligence.models import KpiIntelligenceItem

DEFAULT_THRESHOLDS: Dict[str, Dict[str, Tuple[float, float, float, float]]] = {
    # metric_key: (excellent_min, good_min, warning_min, critical handled as below warning)
    "growth": (15.0, 8.0, 0.0, -999.0),
    "return_rate": (0.0, 5.0, 10.0, 15.0),  # lower is better — inverted logic
    "margin": (30.0, 20.0, 10.0, 0.0),
    "inventory_risk": (0.0, 30.0, 50.0, 70.0),  # lower is better
}


def _status_from_higher_better(value: float, excellent: float, good: float, warning: float) -> str:
    if value >= excellent:
        return "excellent"
    if value >= good:
        return "good"
    if value >= warning:
        return "warning"
    return "critical"


def _status_from_lower_better(value: float, excellent: float, good: float, warning: float) -> str:
    if value <= excellent:
        return "excellent"
    if value <= good:
        return "good"
    if value <= warning:
        return "warning"
    return "critical"


def _trend_from_change(change: float | None) -> str:
    if change is None:
        return "stable"
    if change > 2:
        return "upward"
    if change < -2:
        return "downward"
    return "stable"


def _health_from_status(status: str) -> str:
    return {
        "excellent": "healthy",
        "good": "healthy",
        "warning": "at_risk",
        "critical": "critical",
    }.get(status, "unknown")


def generate_kpi_intelligence(
    report: BusinessAnalyticsReport,
    thresholds: Dict[str, Dict[str, Tuple[float, float, float, float]]] | None = None,
) -> list:
    thresholds = thresholds or DEFAULT_THRESHOLDS
    kpis = {m.id: m for m in report.kpis.metrics}

    def metric(id_: str, label: str, key: str, higher_better: bool = True) -> KpiIntelligenceItem | None:
        m = kpis.get(id_)
        if not m:
            return None
        t = thresholds.get(key, (10, 5, 0, -10))
        if higher_better:
            status = _status_from_higher_better(m.value, t[0], t[1], t[2])
        else:
            status = _status_from_lower_better(m.value, t[0], t[1], t[2])
        target = m.value * 0.88 if higher_better else m.value * 1.12
        benchmark_pct = round(m.value / max(target, 1) * 100, 1) if target else None
        return KpiIntelligenceItem(
            id=id_,
            label=label,
            value=round(m.value, 2),
            unit=m.unit,
            status=status,
            trend=_trend_from_change(m.change_pct),
            benchmark_pct=benchmark_pct,
            change_pct=m.change_pct,
            health_indicator=_health_from_status(status),
        )

    items = [
        metric("total_revenue", "Revenue", "growth"),
        metric("total_profit", "Profit", "growth"),
        metric("total_orders", "Orders", "growth"),
        metric("sales_growth", "Growth", "growth"),
        metric("inventory_value", "Inventory Value", "growth"),
        metric("return_rate", "Returns", "return_rate", higher_better=False),
        metric("active_customers", "Customer Growth", "growth"),
        metric("average_order_value", "Average Order Value", "growth"),
    ]
    inv = report.inventory
    t = thresholds.get("inventory_risk", (0, 30, 50, 70))
    inv_status = _status_from_lower_better(inv.stock_risk_score, t[0], t[1], t[2])
    items.append(
        KpiIntelligenceItem(
            id="inventory_risk",
            label="Inventory Risk",
            value=round(inv.stock_risk_score, 2),
            unit="score",
            status=inv_status,
            trend="stable",
            benchmark_pct=round(100 - inv.stock_risk_score, 1),
            change_pct=None,
            health_indicator=_health_from_status(inv_status),
        )
    )
    return [i for i in items if i is not None]
