"""Reusable aggregation functions for analytics layer preparation."""

from __future__ import annotations

from typing import Any, Dict

import pandas as pd


class AggregateReport:
    def __init__(self) -> None:
        self.aggregations: Dict[str, int] = {}

    def to_dict(self) -> Dict[str, Any]:
        return {"aggregations": self.aggregations}


def aggregate_sales(
    sales_df: pd.DataFrame,
    stores_df: pd.DataFrame | None = None,
    products_df: pd.DataFrame | None = None,
) -> Dict[str, pd.DataFrame]:
    """Build standard sales aggregations for future dashboard APIs."""
    results: Dict[str, pd.DataFrame] = {}
    sales = sales_df.copy()

    if "transaction_date" in sales.columns:
        sales["transaction_date"] = pd.to_datetime(sales["transaction_date"], errors="coerce")
        sales["month"] = sales["transaction_date"].dt.to_period("M").astype(str)

    amount_col = "total_amount" if "total_amount" in sales.columns else None
    if not amount_col:
        return results

    sales[amount_col] = pd.to_numeric(sales[amount_col], errors="coerce")

    if stores_df is not None and "store_index" in sales.columns and "region" in stores_df.columns:
        merged = sales.merge(
            stores_df[["store_index", "region"]].drop_duplicates(),
            on="store_index",
            how="left",
        )
        results["sales_by_region"] = (
            merged.groupby("region", dropna=False)[amount_col]
            .agg(total_sales="sum", transaction_count="count")
            .reset_index()
        )

    if "store_index" in sales.columns:
        results["sales_by_store"] = (
            sales.groupby("store_index")[amount_col]
            .agg(total_sales="sum", transaction_count="count")
            .reset_index()
        )

    if products_df is not None and "product_index" in sales.columns and "category" in products_df.columns:
        items = sales.copy()
        if "product_index" not in items.columns:
            pass
        else:
            merged = items.merge(
                products_df[["product_index", "category"]].drop_duplicates(),
                on="product_index",
                how="left",
            )
            results["sales_by_category"] = (
                merged.groupby("category", dropna=False)[amount_col]
                .agg(total_sales="sum", transaction_count="count")
                .reset_index()
            )

    if "month" in sales.columns:
        results["sales_by_month"] = (
            sales.groupby("month")[amount_col]
            .agg(total_sales="sum", transaction_count="count")
            .reset_index()
        )

    return results


def run_aggregations(
    datasets: Dict[str, pd.DataFrame],
) -> tuple:
    report = AggregateReport()
    aggregations: Dict[str, pd.DataFrame] = {}

    sales = datasets.get("sales_transactions")
    if sales is not None and not sales.empty:
        aggregations = aggregate_sales(
            sales,
            stores_df=datasets.get("stores"),
            products_df=datasets.get("products"),
        )
        report.aggregations = {k: len(v) for k, v in aggregations.items()}

    return aggregations, report
