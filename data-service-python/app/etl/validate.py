"""Schema and data quality validation with structured reports."""

from datetime import datetime
from typing import Any, Dict, List, Optional

import numpy as np
import pandas as pd

from app.etl.config import ENTITY_SCHEMAS
from app.etl.exceptions import ValidationError


class ValidationReport:
    def __init__(self, entity: str) -> None:
        self.entity = entity
        self.passed = True
        self.errors: List[str] = []
        self.warnings: List[str] = []
        self.stats: Dict[str, Any] = {
            "rows_checked": 0,
            "missing_columns": [],
            "duplicate_keys": 0,
            "invalid_values": 0,
            "type_errors": 0,
            "enum_violations": 0,
            "date_format_errors": 0,
        }

    def to_dict(self) -> Dict[str, Any]:
        return {
            "entity": self.entity,
            "passed": self.passed,
            "errors": self.errors,
            "warnings": self.warnings,
            "stats": self.stats,
        }


def validate_dataframe(
    df: pd.DataFrame,
    entity: str,
    strict: bool = False,
) -> ValidationReport:
    report = ValidationReport(entity)
    schema = ENTITY_SCHEMAS.get(entity)
    if not schema:
        report.warnings.append(f"No schema registered for entity: {entity}")
        return report

    report.stats["rows_checked"] = len(df)
    if df.empty:
        report.warnings.append("Dataset is empty")
        return report

    _check_required_columns(df, schema, report)
    _check_primary_key(df, schema, report)
    _check_types(df, schema, report)
    _check_enums(df, schema, report)
    _check_dates(df, schema, report)

    if report.errors and strict:
        raise ValidationError("Validation failed", report=report.to_dict())

    return report


def _check_required_columns(df: pd.DataFrame, schema: Dict, report: ValidationReport) -> None:
    missing = [c for c in schema["required_columns"] if c not in df.columns]
    if missing:
        report.stats["missing_columns"] = missing
        report.errors.append(f"Missing required columns: {missing}")
        report.passed = False


def _check_primary_key(df: pd.DataFrame, schema: Dict, report: ValidationReport) -> None:
    pk = schema.get("primary_key")
    if not pk or pk not in df.columns:
        return
    dupes = int(df[pk].duplicated().sum())
    report.stats["duplicate_keys"] = dupes
    if dupes > 0:
        report.warnings.append(f"Duplicate primary key values in '{pk}': {dupes}")
        report.passed = False


def _check_types(df: pd.DataFrame, schema: Dict, report: ValidationReport) -> None:
    types = schema.get("types", {})
    for col, expected in types.items():
        if col not in df.columns:
            continue
        series = df[col]
        if expected == "numeric":
            coerced = pd.to_numeric(series, errors="coerce")
            invalid = int(coerced.isna().sum() - series.isna().sum())
            if invalid > 0:
                report.stats["type_errors"] += invalid
                report.warnings.append(f"Column '{col}' has {invalid} non-numeric values")


def _check_enums(df: pd.DataFrame, schema: Dict, report: ValidationReport) -> None:
    enums = schema.get("enums", {})
    for col, allowed in enums.items():
        if col not in df.columns:
            continue
        values = df[col].dropna().astype(str)
        invalid = values[~values.isin(allowed)]
        count = len(invalid)
        if count > 0:
            report.stats["enum_violations"] += count
            report.stats["invalid_values"] += count
            report.warnings.append(f"Column '{col}' has {count} values outside allowed enum")


def _check_dates(df: pd.DataFrame, schema: Dict, report: ValidationReport) -> None:
    types = schema.get("types", {})
    for col, expected in types.items():
        if expected not in ("date", "datetime") or col not in df.columns:
            continue
        parsed = pd.to_datetime(df[col], errors="coerce")
        invalid = int(parsed.isna().sum() - df[col].isna().sum())
        if invalid > 0:
            report.stats["date_format_errors"] += invalid
            report.warnings.append(f"Column '{col}' has {invalid} invalid date values")
