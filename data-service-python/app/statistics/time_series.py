"""Time-based revenue and growth statistics."""

from __future__ import annotations

import pandas as pd

from app.statistics.models import TimeSeriesPoint, TimeSeriesStats


def compute_time_series_stats(df: pd.DataFrame) -> TimeSeriesStats:
    if "transaction_date" not in df.columns or "revenue" not in df.columns:
        return TimeSeriesStats()

    work = df.copy()
    work["transaction_date"] = pd.to_datetime(work["transaction_date"], errors="coerce")
    work["revenue"] = pd.to_numeric(work["revenue"], errors="coerce").fillna(0)
    work = work.dropna(subset=["transaction_date"])
    if work.empty:
        return TimeSeriesStats()

    work = work.set_index("transaction_date").sort_index()

    def aggregate(freq: str, label_fmt: str) -> list:
        grouped = work.resample(freq)["revenue"].agg(["sum", "count"])
        points = []
        prev_rev = None
        for idx, row in grouped.iterrows():
            rev = float(row["sum"])
            growth = None
            if prev_rev is not None and prev_rev > 0:
                growth = round((rev - prev_rev) / prev_rev * 100, 2)
            points.append(
                TimeSeriesPoint(
                    period=idx.strftime(label_fmt),
                    revenue=round(rev, 2),
                    orders=int(row["count"]),
                    growth_pct=growth,
                )
            )
            prev_rev = rev
        return points

    daily = aggregate("D", "%Y-%m-%d")
    weekly = aggregate("W", "%Y-W%W")
    monthly = aggregate("ME", "%Y-%m")
    quarterly = []
    q_grouped = work.resample("QE")["revenue"].agg(["sum", "count"])
    for idx, row in q_grouped.iterrows():
        q = (idx.month - 1) // 3 + 1
        quarterly.append(
            TimeSeriesPoint(
                period=f"{idx.year}-Q{q}",
                revenue=round(float(row["sum"]), 2),
                orders=int(row["count"]),
            )
        )
    yearly = aggregate("YE", "%Y")

    mom = None
    if len(monthly) >= 2:
        mom = monthly[-1].growth_pct

    yoy = None
    if len(yearly) >= 2:
        yoy = round(
            (yearly[-1].revenue - yearly[-2].revenue) / max(yearly[-2].revenue, 1) * 100,
            2,
        )

    rolling_avg = None
    if len(daily) >= 7:
        rolling_avg = round(sum(p.revenue for p in daily[-7:]) / 7, 2)

    return TimeSeriesStats(
        daily=daily[-30:],
        weekly=weekly[-12:],
        monthly=monthly[-12:],
        quarterly=quarterly[-8:],
        yearly=yearly[-5:],
        month_over_month_growth_pct=mom,
        year_over_year_growth_pct=yoy,
        rolling_average_7d=rolling_avg,
    )
