"""Data quality simulation for synthetic datasets."""

import numpy as np
import pandas as pd


def apply_data_quality(
    df: pd.DataFrame,
    missing_pct: float,
    duplicate_pct: float,
    invalid_pct: float,
    outlier_pct: float,
    null_pct: float,
    rng: np.random.Generator,
) -> pd.DataFrame:
    """Inject configurable data quality issues for ETL validation testing."""
    if df.empty:
        return df

    result = df.copy()
    row_count = len(result)
    numeric_cols = result.select_dtypes(include=[np.number]).columns.tolist()
    text_cols = [c for c in result.columns if c not in numeric_cols]

    # Missing values (empty strings in text columns)
    if missing_pct > 0 and text_cols:
        n_missing = int(row_count * missing_pct / 100)
        if n_missing > 0:
            rows = rng.choice(result.index, size=min(n_missing, row_count), replace=False)
            col = rng.choice(text_cols)
            result.loc[rows, col] = ""

    # Null values
    if null_pct > 0:
        n_null = int(row_count * null_pct / 100)
        if n_null > 0:
            rows = rng.choice(result.index, size=min(n_null, row_count), replace=False)
            col = rng.choice(list(result.columns))
            result.loc[rows, col] = None

    # Invalid records (mark with sentinel values)
    if invalid_pct > 0 and text_cols:
        n_invalid = int(row_count * invalid_pct / 100)
        if n_invalid > 0:
            rows = rng.choice(result.index, size=min(n_invalid, row_count), replace=False)
            col = rng.choice(text_cols)
            result.loc[rows, col] = "INVALID_RECORD"

    # Outliers in numeric columns
    if outlier_pct > 0 and numeric_cols:
        n_outlier = int(row_count * outlier_pct / 100)
        if n_outlier > 0:
            rows = rng.choice(result.index, size=min(n_outlier, row_count), replace=False)
            col = rng.choice(numeric_cols)
            multiplier = rng.choice([10, 50, 100, -10])
            result.loc[rows, col] = result[col].median() * multiplier

    # Duplicate rows
    if duplicate_pct > 0:
        n_dup = int(row_count * duplicate_pct / 100)
        if n_dup > 0:
            sample = result.sample(n=min(n_dup, row_count), random_state=int(rng.integers(0, 1_000_000)))
            result = pd.concat([result, sample], ignore_index=True)

    return result
