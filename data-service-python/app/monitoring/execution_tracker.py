"""Execution tracker — unified view of pipeline runs across the platform."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

from app.etl.execution_history import execution_history_store
from app.monitoring.models import TrackedExecution
from app.monitoring.pipeline_registry import pipeline_registry

TRIGGER_SOURCES = ("scheduled", "manual", "api", "sample", "orchestrator")
EXECUTION_STATUSES = ("queued", "running", "success", "warning", "failed", "cancelled")

PIPELINE_ID_BY_NAME = {
    "Synthetic Data Generator": "synthetic-generator",
    "ETL Pipeline": "etl-pipeline",
    "Data Cleaning": "data-cleaning",
    "Data Cleaning Engine": "data-cleaning",
    "Analytics Warehouse": "analytics-warehouse",
    "Statistics Engine": "statistics-engine",
    "Business Analytics": "business-analytics",
    "Business Analytics Engine": "business-analytics",
    "Executive Intelligence": "executive-intelligence",
    "Executive Intelligence Engine": "executive-intelligence",
    "Forecasting Engine": "forecasting-engine",
}


def _resolve_pipeline_id(pipeline_name: str, entity: str = "") -> str:
    if pipeline_name in PIPELINE_ID_BY_NAME:
        return PIPELINE_ID_BY_NAME[pipeline_name]
    for definition in pipeline_registry.list_pipelines():
        if definition.name == pipeline_name:
            return definition.pipeline_id
    slug = pipeline_name.lower().replace(" ", "-")
    if entity:
        return f"{slug}-{entity}"
    return slug


def _map_etl_status(status: str, failed_rows: int) -> str:
    if status == "failed":
        return "failed"
    if failed_rows > 0:
        return "warning"
    return "success"


def _etl_record_to_execution(record: Dict[str, Any], index: int) -> TrackedExecution:
    pipeline_name = record.get("pipeline_name", "ETL Pipeline")
    pipeline_id = _resolve_pipeline_id(pipeline_name, record.get("entity", ""))
    failed_rows = int(record.get("failed_rows", 0))
    status = _map_etl_status(record.get("status", "success"), failed_rows)
    return TrackedExecution(
        execution_id=record.get("pipeline_id", str(uuid.uuid4())),
        pipeline_id=pipeline_id,
        pipeline_name=pipeline_name,
        start_time=record.get("start_time", datetime.now(timezone.utc).isoformat()),
        end_time=record.get("end_time", datetime.now(timezone.utc).isoformat()),
        duration_seconds=float(record.get("duration_seconds", 0)),
        trigger_source=TRIGGER_SOURCES[index % len(TRIGGER_SOURCES)],
        status=status,
        records_processed=int(record.get("processed_rows", 0)),
        records_failed=failed_rows,
        quality_score=float(record.get("quality_score", 97.0)),
        execution_notes=record.get("entity", "") or "ETL execution recorded",
    )


def _sample_executions() -> List[TrackedExecution]:
    now = datetime.now(timezone.utc)
    samples: List[TrackedExecution] = []
    pipelines = pipeline_registry.list_pipelines()
    statuses = ["success", "success", "success", "warning", "success", "success", "success", "queued"]
    for i, definition in enumerate(pipelines):
        start = now.replace(microsecond=0)
        duration = 8.0 + i * 1.5
        samples.append(
            TrackedExecution(
                execution_id=f"sample-exec-{definition.pipeline_id}",
                pipeline_id=definition.pipeline_id,
                pipeline_name=definition.name,
                start_time=start.isoformat(),
                end_time=start.isoformat(),
                duration_seconds=duration,
                trigger_source=TRIGGER_SOURCES[i % len(TRIGGER_SOURCES)],
                status=statuses[i],
                records_processed=125000 - i * 8000,
                records_failed=0 if statuses[i] != "warning" else 42,
                quality_score=97.0 - i * 0.4,
                execution_notes="Sample execution for monitoring dashboard",
            )
        )
    return samples


class ExecutionTracker:
    """Aggregates ETL execution history into platform-wide execution records."""

    def get_executions(self, limit: int = 25) -> List[TrackedExecution]:
        etl_history = execution_history_store.get_history(limit=limit)
        if etl_history:
            return [_etl_record_to_execution(record, i) for i, record in enumerate(etl_history)]
        return _sample_executions()[:limit]

    def get_by_pipeline(self, pipeline_id: str, limit: int = 10) -> List[TrackedExecution]:
        return [e for e in self.get_executions(limit=50) if e.pipeline_id == pipeline_id][:limit]

    def get_by_id(self, execution_id: str) -> Optional[TrackedExecution]:
        for execution in self.get_executions(limit=100):
            if execution.execution_id == execution_id:
                return execution
        return None

    def count(self) -> int:
        etl_count = execution_history_store.count()
        return etl_count if etl_count else len(pipeline_registry.list_pipelines())


execution_tracker = ExecutionTracker()
