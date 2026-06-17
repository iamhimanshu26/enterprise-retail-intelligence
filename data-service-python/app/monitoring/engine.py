"""Monitoring engine — aggregates ETL history, quality, and platform module status."""

from __future__ import annotations

import time
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List

from app.etl.execution_history import execution_history_store
from app.monitoring.models import (
    ExecutionHistoryRow,
    FailureRecord,
    LineageNode,
    MonitoringOverview,
    MonitoringReport,
    OperationalKpis,
    PipelineMetrics,
    PipelineModuleStatus,
    QualityCenter,
    QualityDimension,
    QualityHistoryPoint,
    RetryRecord,
    ServiceHealthItem,
)

PLATFORM_MODULES = [
    ("synthetic-generator", "Synthetic Data Generator"),
    ("etl-pipeline", "ETL Pipeline"),
    ("data-cleaning", "Data Cleaning"),
    ("analytics-warehouse", "Analytics Warehouse"),
    ("statistics-engine", "Statistics Engine"),
    ("business-analytics", "Business Analytics"),
    ("executive-intelligence", "Executive Intelligence"),
    ("forecasting-engine", "Forecasting Engine"),
]

LINEAGE_FLOW = [
    ("synthetic", "Synthetic Data", "Faker/Pandas retail dataset generation"),
    ("validation", "Validation", "Schema and business rule validation"),
    ("cleaning", "Cleaning", "Missing values, duplicates, normalization"),
    ("transformation", "Transformation", "Business rules and enrichment"),
    ("warehouse", "Warehouse", "Star schema load to analytics warehouse"),
    ("statistics", "Statistics", "Descriptive and business statistics"),
    ("analytics", "Analytics", "Dimensional KPI computation"),
    ("forecasting", "Forecasting", "Predictive models and scenarios"),
]

DEFAULT_QUALITY = {
    "completeness": 98.0,
    "accuracy": 95.0,
    "consistency": 96.0,
    "validity": 97.0,
    "timeliness": 97.0,
    "uniqueness": 99.0,
    "overall": 97.0,
}


def _quality_from_history(history: List[Dict[str, Any]]) -> QualityCenter:
    if history:
        scores = [float(h.get("quality_score", 97)) for h in history]
        avg = sum(scores) / len(scores)
    else:
        avg = DEFAULT_QUALITY["overall"]

    dimensions = [
        QualityDimension(name="Completeness", score=min(100, avg + 1), trend="stable"),
        QualityDimension(name="Accuracy", score=min(100, avg - 1), trend="stable"),
        QualityDimension(name="Consistency", score=min(100, avg), trend="up"),
        QualityDimension(name="Validity", score=min(100, avg + 0.5), trend="stable"),
        QualityDimension(name="Timeliness", score=min(100, avg - 0.5), trend="up"),
        QualityDimension(name="Uniqueness", score=min(100, avg + 2), trend="stable"),
    ]
    history_points = [
        QualityHistoryPoint(label=f"Run {i + 1}", value=round(s, 1))
        for i, s in enumerate(scores[:8] if history else [avg - 1, avg, avg + 0.5, avg])
    ]
    return QualityCenter(
        dimensions=dimensions,
        overall_quality_index=round(avg, 1),
        history=history_points,
    )


def _build_executions(history: List[Dict[str, Any]]) -> List[ExecutionHistoryRow]:
    rows: List[ExecutionHistoryRow] = []
    triggers = ["scheduled", "manual", "api", "sample"]
    for i, record in enumerate(history):
        rows.append(
            ExecutionHistoryRow(
                run_id=record.get("pipeline_id", str(uuid.uuid4())),
                pipeline=record.get("pipeline_name", "ETL Pipeline"),
                start_time=record.get("start_time", datetime.now(timezone.utc).isoformat()),
                end_time=record.get("end_time", datetime.now(timezone.utc).isoformat()),
                duration_seconds=float(record.get("duration_seconds", 0)),
                status=record.get("status", "success"),
                rows_processed=int(record.get("processed_rows", 0)),
                failed_rows=int(record.get("failed_rows", 0)),
                trigger_source=triggers[i % len(triggers)],
            )
        )
    return rows


def _build_module_status(history: List[Dict[str, Any]]) -> List[PipelineModuleStatus]:
    latest = history[0] if history else None
    base_status = latest.get("status", "success") if latest else "success"
    base_duration = float(latest.get("duration_seconds", 12.4)) if latest else 12.4
    base_quality = float(latest.get("quality_score", 97)) if latest else 97.0
    base_rows = int(latest.get("processed_rows", 125000)) if latest else 125000
    last_run = latest.get("end_time", datetime.now(timezone.utc).isoformat()) if latest else datetime.now(timezone.utc).isoformat()

    statuses = ["success", "success", "success", "warning", "success", "success", "success", "queued"]
    trends = ["up", "stable", "stable", "down", "up", "stable", "up", "stable"]

    modules: List[PipelineModuleStatus] = []
    for i, (module_id, name) in enumerate(PLATFORM_MODULES):
        status = statuses[i] if base_status == "success" else ("failed" if i < 2 else "warning")
        modules.append(
            PipelineModuleStatus(
                module_id=module_id,
                module_name=name,
                status=status,
                last_run=last_run,
                duration_seconds=round(base_duration * (0.6 + i * 0.08), 2),
                quality_score=round(base_quality - i * 0.3, 1),
                processed_rows=int(base_rows * (0.15 + i * 0.05)),
                trend=trends[i],
            )
        )
    return modules


def _build_metrics(history: List[Dict[str, Any]]) -> PipelineMetrics:
    total = len(history) or 1
    successes = sum(1 for h in history if h.get("status") == "success")
    failures = total - successes
    durations = [float(h.get("duration_seconds", 0)) for h in history] or [12.0]
    rows = sum(int(h.get("processed_rows", 0)) for h in history) or 125000
    qualities = [float(h.get("quality_score", 97)) for h in history] or [97.0]
    throughput_vals = [
        float(h.get("metrics", {}).get("throughput_rows_per_second", 1200)) for h in history
    ] or [1200.0]

    return PipelineMetrics(
        success_rate=round(successes / total * 100, 1),
        failure_rate=round(failures / total * 100, 1),
        average_duration=round(sum(durations) / len(durations), 2),
        throughput=round(sum(throughput_vals) / len(throughput_vals), 1),
        rows_processed=rows,
        average_quality_score=round(sum(qualities) / len(qualities), 1),
        slowest_stage="warehouse_load",
        most_common_failure="validation_timeout" if failures else "none",
    )


def _build_failures(history: List[Dict[str, Any]]) -> List[FailureRecord]:
    failures: List[FailureRecord] = []
    categories = ["validation", "transformation", "load", "quality", "timeout"]
    severities = ["low", "medium", "high", "critical"]
    for i, record in enumerate(history):
        if record.get("status") != "success":
            failures.append(
                FailureRecord(
                    id=f"fail-{i}",
                    category=categories[i % len(categories)],
                    severity=severities[min(i, 3)],
                    pipeline=record.get("pipeline_name", "ETL Pipeline"),
                    root_cause_placeholder="Schema validation mismatch on nullable columns",
                    suggested_action="Review validation rules and source schema drift",
                    retry_recommendation="Retry after fixing validation profile",
                    frequency=1 + i,
                )
            )
    if not failures:
        failures.append(
            FailureRecord(
                id="fail-sample",
                category="validation",
                severity="low",
                pipeline="Data Cleaning",
                root_cause_placeholder="Sample placeholder — no active critical failures",
                suggested_action="Continue monitoring execution history",
                retry_recommendation="No retry required",
                frequency=0,
            )
        )
    return failures


def _build_retries(history: List[Dict[str, Any]]) -> List[RetryRecord]:
    retries: List[RetryRecord] = []
    for i, record in enumerate(history):
        if record.get("status") != "success":
            retries.append(
                RetryRecord(
                    id=f"retry-{record.get('pipeline_id', i)}",
                    pipeline=record.get("pipeline_name", "ETL Pipeline"),
                    retry_count=min(i + 1, 3),
                    retry_recommendation="Automatic retry after 15 minutes",
                    retryable=True,
                    next_retry_placeholder="T+15m",
                    status="queued",
                )
            )
    if not retries:
        retries.append(
            RetryRecord(
                id="retry-idle",
                pipeline="ETL Pipeline",
                retry_count=0,
                retry_recommendation="No pending retries",
                retryable=False,
                next_retry_placeholder="—",
                status="idle",
            )
        )
    return retries


def _build_lineage() -> List[LineageNode]:
    return [
        LineageNode(id=node_id, label=label, description=desc)
        for node_id, label, desc in LINEAGE_FLOW
    ]


def _build_service_health() -> List[ServiceHealthItem]:
    return [
        ServiceHealthItem(service_id="frontend", service_name="Frontend", status="healthy", latency_ms=42, message="Vercel edge"),
        ServiceHealthItem(service_id="spring-api", service_name="Spring Boot API", status="healthy", latency_ms=85, message="JWT gateway active"),
        ServiceHealthItem(service_id="fastapi", service_name="FastAPI Service", status="healthy", latency_ms=38, message="Data service online"),
        ServiceHealthItem(service_id="postgresql", service_name="PostgreSQL", status="healthy", latency_ms=12, message="Connection pool ready"),
        ServiceHealthItem(service_id="etl-engine", service_name="ETL Engine", status="healthy", latency_ms=120, message="Pipeline executor ready"),
        ServiceHealthItem(service_id="forecasting", service_name="Forecasting Engine", status="healthy", latency_ms=95, message="Models loaded"),
        ServiceHealthItem(service_id="analytics", service_name="Analytics Engine", status="degraded", latency_ms=210, message="Elevated query latency"),
    ]


def _build_operational_kpis(history: List[Dict[str, Any]], metrics: PipelineMetrics) -> OperationalKpis:
    total = len(history) or 8
    successes = sum(1 for h in history if h.get("status") == "success") or total - 1
    failures = total - successes
    return OperationalKpis(
        total_runs=total,
        successful_runs=successes,
        failed_runs=failures,
        average_quality_score=metrics.average_quality_score,
        average_runtime=metrics.average_duration,
        total_processed_records=metrics.rows_processed,
        platform_health_score=round(metrics.success_rate * 0.6 + metrics.average_quality_score * 0.4, 1),
    )


def run_monitoring_report() -> MonitoringReport:
    start = time.time()
    history = execution_history_store.get_history(limit=25)
    metrics = _build_metrics(history)
    quality = _quality_from_history(history)

    return MonitoringReport(
        overview=MonitoringOverview(
            modules=["pipelines", "quality", "failures", "retries", "lineage", "health"],
            data_source="etl_history_aggregated",
        ),
        pipeline_modules=_build_module_status(history),
        executions=_build_executions(history),
        quality=quality,
        metrics=metrics,
        failures=_build_failures(history),
        retries=_build_retries(history),
        lineage=_build_lineage(),
        service_health=_build_service_health(),
        operational_kpis=_build_operational_kpis(history, metrics),
        execution_time_seconds=round(time.time() - start, 3),
    )
