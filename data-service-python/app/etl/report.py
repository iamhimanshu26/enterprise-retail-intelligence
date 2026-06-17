"""ETL execution report generation."""

import time
from typing import Any, Dict, Optional

from pydantic import BaseModel, Field


class EtlExecutionReport(BaseModel):
    pipeline_name: str
    entity: str
    success: bool = True
    rows_processed: int = 0
    duplicates_removed: int = 0
    invalid_rows: int = 0
    null_values_fixed: int = 0
    execution_time_seconds: float = 0.0
    success_rate: float = 100.0
    quality_score: float = 100.0
    stage_reports: Dict[str, Any] = Field(default_factory=dict)
    aggregations: Dict[str, int] = Field(default_factory=dict)
    load_results: list = Field(default_factory=list)
    errors: list = Field(default_factory=list)


class ReportBuilder:
    def __init__(self, pipeline_name: str, entity: str) -> None:
        self.pipeline_name = pipeline_name
        self.entity = entity
        self.start_time = time.time()
        self.stage_reports: Dict[str, Any] = {}
        self.errors: list = []
        self.rows_processed = 0
        self.duplicates_removed = 0
        self.invalid_rows = 0
        self.null_values_fixed = 0
        self.aggregations: Dict[str, int] = {}
        self.load_results: list = []

    def add_stage(self, stage: str, report: Any) -> None:
        if hasattr(report, "to_dict"):
            self.stage_reports[stage] = report.to_dict()
        elif isinstance(report, dict):
            self.stage_reports[stage] = report

    def add_error(self, stage: str, message: str) -> None:
        self.errors.append({"stage": stage, "message": message})

    def finalize(self, success: bool = True) -> EtlExecutionReport:
        elapsed = round(time.time() - self.start_time, 3)
        clean = self.stage_reports.get("clean", {})
        validate = self.stage_reports.get("validate", {})

        self.duplicates_removed = clean.get("duplicates_removed", 0)
        self.invalid_rows = validate.get("stats", {}).get("invalid_values", 0)
        self.null_values_fixed = clean.get("nulls_marked", 0)

        total_issues = self.duplicates_removed + self.invalid_rows
        rows = max(self.rows_processed, 1)
        success_rate = round(max(0, 100 - (total_issues / rows * 100)), 2)
        quality_score = round(max(0, 100 - (total_issues / rows * 50)), 2)

        return EtlExecutionReport(
            pipeline_name=self.pipeline_name,
            entity=self.entity,
            success=success and not self.errors,
            rows_processed=self.rows_processed,
            duplicates_removed=self.duplicates_removed,
            invalid_rows=self.invalid_rows,
            null_values_fixed=self.null_values_fixed,
            execution_time_seconds=elapsed,
            success_rate=success_rate,
            quality_score=quality_score,
            stage_reports=self.stage_reports,
            aggregations=self.aggregations,
            load_results=self.load_results,
            errors=self.errors,
        )
