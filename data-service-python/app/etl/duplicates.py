"""Duplicate detection engine."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

import pandas as pd

from app.etl.audit_log import AuditLog


class DuplicateConfig:
    def __init__(self, action: str = "remove", keep: str = "first") -> None:
        self.action = action  # remove | mark
        self.keep = keep  # first | last


class DuplicateReport:
    def __init__(self) -> None:
        self.exact_duplicates: int = 0
        self.partial_duplicates: int = 0
        self.business_key_duplicates: int = 0
        self.rows_removed: int = 0
        self.rows_marked: int = 0
        self.changes: List[Dict[str, Any]] = []

    def to_dict(self) -> Dict[str, Any]:
        return {
            "exact_duplicates": self.exact_duplicates,
            "partial_duplicates": self.partial_duplicates,
            "business_key_duplicates": self.business_key_duplicates,
            "rows_removed": self.rows_removed,
            "rows_marked": self.rows_marked,
            "changes": self.changes,
        }


def detect_duplicates(
    df: pd.DataFrame,
    primary_key: Optional[str] = None,
) -> Dict[str, Any]:
    exact = int(df.duplicated().sum())
    pk_dupes = 0
    if primary_key and primary_key in df.columns:
        pk_dupes = int(df[primary_key].duplicated().sum())
    return {
        "exact_duplicate_rows": exact,
        "business_key_duplicates": pk_dupes,
        "primary_key": primary_key,
    }


def handle_duplicates(
    df: pd.DataFrame,
    config: DuplicateConfig,
    primary_key: Optional[str] = None,
    audit: Optional[AuditLog] = None,
) -> tuple:
    report = DuplicateReport()
    result = df.copy()
    report.exact_duplicates = int(result.duplicated().sum())

    subset = [primary_key] if primary_key and primary_key in result.columns else None
    if subset:
        report.business_key_duplicates = int(result.duplicated(subset=subset, keep=False).sum())

    if config.action == "remove":
        before = len(result)
        if subset:
            result = result.drop_duplicates(subset=subset, keep=config.keep)
        else:
            result = result.drop_duplicates(keep=config.keep)
        report.rows_removed = before - len(result)
        if report.rows_removed and audit:
            audit.record_batch(
                primary_key or "all_columns",
                report.rows_removed,
                f"Duplicate removal (keep={config.keep})",
            )
        report.changes.append({"action": "remove", "rows_removed": report.rows_removed})
    elif config.action == "mark":
        dup_mask = result.duplicated(subset=subset, keep=False)
        report.rows_marked = int(dup_mask.sum())
        result["_is_duplicate"] = dup_mask
        report.changes.append({"action": "mark", "rows_marked": report.rows_marked})
        if audit and report.rows_marked:
            audit.record_batch(primary_key or "all_columns", report.rows_marked, "Marked duplicate rows")

    return result, report
