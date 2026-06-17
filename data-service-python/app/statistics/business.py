"""Retail business statistics and KPI formulas."""

from __future__ import annotations

import pandas as pd

from app.statistics.models import BusinessMetrics

# Formulas (documented for API/UI reference):
# AOV = Total Revenue / Total Orders
# Profit Margin = Gross Profit / Revenue × 100
# Return Rate = Returned Transactions / Total Transactions × 100
# Discount Rate = mean(discount_rate) or weighted by revenue
# Revenue per Store = Total Revenue / Unique Stores
# Revenue per Customer = Total Revenue / Unique Customers
# Revenue per Product = Total Revenue / Unique Products
# Sales per Transaction = Total Revenue / Total Orders
# Units per Transaction = Total Quantity / Total Orders


def compute_business_metrics(df: pd.DataFrame) -> BusinessMetrics:
    revenue = pd.to_numeric(df.get("revenue"), errors="coerce").fillna(0)
    cost = pd.to_numeric(df.get("cost"), errors="coerce").fillna(0)
    profit = pd.to_numeric(df.get("profit"), errors="coerce")
    if profit.isna().all() and not revenue.empty:
        profit = revenue - cost
    profit = profit.fillna(0)
    quantity = pd.to_numeric(df.get("quantity"), errors="coerce").fillna(0)
    discount = pd.to_numeric(df.get("discount_rate"), errors="coerce").fillna(0)

    total_revenue = float(revenue.sum())
    total_orders = len(df)
    gross_profit = float(profit.sum())

    returned_mask = df.get("returned")
    if returned_mask is not None:
        returned_count = int(returned_mask.astype(bool).sum())
    else:
        refunds = pd.to_numeric(df.get("refund_amount"), errors="coerce").fillna(0)
        returned_count = int((refunds > 0).sum())

    unique_stores = df["store_code"].nunique() if "store_code" in df.columns else 1
    unique_customers = df["customer_id"].nunique() if "customer_id" in df.columns else 1
    unique_products = df["product_code"].nunique() if "product_code" in df.columns else 1

    aov = total_revenue / max(total_orders, 1)
    margin = (gross_profit / total_revenue * 100) if total_revenue > 0 else 0.0
    return_rate = (returned_count / max(total_orders, 1)) * 100
    discount_rate = float(discount.mean()) if len(discount) > 0 else 0.0

    return BusinessMetrics(
        average_order_value=round(aov, 2),
        revenue_per_store=round(total_revenue / max(unique_stores, 1), 2),
        revenue_per_customer=round(total_revenue / max(unique_customers, 1), 2),
        revenue_per_product=round(total_revenue / max(unique_products, 1), 2),
        profit_margin_pct=round(margin, 2),
        gross_profit=round(gross_profit, 2),
        return_rate_pct=round(return_rate, 2),
        discount_rate_pct=round(discount_rate, 2),
        inventory_turnover=None,
        customer_lifetime_value=None,
        sales_per_transaction=round(aov, 2),
        units_per_transaction=round(float(quantity.sum()) / max(total_orders, 1), 2),
        total_revenue=round(total_revenue, 2),
        total_orders=total_orders,
    )
