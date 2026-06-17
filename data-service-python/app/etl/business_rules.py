"""Business rule validation for retail domain data."""

from __future__ import annotations

from typing import Any, Dict, List

import pandas as pd


class BusinessRuleReport:
    def __init__(self) -> None:
        self.violations: List[Dict[str, Any]] = []
        self.total_violations: int = 0
        self.passed: bool = True

    def add(self, rule: str, column: str, count: int, severity: str = "warning") -> None:
        if count > 0:
            self.violations.append({"rule": rule, "column": column, "count": count, "severity": severity})
            self.total_violations += count
            if severity == "error":
                self.passed = False

    def to_dict(self) -> Dict[str, Any]:
        return {
            "passed": self.passed,
            "total_violations": self.total_violations,
            "violations": self.violations,
        }


def validate_business_rules(df: pd.DataFrame, entity: str) -> BusinessRuleReport:
    report = BusinessRuleReport()

    if entity == "products" or "unit_price" in df.columns and "cost_price" in df.columns:
        unit = pd.to_numeric(df.get("unit_price"), errors="coerce")
        cost = pd.to_numeric(df.get("cost_price"), errors="coerce")
        if unit is not None and cost is not None:
            bad = int((unit < cost).sum())
            report.add("revenue_gte_cost", "unit_price", bad)

    if "quantity_on_hand" in df.columns:
        qty = pd.to_numeric(df["quantity_on_hand"], errors="coerce")
        report.add("quantity_non_negative", "quantity_on_hand", int((qty < 0).sum()))

    if "discount_rate" in df.columns:
        rate = pd.to_numeric(df["discount_rate"], errors="coerce")
        bad = int(((rate < 0) | (rate > 100)).sum())
        report.add("discount_range_0_100", "discount_rate", bad)

    if "transaction_date" in df.columns:
        parsed = pd.to_datetime(df["transaction_date"], errors="coerce", utc=True)
        today = pd.Timestamp.now(tz="UTC")
        future = int((parsed > today).sum())
        report.add("transaction_not_future", "transaction_date", future)

    if "start_date" in df.columns and "end_date" in df.columns:
        start = pd.to_datetime(df["start_date"], errors="coerce")
        end = pd.to_datetime(df["end_date"], errors="coerce")
        bad = int((end < start).sum())
        report.add("promotion_end_after_start", "end_date", bad)

    if "total_amount" in df.columns and "total_cost" in df.columns:
        rev = pd.to_numeric(df["total_amount"], errors="coerce")
        cost = pd.to_numeric(df["total_cost"], errors="coerce")
        bad = int((rev < cost).sum())
        report.add("revenue_gte_cost", "total_amount", bad)

    return report
