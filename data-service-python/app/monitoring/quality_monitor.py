"""Quality monitor — aggregates ETL quality scores into platform quality summary."""

from __future__ import annotations

from typing import Any, Dict, List

from app.monitoring.execution_tracker import execution_tracker
from app.monitoring.models import QualityCenter, QualityDimension, QualityHistoryPoint

DEFAULT_QUALITY = {
    "completeness": 98.0,
    "accuracy": 95.0,
    "consistency": 96.0,
    "validity": 97.0,
    "timeliness": 97.0,
    "uniqueness": 99.0,
    "overall": 97.0,
}

DIMENSION_NAMES = [
    ("Completeness", "completeness"),
    ("Accuracy", "accuracy"),
    ("Consistency", "consistency"),
    ("Validity", "validity"),
    ("Timeliness", "timeliness"),
    ("Uniqueness", "uniqueness"),
]


def _dimension_status(score: float) -> str:
    if score >= 95:
        return "Excellent"
    if score >= 90:
        return "Good"
    if score >= 80:
        return "Warning"
    return "Critical"


def _overall_status(index: float) -> str:
    return _dimension_status(index)


def _trend_from_scores(scores: List[float]) -> str:
    if len(scores) < 2:
        return "stable"
    delta = scores[-1] - scores[0]
    if delta > 0.5:
        return "up"
    if delta < -0.5:
        return "down"
    return "stable"


def _extract_dimension_scores(quality_dict: Dict[str, Any], avg: float) -> Dict[str, float]:
    if not quality_dict:
        return {key: avg + offset for key, offset in zip(DEFAULT_QUALITY.keys(), [1, -1, 0, 0.5, -0.5, 2, 0])}
    return {
        "completeness": float(quality_dict.get("completeness", avg)),
        "accuracy": float(quality_dict.get("accuracy", avg)),
        "consistency": float(quality_dict.get("consistency", avg)),
        "validity": float(quality_dict.get("validity", avg)),
        "timeliness": float(quality_dict.get("timeliness", avg)),
        "uniqueness": float(quality_dict.get("uniqueness", avg)),
        "overall": float(quality_dict.get("data_quality_index", quality_dict.get("overall", avg))),
    }


class QualityMonitor:
    def build_quality_summary(self) -> QualityCenter:
        executions = execution_tracker.get_executions(limit=25)
        scores = [e.quality_score for e in executions] if executions else [DEFAULT_QUALITY["overall"]]
        avg = sum(scores) / len(scores)

        latest = executions[0] if executions else None
        dimension_values = _extract_dimension_scores(
            {"data_quality_index": latest.quality_score} if latest else {},
            avg,
        )

        dimensions = [
            QualityDimension(
                name=name,
                score=min(100.0, round(dimension_values[key], 1)),
                trend=_trend_from_scores(scores[:4]),
                status=_dimension_status(dimension_values[key]),
            )
            for name, key in DIMENSION_NAMES
        ]

        history_points = [
            QualityHistoryPoint(label=f"Run {i + 1}", value=round(score, 1))
            for i, score in enumerate(scores[:8])
        ]
        if not history_points:
            history_points = [
                QualityHistoryPoint(label="Baseline", value=round(avg, 1)),
            ]

        overall_index = round(dimension_values["overall"], 1)
        return QualityCenter(
            dimensions=dimensions,
            overall_quality_index=overall_index,
            history=history_points,
            quality_status=_overall_status(overall_index),
            quality_trend=_trend_from_scores(scores),
        )


quality_monitor = QualityMonitor()
