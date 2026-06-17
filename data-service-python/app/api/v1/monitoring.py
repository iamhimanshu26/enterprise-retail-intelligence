"""Pipeline monitoring API — Phase 8.1."""

from fastapi import APIRouter

from app.monitoring.engine import run_monitoring_report
from app.monitoring.execution_tracker import execution_tracker
from app.monitoring.failure_engine import failure_engine
from app.monitoring.lineage_monitor import lineage_monitor
from app.monitoring.metrics_engine import metrics_engine
from app.monitoring.models import MonitoringOverview
from app.monitoring.quality_monitor import quality_monitor
from app.monitoring.retry_engine import retry_engine
from app.monitoring.service_health import service_health_engine
from app.monitoring.status_engine import status_engine
from app.models.etl_schemas import ApiResponse

router = APIRouter(prefix="/monitoring")

OVERVIEW = MonitoringOverview(
    modules=[
        "registry",
        "pipelines",
        "executions",
        "status",
        "quality",
        "metrics",
        "failures",
        "retries",
        "lineage",
        "service_health",
    ],
)


@router.get("/overview", response_model=ApiResponse)
async def get_monitoring_overview() -> ApiResponse:
    return ApiResponse(success=True, message="Monitoring engine overview", data=OVERVIEW)


@router.get("/pipelines", response_model=ApiResponse)
async def get_pipeline_registry() -> ApiResponse:
    report = run_monitoring_report()
    return ApiResponse(
        success=True,
        message="Pipeline registry and module status",
        data={
            "registry": report.pipeline_registry,
            "modules": report.pipeline_modules,
        },
    )


@router.get("/executions", response_model=ApiResponse)
async def get_execution_history() -> ApiResponse:
    tracked = execution_tracker.get_executions()
    return ApiResponse(
        success=True,
        message="Execution history",
        data={
            "executions": tracked,
            "history_rows": [e.model_dump() for e in run_monitoring_report().executions],
            "total": execution_tracker.count(),
        },
    )


@router.get("/status", response_model=ApiResponse)
async def get_pipeline_status() -> ApiResponse:
    return ApiResponse(
        success=True,
        message="Pipeline status snapshots",
        data=status_engine.build_status_snapshots(),
    )


@router.get("/quality", response_model=ApiResponse)
async def get_quality_center() -> ApiResponse:
    return ApiResponse(success=True, message="Data quality center", data=quality_monitor.build_quality_summary())


@router.get("/metrics", response_model=ApiResponse)
async def get_pipeline_metrics() -> ApiResponse:
    return ApiResponse(success=True, message="Pipeline metrics", data=metrics_engine.build_metrics())


@router.get("/failures", response_model=ApiResponse)
async def get_failures() -> ApiResponse:
    return ApiResponse(success=True, message="Failure analysis", data=failure_engine.build_failures())


@router.get("/retries", response_model=ApiResponse)
async def get_retries() -> ApiResponse:
    report = run_monitoring_report()
    return ApiResponse(
        success=True,
        message="Retry management",
        data={
            "queue": report.retries,
            "history": retry_engine.retry_history(),
        },
    )


@router.get("/service-health", response_model=ApiResponse)
async def get_service_health() -> ApiResponse:
    cards = service_health_engine.build_health_cards()
    return ApiResponse(
        success=True,
        message="Service health",
        data={
            "services": cards,
            "platform_health_score": service_health_engine.platform_health_score(cards),
        },
    )


@router.get("/lineage", response_model=ApiResponse)
async def get_lineage() -> ApiResponse:
    graph = lineage_monitor.build_platform_lineage()
    return ApiResponse(
        success=True,
        message="Platform lineage",
        data={
            "nodes": graph.nodes,
            "edges": graph.edges,
            "flow": graph.flow,
            "etl_sample": lineage_monitor.build_etl_lineage_sample().model_dump(),
        },
    )


@router.get("/health", response_model=ApiResponse)
async def get_service_health_legacy() -> ApiResponse:
    """Legacy alias — Operations Center UI uses service_health from run-sample."""
    report = run_monitoring_report()
    return ApiResponse(success=True, message="Service health", data=report.service_health)


@router.post("/run-sample", response_model=ApiResponse)
async def run_sample() -> ApiResponse:
    report = run_monitoring_report()
    return ApiResponse(
        success=True,
        message="Unified monitoring report generated",
        data=report.model_dump(),
    )
