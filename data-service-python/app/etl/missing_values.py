"""Missing value detection and handling strategies."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

import numpy as np
import pandas as pd

from app.etl.audit_log import AuditLog

MISSING_PLACEHOLDERS = {"", "nan", "none", "null", "n/a", "na", "-", "INVALID_RECORD"}


class MissingValueConfig:
    def __init__(
        self,
        strategy: str = "mark",
        constant_value: Optional[str] = None,
        per_column: Optional[Dict[str, str]] = None,
    ) -> None:
        self.strategy = strategy
        self.constant_value = constant_value
        self.per_column = per_column or {}


class MissingValueReport:
    def __init__(self) -> None:
        self.null_detected: int = 0
        self.empty_detected: int = 0
        self.whitespace_detected: int = 0
        self.placeholder_detected: int = 0
        self.values_fixed: int = 0
        self.rows_removed: int = 0
        self.changes: List[Dict[str, Any]] = []

    def to_dict(self) -> Dict[str, Any]:
        return {
            "null_detected": self.null_detected,
            "empty_detected": self.empty_detected,
            "whitespace_detected": self.whitespace_detected,
            "placeholder_detected": self.placeholder_detected,
            "values_fixed": self.values_fixed,
            "rows_removed": self.rows_removed,
            "strategy": "tracked",
            "changes": self.changes,
        }


def detect_missing(df: pd.DataFrame) -> Dict[str, Any]:
    stats: Dict[str, Any] = {"columns": {}, "total_missing_cells": 0}
    for col in df.columns:
        series = df[col]
        nulls = int(series.isna().sum())
        if series.dtype == object or str(series.dtype) == "string":
            as_str = series.astype(str)
            empty = int((as_str.str.strip() == "").sum())
            placeholders = int(as_str.str.lower().isin(MISSING_PLACEHOLDERS).sum())
            whitespace_only = int(as_str.apply(lambda x: x.strip() == "" and len(x) > 0).sum())
        else:
            empty, placeholders, whitespace_only = 0, 0, 0
        total = nulls + empty + placeholders
        stats["columns"][col] = {
            "null": nulls,
            "empty": empty,
            "placeholders": placeholders,
            "whitespace_only": whitespace_only,
            "total": total,
        }
        stats["total_missing_cells"] += total
    return stats


def handle_missing_values(
    df: pd.DataFrame,
    config: MissingValueConfig,
    audit: Optional[AuditLog] = None,
) -> tuple:
    report = MissingValueReport()
    result = df.copy()

    for col in result.columns:
        strategy = config.per_column.get(col, config.strategy)
        series = result[col]
        mask_null = series.isna()
        report.null_detected += int(mask_null.sum())

        if series.dtype == object or str(series.dtype) == "string":
            as_str = series.astype(str)
            mask_empty = as_str.str.strip().isin(MISSING_PLACEHOLDERS) | (as_str.str.strip() == "")
            report.empty_detected += int(mask_empty.sum())
            mask_missing = mask_null | mask_empty
        else:
            mask_missing = mask_null

        missing_count = int(mask_missing.sum())
        if missing_count == 0:
            continue

        if strategy == "remove_row":
            before = len(result)
            result = result[~mask_missing]
            removed = before - len(result)
            report.rows_removed += removed
            report.changes.append({"column": col, "action": "remove_row", "rows_removed": removed})
            if audit:
                audit.record_batch(col, removed, f"Missing value strategy: remove_row")
        elif strategy == "mean" and pd.api.types.is_numeric_dtype(series):
            fill_val = series.mean()
            result.loc[mask_missing, col] = fill_val
            report.values_fixed += missing_count
            if audit:
                audit.record_batch(col, missing_count, f"Filled with mean ({fill_val})")
        elif strategy == "median" and pd.api.types.is_numeric_dtype(series):
            fill_val = series.median()
            result.loc[mask_missing, col] = fill_val
            report.values_fixed += missing_count
            if audit:
                audit.record_batch(col, missing_count, f"Filled with median ({fill_val})")
        elif strategy == "mode":
            mode_vals = series.mode()
            if len(mode_vals) > 0:
                result.loc[mask_missing, col] = mode_vals.iloc[0]
                report.values_fixed += missing_count
                if audit:
                    audit.record_batch(col, missing_count, "Filled with mode")
        elif strategy == "constant" and config.constant_value is not None:
            result.loc[mask_missing, col] = config.constant_value
            report.values_fixed += missing_count
            if audit:
                audit.record_batch(col, missing_count, f"Filled with constant: {config.constant_value}")
        elif strategy == "forward_fill":
            filled = series.ffill()
            fixed = int((mask_missing & filled.notna()).sum())
            result[col] = filled
            report.values_fixed += fixed
            if audit and fixed:
                audit.record_batch(col, fixed, "Forward fill")
        elif strategy == "backward_fill":
            filled = series.bfill()
            fixed = int((mask_missing & filled.notna()).sum())
            result[col] = filled
            report.values_fixed += fixed
            if audit and fixed:
                audit.record_batch(col, fixed, "Backward fill")
        else:
            if "_missing_flag" not in result.columns:
                result["_missing_flag"] = mask_missing
            else:
                result["_missing_flag"] = result["_missing_flag"] | mask_missing
            report.changes.append({"column": col, "action": "mark", "rows_marked": missing_count})
            if audit:
                audit.record_batch(col, missing_count, "Marked missing — not removed")

    return result, report
