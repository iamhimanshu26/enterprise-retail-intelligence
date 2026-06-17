"""Value normalization for consistent retail domain fields."""

from __future__ import annotations

from typing import Any, Dict

import pandas as pd

from app.etl.audit_log import AuditLog
from app.etl.config import PAYMENT_ALIASES, PREFECTURE_ALIASES, REGION_ALIASES, STATUS_ALIASES


class NormalizeReport:
    def __init__(self) -> None:
        self.columns_normalized: list = []
        self.values_changed: int = 0

    def to_dict(self) -> Dict[str, Any]:
        return {
            "columns_normalized": self.columns_normalized,
            "values_changed": self.values_changed,
        }


def normalize_dataframe(df: pd.DataFrame, entity: str, audit: AuditLog | None = None) -> tuple:
    report = NormalizeReport()
    result = df.copy()

    if "region" in result.columns:
        before = result["region"].astype(str)
        mapped = before.map(lambda v: REGION_ALIASES.get(v, REGION_ALIASES.get(v.lower(), v)))
        changed = int((mapped != before).sum())
        result["region"] = mapped
        if changed:
            report.columns_normalized.append("region")
            report.values_changed += changed

    if "payment_method" in result.columns:
        before = result["payment_method"].astype(str)
        mapped = before.map(lambda v: PAYMENT_ALIASES.get(v, PAYMENT_ALIASES.get(v.lower(), v)))
        changed = int((mapped != before).sum())
        result["payment_method"] = mapped
        if changed:
            report.columns_normalized.append("payment_method")
            report.values_changed += changed

    if "status" in result.columns:
        before = result["status"].astype(str)
        mapped = before.map(lambda v: STATUS_ALIASES.get(v, STATUS_ALIASES.get(v.lower(), v)))
        changed = int((mapped != before).sum())
        result["status"] = mapped
        if changed:
            report.columns_normalized.append("status")
            report.values_changed += changed

    if "category" in result.columns:
        result["category"] = result["category"].astype(str).str.strip().str.title()
        report.columns_normalized.append("category")

    if "prefecture" in result.columns:
        before = result["prefecture"].astype(str)
        mapped = before.map(lambda v: PREFECTURE_ALIASES.get(v, PREFECTURE_ALIASES.get(v.strip(), v.strip().title())))
        changed = int((mapped != before).sum())
        result["prefecture"] = mapped
        report.columns_normalized.append("prefecture")
        if changed and audit:
            audit.record_batch("prefecture", changed, "Prefecture normalization")

    if "city" in result.columns:
        result["city"] = result["city"].astype(str).str.strip().str.title()
        report.columns_normalized.append("city")

    return result, report
