"""Inventory demand and reorder forecasting."""

from __future__ import annotations

import pandas as pd

from app.forecasting.models import InventoryForecast, InventoryForecastRow


def compute_inventory_forecast(df: pd.DataFrame) -> InventoryForecast:
    rows: list[InventoryForecastRow] = []

    if "stock_on_hand" in df.columns and "product_code" in df.columns:
        grouped = df.groupby("product_code").agg(
            stock=("stock_on_hand", "last"),
            reorder=("reorder_level", "last"),
            usage=("quantity", "sum"),
            days=("transaction_date", "nunique"),
        )
        for code, row in grouped.head(15).iterrows():
            days = max(int(row["days"]), 1)
            daily_usage = float(row["usage"]) / days
            stock = float(row["stock"])
            reorder = float(row["reorder"])
            days_until = stock / daily_usage if daily_usage > 0 else None
            risk = min(100.0, max(0.0, (daily_usage * 14 - stock) / max(reorder, 1) * 50))
            if stock <= reorder:
                recommendation = "reorder_now"
            elif days_until is not None and days_until < 14:
                recommendation = "reorder_soon"
            else:
                recommendation = "monitor"
            rows.append(
                InventoryForecastRow(
                    product_code=str(code),
                    expected_usage=round(daily_usage * 30, 2),
                    stock_out_risk_score=round(risk, 2),
                    reorder_recommendation=recommendation,
                    days_until_stock_out=round(days_until, 1) if days_until is not None else None,
                    reorder_quantity_placeholder=round(max(reorder * 2 - stock, 0), 2),
                    current_stock=round(stock, 2),
                )
            )
    else:
        usage_by_product = df.groupby("product_code")["quantity"].sum().sort_values(ascending=False).head(10)
        for code, usage in usage_by_product.items():
            rows.append(
                InventoryForecastRow(
                    product_code=str(code),
                    expected_usage=round(float(usage) * 0.15, 2),
                    stock_out_risk_score=35.0,
                    reorder_recommendation="monitor",
                    days_until_stock_out=21.0,
                    reorder_quantity_placeholder=round(float(usage) * 0.1, 2),
                    current_stock=0.0,
                )
            )

    aggregate_risk = float(sum(r.stock_out_risk_score for r in rows) / max(len(rows), 1))
    return InventoryForecast(items=rows, aggregate_stock_out_risk=round(aggregate_risk, 2))
