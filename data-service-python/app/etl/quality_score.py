"""Enterprise data quality scoring."""

from __future__ import annotations

from typing import Any, Dict

import pandas as pd

from app.etl.profiling import ProfilingReport


class QualityScore:
    def __init__(self) -> None:
        self.completeness: float = 100.0
        self.consistency: float = 100.0
        self.validity: float = 100.0
        self.accuracy: float = 100.0
        self.uniqueness: float = 100.0
        self.overall: float = 100.0

    def to_dict(self) -> Dict[str, Any]:
        return {
            "completeness": round(self.completeness, 2),
            "consistency": round(self.consistency, 2),
            "validity": round(self.validity, 2),
            "accuracy": round(self.accuracy, 2),
            "uniqueness": round(self.uniqueness, 2),
            "overall": round(self.overall, 2),
        }


def compute_quality_score(
    df: pd.DataFrame,
    profile: ProfilingReport,
    duplicate_count: int = 0,
    business_violations: int = 0,
    primary_key: str | None = None,
) -> QualityScore:
    score = QualityScore()
    rows = max(len(df), 1)
    total_cells = rows * max(len(df.columns), 1)

    missing_cells = sum(c.get("null_count", 0) + c.get("empty_string_count", 0) for c in profile.columns.values())
    score.completeness = max(0, 100 - (missing_cells / total_cells * 100))

    if primary_key and primary_key in df.columns:
        dupes = int(df[primary_key].duplicated().sum())
        score.uniqueness = max(0, 100 - (dupes / rows * 100))
    else:
        score.uniqueness = max(0, 100 - (duplicate_count / rows * 100))

    score.validity = max(0, 100 - (business_violations / rows * 100))
    score.consistency = max(85.0, score.completeness - 2)  # baseline from normalization pass
    score.accuracy = max(0, (score.completeness + score.validity) / 2)

    score.overall = round(
        (score.completeness + score.consistency + score.validity + score.accuracy + score.uniqueness) / 5,
        2,
    )
    return score
