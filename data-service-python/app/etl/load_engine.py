"""Enterprise load engine with reusable load strategies."""

from __future__ import annotations

from typing import Any, Dict, Optional

import pandas as pd

from app.etl.config import LoadStrategy
from app.etl.exceptions import LoadError


class LoadResult:
    def __init__(self) -> None:
        self.inserted: int = 0
        self.updated: int = 0
        self.skipped: int = 0
        self.failed: int = 0
        self.strategy: str = LoadStrategy.FULL.value
        self.table: str = ""
        self.status: str = "success"

    def to_dict(self) -> Dict[str, Any]:
        return {
            "table": self.table,
            "strategy": self.strategy,
            "inserted": self.inserted,
            "updated": self.updated,
            "skipped": self.skipped,
            "failed": self.failed,
            "total_processed": self.inserted + self.updated + self.skipped + self.failed,
            "status": self.status,
        }


def execute_load(
    df: pd.DataFrame,
    table_name: str,
    strategy: LoadStrategy,
    existing: Optional[pd.DataFrame] = None,
    primary_key: Optional[str] = None,
) -> tuple:
    """Apply load strategy and return (result_df, LoadResult)."""
    result = LoadResult()
    result.table = table_name
    result.strategy = strategy.value

    if df.empty:
        result.skipped = 0
        return df, result

    try:
        if strategy == LoadStrategy.REPLACE or strategy == LoadStrategy.FULL:
            result.inserted = len(df)
            return df.copy(), result

        if strategy == LoadStrategy.APPEND:
            if existing is not None and not existing.empty:
                combined = pd.concat([existing, df], ignore_index=True)
                result.inserted = len(df)
                return combined, result
            result.inserted = len(df)
            return df.copy(), result

        if strategy == LoadStrategy.INCREMENTAL:
            if existing is None or existing.empty:
                result.inserted = len(df)
                return df.copy(), result

            if primary_key and primary_key in df.columns and primary_key in existing.columns:
                existing_keys = set(existing[primary_key].astype(str))
                new_mask = ~df[primary_key].astype(str).isin(existing_keys)
                new_rows = df[new_mask]
                update_mask = df[primary_key].astype(str).isin(existing_keys)
                update_rows = df[update_mask]

                result.inserted = len(new_rows)
                result.updated = len(update_rows)
                result.skipped = 0

                merged = existing.copy()
                if not update_rows.empty:
                    merged = merged.set_index(primary_key)
                    update_rows = update_rows.set_index(primary_key)
                    merged.update(update_rows)
                    merged = merged.reset_index()
                if not new_rows.empty:
                    merged = pd.concat([merged, new_rows], ignore_index=True)
                return merged, result

            result.inserted = len(df)
            combined = pd.concat([existing, df], ignore_index=True)
            return combined, result

        result.inserted = len(df)
        return df.copy(), result

    except Exception as exc:
        result.failed = len(df)
        result.status = "failed"
        raise LoadError(f"Load strategy {strategy.value} failed: {exc}", stage="load")
