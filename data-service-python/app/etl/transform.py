"""Configurable field transformations and derived metrics."""

from typing import Any, Dict

import numpy as np
import pandas as pd

from app.etl.config import TransformConfig
from app.etl.exceptions import TransformError


class TransformReport:
    def __init__(self) -> None:
        self.columns_added: list = []
        self.columns_modified: list = []
        self.stats: Dict[str, Any] = {}

    def to_dict(self) -> Dict[str, Any]:
        return {
            "columns_added": self.columns_added,
            "columns_modified": self.columns_modified,
            "stats": self.stats,
        }


def transform_dataframe(
    df: pd.DataFrame,
    entity: str,
    config: TransformConfig,
) -> tuple:
    report = TransformReport()
    result = df.copy()

    try:
        if config.parse_dates:
            for col in result.columns:
                if "date" in col.lower():
                    result[col] = pd.to_datetime(result[col], errors="coerce")
                    report.columns_modified.append(col)

        if entity == "products" and config.compute_gross_margin:
            if "unit_price" in result.columns and "cost_price" in result.columns:
                unit = pd.to_numeric(result["unit_price"], errors="coerce")
                cost = pd.to_numeric(result["cost_price"], errors="coerce")
                result["gross_margin"] = np.round(unit - cost, config.currency_precision)
                result["margin_pct"] = np.round(
                    ((unit - cost) / unit.replace(0, np.nan)) * 100,
                    2,
                )
                report.columns_added.extend(["gross_margin", "margin_pct"])

        if entity == "sales_transactions":
            for col in ["total_amount", "total_cost", "gross_profit", "discount_amount", "tax_amount"]:
                if col in result.columns:
                    result[col] = pd.to_numeric(result[col], errors="coerce").round(config.currency_precision)
                    report.columns_modified.append(col)
            if "total_amount" in result.columns and "total_cost" in result.columns:
                result["computed_profit"] = (
                    pd.to_numeric(result["total_amount"], errors="coerce")
                    - pd.to_numeric(result["total_cost"], errors="coerce")
                ).round(config.currency_precision)
                report.columns_added.append("computed_profit")

        report.stats["rows_transformed"] = len(result)
    except Exception as exc:
        raise TransformError(f"Transformation failed: {exc}", stage="transform")

    return result, report
