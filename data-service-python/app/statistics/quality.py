"""Dataset health statistics integrated with Phase 4 quality concepts."""

from __future__ import annotations

import pandas as pd

from app.statistics.models import DatasetHealth


def compute_dataset_health(df: pd.DataFrame, quality_score: float | None = None) -> DatasetHealth:
    total = len(df)
    if total == 0:
        return DatasetHealth()

    null_cells = int(df.isna().sum().sum())
    total_cells = total * max(len(df.columns), 1)
    null_pct = round(null_cells / total_cells * 100, 2)

    dup_pct = 0.0
    if "transaction_id" in df.columns:
        dup_pct = round(df["transaction_id"].duplicated().sum() / total * 100, 2)
    elif "store_code" in df.columns:
        dup_pct = round(df.duplicated().sum() / total * 100, 2)

    required = ["revenue", "transaction_date", "region"]
    present_required = [c for c in required if c in df.columns]
    if present_required:
        valid_mask = df[present_required].notna().all(axis=1)
        valid = int(valid_mask.sum())
    else:
        valid = total

    invalid = total - valid
    completeness = round(valid / total * 100, 2)
    consistency = round(max(0, 100 - dup_pct - null_pct * 0.5), 2)
    dqi = quality_score if quality_score is not None else round((completeness + consistency) / 2, 2)

    return DatasetHealth(
        total_records=total,
        valid_records=valid,
        invalid_records=invalid,
        null_percentage=null_pct,
        duplicate_percentage=dup_pct,
        completeness_pct=completeness,
        consistency_pct=consistency,
        quality_score=dqi,
        data_quality_index=dqi,
    )
