"""Currency normalization engine."""

from __future__ import annotations

import re
from decimal import Decimal, InvalidOperation
from typing import Any, Dict, List

import numpy as np
import pandas as pd

from app.etl.audit_log import AuditLog

CURRENCY_COLUMNS = [
    "unit_price", "cost_price", "total_amount", "total_cost",
    "gross_profit", "discount_amount", "tax_amount", "refund_amount",
    "line_total", "revenue", "cost",
]


class CurrencyTransformReport:
    def __init__(self) -> None:
        self.columns_normalized: List[str] = []
        self.values_normalized: int = 0
        self.parse_errors: int = 0

    def to_dict(self) -> Dict[str, Any]:
        return {
            "columns_normalized": self.columns_normalized,
            "values_normalized": self.values_normalized,
            "parse_errors": self.parse_errors,
            "precision": 2,
        }


def _parse_currency(value: Any) -> float | None:
    if value is None or (isinstance(value, float) and np.isnan(value)):
        return None
    if isinstance(value, (int, float, Decimal)):
        return round(float(value), 2)
    text = str(value).strip()
    text = re.sub(r"[¥$€,\s]", "", text)
    try:
        return round(float(Decimal(text)), 2)
    except (InvalidOperation, ValueError):
        return None


def normalize_currency(df: pd.DataFrame, audit: AuditLog | None = None) -> tuple:
    report = CurrencyTransformReport()
    result = df.copy()

    cols = [c for c in result.columns if c in CURRENCY_COLUMNS or "amount" in c.lower() or "price" in c.lower()]

    for col in cols:
        if not pd.api.types.is_numeric_dtype(result[col]):
            parsed = result[col].map(_parse_currency)
            errors = int(parsed.isna().sum() - result[col].isna().sum())
            report.parse_errors += max(errors, 0)
            result[col] = parsed
        else:
            result[col] = pd.to_numeric(result[col], errors="coerce").round(2)

        report.columns_normalized.append(col)
        report.values_normalized += int(result[col].notna().sum())
        if audit:
            audit.record_batch(col, report.values_normalized, "Currency normalized to decimal")

    return result, report
