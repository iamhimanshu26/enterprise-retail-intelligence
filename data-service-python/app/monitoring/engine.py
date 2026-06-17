"""Monitoring orchestrator — unified enterprise monitoring report."""

from __future__ import annotations

import time

from app.monitoring.execution_tracker import execution_tracker
from app.monitoring.failure_engine import failure_engine
from app.monitoring.lineage_monitor import lineage_monitor
from app.monitoring.metrics_engine import metrics_engine
from app.monitoring.models import (
    ExecutionHistoryRow,
    MonitoringOverview,
    MonitoringReport,
    OperationalKpis,
)
from app.monitoring.pipeline_registry import pipeline_registry
from app.monitoring.quality_monitor import quality_monitor
from app.monitoring.retry_engine import retry_engine
from app.monitoring.service_health import service_health_engine
from app.monitoring.status_engine import status_engine


def _to_history_rows() -> list[ExecutionHistoryRow]:
    return [
        ExecutionHistoryRow(
            run_id=e.execution_id,
            pipeline=e.pipeline_name,
            start_time=e.start_time,
            end_time=e.end_time,
            duration_seconds=e.duration_seconds,
            status=e.status,
            rows_processed=e.records_processed,
            failed_rows=e.records_failed,
            trigger_source=e.trigger_source,
        )
        for e in execution_tracker.get_executions()
    ]


def _build_operational_kpis(metrics: object, health_score: float) -> OperationalKpis:
    return OperationalKpis(
        total_runs=metrics.total_executions,
        successful_runs=metrics.successful_executions,
        failed_runs=metrics.failed_executions,
        average_quality_score=metrics.average_quality_score,
        average_runtime=metrics.average_duration,
        total_processed_records=metrics.rows_processed,
        platform_health_score=round(
            metrics.success_rate * 0.4 + metrics.average_quality_score * 0.3 + health_score * 0.3,
            1,
        ),
    )


def run_monitoring_report() -> MonitoringReport:
    """Master orchestrator — aggregates all monitoring subsystems."""
    start = time.time()
    metrics = metrics_engine.build_metrics()
    quality = quality_monitor.build_quality_summary()
    service_health = service_health_engine.build_health_cards()
    health_score = service_health_engine.platform_health_score(service_health)
    lineage_graph = lineage_monitor.build_platform_lineage()

    return MonitoringReport(
        overview=MonitoringOverview(
            sprint="8.1",
            status="monitoring_backend_ready",
            modules=[
                "registry",
                "executions",
                "status",
                "quality",
                "metrics",
                "failures",
                "retries",
                "lineage",
                "service_health",
            ],
            data_source="etl_history_aggregated",
        ),
        pipeline_registry=pipeline_registry.list_pipelines(),
        pipeline_modules=status_engine.build_module_status_board(),
        pipeline_status=status_engine.build_status_snapshots(),
        executions=_to_history_rows(),
        tracked_executions=execution_tracker.get_executions(),
        quality=quality,
        metrics=metrics,
        failures=failure_engine.build_failures(),
        retries=retry_engine.build_retries(),
        lineage=lineage_graph.nodes,
        lineage_graph=lineage_graph,
        service_health=service_health,
        operational_kpis=_build_operational_kpis(metrics, health_score),
        execution_time_seconds=round(time.time() - start, 3),
    )
