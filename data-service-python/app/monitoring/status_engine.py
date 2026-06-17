"""Pipeline status engine — current health and execution snapshots per pipeline."""

from __future__ import annotations

from typing import List

from app.monitoring.execution_tracker import execution_tracker
from app.monitoring.models import PipelineModuleStatus, PipelineStatusSnapshot
from app.monitoring.pipeline_registry import pipeline_registry

MODULE_STATUSES = ["success", "success", "success", "warning", "success", "success", "success", "queued"]
MODULE_TRENDS = ["up", "stable", "stable", "down", "up", "stable", "up", "stable"]


def _health_from_status(status: str) -> str:
    mapping = {
        "success": "healthy",
        "warning": "warning",
        "failed": "critical",
        "queued": "degraded",
        "running": "healthy",
        "cancelled": "warning",
    }
    return mapping.get(status, "healthy")


def _stage_for_pipeline(pipeline_id: str, status: str) -> str:
    if status == "queued":
        return "queued"
    if status == "running":
        return "executing"
    stages = {
        "synthetic-generator": "generation",
        "etl-pipeline": "orchestration",
        "data-cleaning": "cleaning",
        "analytics-warehouse": "warehouse_load",
        "statistics-engine": "statistics",
        "business-analytics": "analytics",
        "executive-intelligence": "intelligence",
        "forecasting-engine": "forecasting",
    }
    return stages.get(pipeline_id, "idle")


class StatusEngine:
    def build_status_snapshots(self) -> List[PipelineStatusSnapshot]:
        snapshots: List[PipelineStatusSnapshot] = []
        for definition in pipeline_registry.list_pipelines():
            pipeline_executions = execution_tracker.get_by_pipeline(definition.pipeline_id)
            latest = pipeline_executions[0] if pipeline_executions else None
            last_success = next(
                (e for e in pipeline_executions if e.status in ("success", "warning")),
                None,
            )
            current_status = latest.status if latest else definition.current_status
            snapshots.append(
                PipelineStatusSnapshot(
                    pipeline_id=definition.pipeline_id,
                    name=definition.name,
                    current_status=current_status,
                    last_execution=latest.end_time if latest else None,
                    last_successful_execution=last_success.end_time if last_success else None,
                    current_stage=_stage_for_pipeline(definition.pipeline_id, current_status),
                    execution_duration_seconds=latest.duration_seconds if latest else 0.0,
                    health_indicator=_health_from_status(current_status),
                )
            )
        return snapshots

    def build_module_status_board(self) -> List[PipelineModuleStatus]:
        snapshots = self.build_status_snapshots()
        modules: List[PipelineModuleStatus] = []
        for i, snapshot in enumerate(snapshots):
            latest_executions = execution_tracker.get_by_pipeline(snapshot.pipeline_id, limit=1)
            latest = latest_executions[0] if latest_executions else None
            modules.append(
                PipelineModuleStatus(
                    module_id=snapshot.pipeline_id,
                    module_name=snapshot.name,
                    status=snapshot.current_status if snapshot.current_status != "success" else MODULE_STATUSES[i],
                    last_run=snapshot.last_execution or "",
                    duration_seconds=snapshot.execution_duration_seconds or (8.0 + i * 1.2),
                    quality_score=latest.quality_score if latest else 97.0 - i * 0.3,
                    processed_rows=latest.records_processed if latest else 125000 - i * 8000,
                    trend=MODULE_TRENDS[i],
                )
            )
        return modules


status_engine = StatusEngine()
