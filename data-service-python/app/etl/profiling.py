"""Data profiling engine for ETL datasets."""

from __future__ import annotations

from typing import Any, Dict, List

import numpy as np
import pandas as pd


class ProfilingReport:
    def __init__(self) -> None:
        self.total_rows: int = 0
        self.total_columns: int = 0
        self.columns: Dict[str, Dict[str, Any]] = {}

    def to_dict(self) -> Dict[str, Any]:
        return {
            "total_rows": self.total_rows,
            "total_columns": self.total_columns,
            "columns": self.columns,
        }


def profile_dataframe(df: pd.DataFrame) -> ProfilingReport:
    report = ProfilingReport()
    report.total_rows = len(df)
    report.total_columns = len(df.columns)

    for col in df.columns:
        series = df[col]
        numeric = pd.to_numeric(series, errors="coerce")
        is_numeric = numeric.notna().sum() > 0 and series.dtype in ("int64", "float64") or numeric.notna().sum() > len(series) * 0.5

        null_count = int(series.isna().sum())
        empty_count = int((series.astype(str).str.strip() == "").sum()) if series.dtype == object else 0
        duplicate_count = int(series.duplicated().sum())

        col_profile: Dict[str, Any] = {
            "dtype": str(series.dtype),
            "null_count": null_count,
            "empty_string_count": empty_count,
            "duplicate_count": duplicate_count,
            "unique_count": int(series.nunique(dropna=True)),
            "null_pct": round(null_count / max(len(df), 1) * 100, 2),
        }

        if is_numeric or numeric.notna().any():
            valid = numeric.dropna()
            if len(valid) > 0:
                col_profile["min"] = float(valid.min())
                col_profile["max"] = float(valid.max())
                col_profile["mean"] = round(float(valid.mean()), 4)
                col_profile["std"] = round(float(valid.std()), 4) if len(valid) > 1 else 0.0

        report.columns[col] = col_profile

    return report
