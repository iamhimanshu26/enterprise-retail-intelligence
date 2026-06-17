"""Statistics Engine API — Sprint 5.1."""

from fastapi import APIRouter

from app.models.etl_schemas import ApiResponse
from app.statistics.business import compute_business_metrics
from app.statistics.descriptive import compute_descriptive_stats
from app.statistics.distribution import compute_distributions
from app.statistics.engine import StatisticsEngine, load_statistics_data, run_sample_statistics
from app.statistics.models import StatisticsOverview
from app.statistics.quality import compute_dataset_health
from app.statistics.regional import compute_regional_stats
from app.statistics.time_series import compute_time_series_stats

router = APIRouter(prefix="/statistics")

OVERVIEW = StatisticsOverview(
    modules=[
        "descriptive", "business", "distribution",
        "time_series", "regional", "health",
    ],
    supported_metrics=[
        "count", "sum", "mean", "median", "mode", "variance", "std",
        "average_order_value", "profit_margin", "return_rate",
        "regional_revenue", "monthly_revenue", "data_quality_index",
    ],
    data_source="sample_or_warehouse",
)


@router.get("/overview", response_model=ApiResponse)
async def get_statistics_overview() -> ApiResponse:
    return ApiResponse(success=True, message="Statistics engine overview", data=OVERVIEW)


def _get_engine() -> StatisticsEngine:
    df, source = load_statistics_data()
    return StatisticsEngine(df=df, data_source=source)


@router.get("/descriptive", response_model=ApiResponse)
async def get_descriptive() -> ApiResponse:
    engine = _get_engine()
    data = compute_descriptive_stats(engine.df)
    return ApiResponse(success=True, message="Descriptive statistics", data=data)


@router.get("/business", response_model=ApiResponse)
async def get_business() -> ApiResponse:
    engine = _get_engine()
    data = compute_business_metrics(engine.df)
    return ApiResponse(success=True, message="Business metrics", data=data)


@router.get("/distribution", response_model=ApiResponse)
async def get_distribution() -> ApiResponse:
    engine = _get_engine()
    data = compute_distributions(engine.df)
    return ApiResponse(success=True, message="Distribution statistics", data=data)


@router.get("/time-series", response_model=ApiResponse)
async def get_time_series() -> ApiResponse:
    engine = _get_engine()
    data = compute_time_series_stats(engine.df)
    return ApiResponse(success=True, message="Time-based statistics", data=data)


@router.get("/regional", response_model=ApiResponse)
async def get_regional() -> ApiResponse:
    engine = _get_engine()
    data = compute_regional_stats(engine.df)
    return ApiResponse(success=True, message="Regional statistics", data=data)


@router.get("/health", response_model=ApiResponse)
async def get_dataset_health() -> ApiResponse:
    engine = _get_engine()
    data = compute_dataset_health(engine.df)
    return ApiResponse(success=True, message="Dataset health statistics", data=data)


@router.post("/run-sample", response_model=ApiResponse)
async def run_sample() -> ApiResponse:
    report = run_sample_statistics()
    return ApiResponse(
        success=True,
        message="Sample statistics report generated",
        data=report.model_dump(),
    )
