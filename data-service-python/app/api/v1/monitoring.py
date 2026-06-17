"""Pipeline monitoring API — Phase 8."""

from fastapi import APIRouter

from app.monitoring.engine import run_monitoring_report
from app.monitoring.models import MonitoringOverview
from app.models.etl_schemas import ApiResponse

router = APIRouter(prefix="/monitoring")

OVERVIEW = MonitoringOverview(
    modules=["pipelines", "executions", "quality", "metrics", "failures", "retries", "lineage", "health"],
)


@router.get("/overview", response_model=ApiResponse)
async def get_monitoring_overview() -> ApiResponse:
    return ApiResponse(success=True, message="Monitoring engine overview", data=OVERVIEW)


@router.get("/pipelines", response_model=ApiResponse)
async def get_pipeline_status() -> ApiResponse:
    report = run_monitoring_report()
    return ApiResponse(success=True, message="Pipeline module status", data=report.pipeline_modules)


@router.get("/executions", response_model=ApiResponse)
async def get_execution_history() -> ApiResponse:
    report = run_monitoring_report()
    return ApiResponse(
        success=True,
        message="Execution history",
        data={"executions": report.executions, "total": len(report.executions)},
    )


@router.get("/quality", response_model=ApiResponse)
async def get_quality_center() -> ApiResponse:
    report = run_monitoring_report()
    return ApiResponse(success=True, message="Data quality center", data=report.quality)


@router.get("/metrics", response_model=ApiResponse)
async def get_pipeline_metrics() -> ApiResponse:
    report = run_monitoring_report()
    return ApiResponse(success=True, message="Pipeline metrics", data=report.metrics)


@router.get("/failures", response_model=ApiResponse)
async def get_failures() -> ApiResponse:
    report = run_monitoring_report()
    return ApiResponse(success=True, message="Failure analysis", data=report.failures)


@router.get("/retries", response_model=ApiResponse)
async def get_retries() -> ApiResponse:
    report = run_monitoring_report()
    return ApiResponse(success=True, message="Retry management", data=report.retries)


@router.get("/lineage", response_model=ApiResponse)
async def get_lineage() -> ApiResponse:
    report = run_monitoring_report()
    return ApiResponse(success=True, message="Platform lineage", data=report.lineage)


@router.get("/health", response_model=ApiResponse)
async def get_service_health() -> ApiResponse:
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
