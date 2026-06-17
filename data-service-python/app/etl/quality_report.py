"""Structured quality report for ETL executions."""

from __future__ import annotations

from typing import Any, Dict

from app.etl.audit_log import AuditLog
from app.etl.quality_score import QualityScore


def build_quality_report(
    rows_processed: int,
    rows_output: int,
    duplicates_removed: int,
    missing_fixed: int,
    invalid_records: int,
    transformations_applied: int,
    quality: QualityScore,
    execution_time: float,
    audit: AuditLog,
    stage_reports: Dict[str, Any],
) -> Dict[str, Any]:
    return {
        "rows_processed": rows_processed,
        "rows_cleaned": rows_output,
        "duplicates_removed": duplicates_removed,
        "missing_values_fixed": missing_fixed,
        "invalid_records": invalid_records,
        "transformations_applied": transformations_applied,
        "quality_score": quality.to_dict(),
        "execution_time_seconds": round(execution_time, 3),
        "success_rate": round(rows_output / max(rows_processed, 1) * 100, 2),
        "audit_log": audit.to_dict(),
        "stage_reports": stage_reports,
    }
