"""Data cleaning with auditable change tracking."""

from __future__ import annotations

from typing import Any, Dict, List

import pandas as pd

from app.etl.config import CleanConfig


class CleaningReport:
    def __init__(self) -> None:
        self.rows_before = 0
        self.rows_after = 0
        self.duplicates_removed = 0
        self.nulls_marked = 0
        self.strings_trimmed = 0
        self.invalid_records_flagged = 0
        self.changes: List[Dict[str, Any]] = []

    def to_dict(self) -> Dict[str, Any]:
        return {
            "rows_before": self.rows_before,
            "rows_after": self.rows_after,
            "duplicates_removed": self.duplicates_removed,
            "nulls_marked": self.nulls_marked,
            "strings_trimmed": self.strings_trimmed,
            "invalid_records_flagged": self.invalid_records_flagged,
            "changes": self.changes,
        }


def clean_dataframe(df: pd.DataFrame, config: CleanConfig, primary_key: str | None = None) -> tuple:
    report = CleaningReport()
    report.rows_before = len(df)
    result = df.copy()

    if config.trim_whitespace:
        for col in result.select_dtypes(include=["object", "string"]).columns:
            trimmed = result[col].astype(str).str.strip()
            changed = int((trimmed != result[col].astype(str)).sum())
            if changed:
                report.strings_trimmed += changed
                report.changes.append({"action": "trim_whitespace", "column": col, "rows_affected": changed})
            result[col] = trimmed.replace({"nan": None, "None": None, "": None})

    if config.standardize_strings:
        for col in result.select_dtypes(include=["object", "string"]).columns:
            result[col] = result[col].astype(str).str.strip()

    if config.null_strategy == "mark":
        for col in result.columns:
            null_count = int(result[col].isna().sum())
            if null_count:
                report.nulls_marked += null_count
        result["_has_null"] = result.isna().any(axis=1)

    if config.remove_duplicates and primary_key and primary_key in result.columns:
        before = len(result)
        result = result.drop_duplicates(subset=[primary_key], keep="first")
        report.duplicates_removed = before - len(result)
        if report.duplicates_removed:
            report.changes.append({
                "action": "remove_duplicates",
                "column": primary_key,
                "rows_removed": report.duplicates_removed,
            })

    if config.detect_invalid:
        invalid_mask = result.apply(
            lambda row: any(v == "INVALID_RECORD" for v in row.astype(str)),
            axis=1,
        )
        report.invalid_records_flagged = int(invalid_mask.sum())
        result["_is_invalid"] = invalid_mask
        if report.invalid_records_flagged:
            report.changes.append({
                "action": "flag_invalid",
                "rows_flagged": report.invalid_records_flagged,
            })

    report.rows_after = len(result)
    return result, report
