"""Standardization engine for store names, categories, and customer names."""

from __future__ import annotations

import re
from typing import Any, Dict

import pandas as pd

from app.etl.audit_log import AuditLog


class StandardizeReport:
    def __init__(self) -> None:
        self.columns_standardized: list = []
        self.values_changed: int = 0

    def to_dict(self) -> Dict[str, Any]:
        return {
            "columns_standardized": self.columns_standardized,
            "values_changed": self.values_changed,
        }


def _title_store_name(name: str) -> str:
    if not name or name.lower() in ("nan", "none"):
        return name
    parts = re.split(r"\s+", name.strip())
    return " ".join(p.capitalize() if p.isupper() or p.islower() else p for p in parts)


def _normalize_category(cat: str) -> str:
    if not cat or cat.lower() in ("nan", "none"):
        return cat
    return cat.strip().title()


def _normalize_customer_name(name: str) -> str:
    if not name or name.lower() in ("nan", "none"):
        return name
    cleaned = re.sub(r"\s+", " ", name.strip())
    cleaned = re.sub(r"[^\w\s\-'.]", "", cleaned)
    return cleaned.title()


def standardize_dataframe(df: pd.DataFrame, audit: AuditLog | None = None) -> tuple:
    report = StandardizeReport()
    result = df.copy()

    if "store_name" in result.columns:
        before = result["store_name"].astype(str)
        after = before.map(_title_store_name)
        changed = int((before != after).sum())
        result["store_name"] = after
        if changed:
            report.columns_standardized.append("store_name")
            report.values_changed += changed
            if audit:
                audit.record_batch("store_name", changed, "Store name capitalization standardization")

    if "category" in result.columns:
        before = result["category"].astype(str)
        after = before.map(_normalize_category)
        changed = int((before != after).sum())
        result["category"] = after
        if changed:
            report.columns_standardized.append("category")
            report.values_changed += changed
            if audit:
                for idx in result.index[before != after][:10]:
                    audit.record("category", before.loc[idx], after.loc[idx], "Category normalization", int(idx))

    for name_col in ("first_name", "last_name", "customer_name", "product_name"):
        if name_col in result.columns:
            before = result[name_col].astype(str)
            after = before.map(_normalize_customer_name)
            changed = int((before != after).sum())
            result[name_col] = after
            if changed:
                report.columns_standardized.append(name_col)
                report.values_changed += changed
                if audit:
                    audit.record_batch(name_col, changed, "Name trim and capitalization")

    return result, report
