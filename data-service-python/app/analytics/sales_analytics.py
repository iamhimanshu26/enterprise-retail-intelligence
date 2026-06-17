"""Sales analytics — revenue breakdowns and trends."""

from __future__ import annotations

import pandas as pd

from app.analytics.models import BreakdownRow, SalesAnalytics


def _group_sum(df: pd.DataFrame, col: str, top_n: int = 10) -> list:
    if col not in df.columns:
        return []
    grouped = (
        df.groupby(col)["revenue"]
        .agg(["sum", "count"])
        .reset_index()
        .sort_values("sum", ascending=False)
        .head(top_n)
    )
    total = float(grouped["sum"].sum()) or 1.0
    return [
        BreakdownRow(
            dimension=str(row[col]),
            value=round(float(row["sum"]), 2),
            count=int(row["count"]),
            percentage=round(float(row["sum"]) / total * 100, 2),
        )
        for _, row in grouped.iterrows()
    ]


def compute_sales_analytics(df: pd.DataFrame) -> SalesAnalytics:
    work = df.copy()
    work["revenue"] = pd.to_numeric(work.get("revenue"), errors="coerce").fillna(0)

    by_day = by_week = by_month = by_quarter = by_year = []
    growth = None

    if "transaction_date" in work.columns:
        work["transaction_date"] = pd.to_datetime(work["transaction_date"], errors="coerce")
        work = work.dropna(subset=["transaction_date"]).set_index("transaction_date").sort_index()

        def resample_breakdown(freq: str, fmt: str, n: int = 12) -> list:
            grouped = work.resample(freq)["revenue"].agg(["sum", "count"]).tail(n)
            return [
                BreakdownRow(
                    dimension=idx.strftime(fmt) if hasattr(idx, "strftime") else str(idx),
                    value=round(float(row["sum"]), 2),
                    count=int(row["count"]),
                )
                for idx, row in grouped.iterrows()
            ]

        by_day = resample_breakdown("D", "%Y-%m-%d", 30)
        by_week = resample_breakdown("W", "%Y-W%W", 12)
        by_month = resample_breakdown("ME", "%Y-%m", 12)
        q = work.resample("QE")["revenue"].agg(["sum", "count"]).tail(8)
        by_quarter = [
            BreakdownRow(
                dimension=f"{idx.year}-Q{(idx.month - 1) // 3 + 1}",
                value=round(float(row["sum"]), 2),
                count=int(row["count"]),
            )
            for idx, row in q.iterrows()
        ]
        by_year = resample_breakdown("YE", "%Y", 5)

        daily = work.resample("D")["revenue"].sum()
        if len(daily) >= 2:
            growth = round((daily.iloc[-1] - daily.iloc[0]) / max(daily.iloc[0], 1) * 100, 2)

        top_days = daily.nlargest(5)
        low_days = daily.nsmallest(5)
        top_sales_days = [
            BreakdownRow(dimension=str(d.date()), value=round(float(v), 2), count=1)
            for d, v in top_days.items()
        ]
        low_sales_days = [
            BreakdownRow(dimension=str(d.date()), value=round(float(v), 2), count=1)
            for d, v in low_days.items()
        ]
    else:
        top_sales_days = low_sales_days = []

    work_reset = df.copy()
    work_reset["revenue"] = pd.to_numeric(work_reset.get("revenue"), errors="coerce").fillna(0)

    return SalesAnalytics(
        by_day=by_day,
        by_week=by_week,
        by_month=by_month,
        by_quarter=by_quarter,
        by_year=by_year,
        by_region=_group_sum(work_reset, "region"),
        by_store=_group_sum(work_reset, "store_code"),
        by_category=_group_sum(work_reset, "category"),
        by_payment_method=_group_sum(work_reset, "payment_method"),
        top_sales_days=top_sales_days,
        low_sales_days=low_sales_days,
        growth_trend_pct=growth,
    )
