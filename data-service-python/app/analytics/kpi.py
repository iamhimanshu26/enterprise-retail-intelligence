"""Enterprise KPI analytics."""

from __future__ import annotations

import pandas as pd

from app.statistics.business import compute_business_metrics
from app.analytics.models import KpiAnalytics, KpiMetric


def compute_kpi_analytics(df: pd.DataFrame) -> KpiAnalytics:
    business = compute_business_metrics(df)
    revenue = pd.to_numeric(df.get("revenue"), errors="coerce").fillna(0)
    profit = pd.to_numeric(df.get("profit"), errors="coerce").fillna(0)
    quantity = pd.to_numeric(df.get("quantity"), errors="coerce").fillna(0)

    if "transaction_date" in df.columns:
        work = df.copy()
        work["transaction_date"] = pd.to_datetime(work["transaction_date"], errors="coerce")
        work = work.dropna(subset=["transaction_date"]).sort_values("transaction_date")
        if len(work) >= 2:
            mid = len(work) // 2
            first_rev = work.iloc[:mid]["revenue"].sum()
            second_rev = work.iloc[mid:]["revenue"].sum()
            sales_growth = ((second_rev - first_rev) / max(first_rev, 1)) * 100
            first_profit = work.iloc[:mid]["profit"].sum()
            second_profit = work.iloc[mid:]["profit"].sum()
            profit_growth = ((second_profit - first_profit) / max(abs(first_profit), 1)) * 100
        else:
            sales_growth = profit_growth = 0.0
    else:
        sales_growth = profit_growth = 0.0

    stock_risk = 0
    if "stock_on_hand" in df.columns and "reorder_level" in df.columns:
        stock = pd.to_numeric(df["stock_on_hand"], errors="coerce").fillna(0)
        reorder = pd.to_numeric(df["reorder_level"], errors="coerce").fillna(0)
        stock_risk = int((stock <= reorder).sum())

    inventory_value = 0.0
    if "stock_on_hand" in df.columns and "unit_cost" in df.columns:
        inventory_value = float(
            (pd.to_numeric(df["stock_on_hand"], errors="coerce").fillna(0)
             * pd.to_numeric(df["unit_cost"], errors="coerce").fillna(0)).sum()
        )

    active_customers = df["customer_id"].nunique() if "customer_id" in df.columns else 0
    active_stores = df["store_code"].nunique() if "store_code" in df.columns else 0

    metrics = [
        KpiMetric(id="total_revenue", label="Total Revenue", value=round(float(revenue.sum()), 2), unit="JPY"),
        KpiMetric(id="total_profit", label="Total Profit", value=round(float(profit.sum()), 2), unit="JPY"),
        KpiMetric(id="gross_margin", label="Gross Margin", value=business.profit_margin_pct, unit="%"),
        KpiMetric(id="net_sales", label="Net Sales", value=round(float(revenue.sum() - df.get("refund_amount", pd.Series(0)).sum()), 2), unit="JPY"),
        KpiMetric(id="total_orders", label="Total Orders", value=float(len(df)), unit="orders"),
        KpiMetric(id="average_order_value", label="Average Order Value", value=business.average_order_value, unit="JPY"),
        KpiMetric(id="units_sold", label="Units Sold", value=float(quantity.sum()), unit="units"),
        KpiMetric(id="active_customers", label="Active Customers", value=float(active_customers), unit="customers"),
        KpiMetric(id="active_stores", label="Active Stores", value=float(active_stores), unit="stores"),
        KpiMetric(id="return_rate", label="Return Rate", value=business.return_rate_pct, unit="%"),
        KpiMetric(id="discount_rate", label="Discount Rate", value=business.discount_rate_pct, unit="%"),
        KpiMetric(id="sales_growth", label="Sales Growth", value=round(sales_growth, 2), unit="%"),
        KpiMetric(id="profit_growth", label="Profit Growth", value=round(profit_growth, 2), unit="%"),
        KpiMetric(id="inventory_value", label="Inventory Value", value=round(inventory_value, 2), unit="JPY"),
        KpiMetric(id="stock_risk_count", label="Stock Risk Count", value=float(stock_risk), unit="items"),
    ]
    return KpiAnalytics(metrics=metrics)
