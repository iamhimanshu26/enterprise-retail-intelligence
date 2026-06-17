"""Inventory analytics and stock risk."""

from __future__ import annotations

import pandas as pd

from app.analytics.models import InventoryAnalytics, InventoryItem


def compute_inventory_analytics(df: pd.DataFrame) -> InventoryAnalytics:
    if "product_code" not in df.columns:
        return InventoryAnalytics()

    work = df.groupby("product_code").agg({
        "stock_on_hand": "first" if "stock_on_hand" in df.columns else "count",
        "reorder_level": "first" if "reorder_level" in df.columns else "count",
        "unit_cost": "mean" if "unit_cost" in df.columns else "count",
        "quantity": "sum",
        "revenue": "sum",
    }).reset_index() if "stock_on_hand" in df.columns else pd.DataFrame()

    if work.empty and "stock_on_hand" not in df.columns:
        return InventoryAnalytics()

    if "stock_on_hand" not in df.columns:
        return InventoryAnalytics()

    products = df.groupby("product_code").agg({
        "stock_on_hand": "max",
        "reorder_level": "max",
        "unit_cost": "mean",
        "quantity": "sum",
    }).reset_index()

    products["stock_on_hand"] = pd.to_numeric(products["stock_on_hand"], errors="coerce").fillna(0)
    products["reorder_level"] = pd.to_numeric(products["reorder_level"], errors="coerce").fillna(0)
    products["unit_cost"] = pd.to_numeric(products["unit_cost"], errors="coerce").fillna(0)
    products["quantity"] = pd.to_numeric(products["quantity"], errors="coerce").fillna(0)

    products["inventory_value"] = products["stock_on_hand"] * products["unit_cost"]
    inv_value = float(products["inventory_value"].sum())

    low = int((products["stock_on_hand"] <= products["reorder_level"]).sum())
    out = int((products["stock_on_hand"] == 0).sum())
    over = int((products["stock_on_hand"] > products["reorder_level"] * 3).sum())

    velocity = products.set_index("product_code")["quantity"].to_dict()
    fast = sorted(velocity, key=velocity.get, reverse=True)[:5]
    slow = sorted(velocity, key=velocity.get)[:5]

    reorder_items: list = []
    for _, row in products[products["stock_on_hand"] <= products["reorder_level"]].head(10).iterrows():
        risk = min(100.0, 50 + (row["reorder_level"] - row["stock_on_hand"]) / max(row["reorder_level"], 1) * 50)
        status = "out_of_stock" if row["stock_on_hand"] == 0 else "low_stock"
        reorder_items.append(
            InventoryItem(
                product_code=str(row["product_code"]),
                stock_on_hand=int(row["stock_on_hand"]),
                reorder_level=int(row["reorder_level"]),
                inventory_value=round(float(row["inventory_value"]), 2),
                risk_score=round(risk, 2),
                status=status,
            )
        )

    stock_risk = min(100.0, round((low + out * 2) / max(len(products), 1) * 100, 2))

    return InventoryAnalytics(
        inventory_value=round(inv_value, 2),
        low_stock_count=low,
        overstock_count=over,
        out_of_stock_count=out,
        fast_moving=fast,
        slow_moving=slow,
        reorder_candidates=reorder_items,
        stock_risk_score=stock_risk,
    )
