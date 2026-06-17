"""Date transformation and validation engine."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, List

import pandas as pd

from app.etl.audit_log import AuditLog

DATE_FORMATS = ["%Y-%m-%d", "%Y/%m/%d", "%d/%m/%Y", "%m-%d-%Y", "%m/%d/%Y"]
STANDARD_FORMAT = "%Y-%m-%d"


class DateTransformReport:
    def __init__(self) -> None:
        self.columns_transformed: List[str] = []
        self.invalid_dates: int = 0
        self.values_parsed: int = 0

    def to_dict(self) -> Dict[str, Any]:
        return {
            "columns_transformed": self.columns_transformed,
            "invalid_dates": self.invalid_dates,
            "values_parsed": self.values_parsed,
            "standard_format": STANDARD_FORMAT,
        }


def transform_dates(df: pd.DataFrame, audit: AuditLog | None = None) -> tuple:
    report = DateTransformReport()
    result = df.copy()

    date_cols = [c for c in result.columns if "date" in c.lower() or c.endswith("_at")]

    for col in date_cols:
        original = result[col].copy()
        parsed = pd.to_datetime(original, errors="coerce", utc=True)
        invalid = int(parsed.isna().sum() - original.isna().sum())
        report.invalid_dates += max(invalid, 0)
        report.values_parsed += int(parsed.notna().sum())
        result[col] = parsed.dt.strftime(STANDARD_FORMAT)
        result.loc[parsed.isna(), col] = None
        report.columns_transformed.append(col)
        if audit and report.values_parsed:
            audit.record_batch(col, int(parsed.notna().sum()), "Date normalized to ISO format")

    return result, report


def validate_future_dates(df: pd.DataFrame, date_columns: List[str] | None = None) -> Dict[str, Any]:
    cols = date_columns or [c for c in df.columns if "date" in c.lower()]
    violations = 0
    today = datetime.now(timezone.utc).date()
    details: List[Dict[str, Any]] = []

    for col in cols:
        if col not in df.columns:
            continue
        parsed = pd.to_datetime(df[col], errors="coerce")
        future_mask = parsed.dt.date > today
        count = int(future_mask.sum())
        if count:
            violations += count
            details.append({"column": col, "future_dates": count})

    return {"future_date_violations": violations, "details": details}
