"""Executive Intelligence API — Sprint 5.3."""

from fastapi import APIRouter

from app.analytics.data import load_analytics_data
from app.analytics.engine import BusinessAnalyticsEngine
from app.intelligence.anomaly_detector import detect_anomalies
from app.intelligence.benchmark import compute_benchmarks
from app.intelligence.executive_engine import ExecutiveIntelligenceEngine, run_sample_intelligence
from app.intelligence.executive_summary import generate_executive_summary
from app.intelligence.kpi_monitor import generate_kpi_intelligence
from app.intelligence.models import IntelligenceOverview
from app.intelligence.recommendation_engine import generate_recommendations
from app.intelligence.scorecard import build_executive_scorecard
from app.intelligence.trend_analyzer import analyze_trends
from app.models.etl_schemas import ApiResponse

router = APIRouter(prefix="/intelligence")

OVERVIEW = IntelligenceOverview(
    modules=[
        "executive_summary",
        "kpi_monitor",
        "trend_analyzer",
        "benchmark",
        "anomaly_detector",
        "recommendation_engine",
        "scorecard",
    ],
)


def _engine() -> ExecutiveIntelligenceEngine:
    df, source = load_analytics_data()
    return ExecutiveIntelligenceEngine(df=df, data_source=source)


@router.get("/overview", response_model=ApiResponse)
async def get_intelligence_overview() -> ApiResponse:
    return ApiResponse(success=True, message="Executive intelligence overview", data=OVERVIEW)


@router.get("/executive-summary", response_model=ApiResponse)
async def get_executive_summary() -> ApiResponse:
    eng = _engine()
    return ApiResponse(
        success=True,
        message="Executive summary",
        data=generate_executive_summary(eng.analytics_report),
    )


@router.get("/kpis", response_model=ApiResponse)
async def get_kpi_intelligence() -> ApiResponse:
    eng = _engine()
    return ApiResponse(
        success=True,
        message="KPI intelligence",
        data=generate_kpi_intelligence(eng.analytics_report),
    )


@router.get("/trends", response_model=ApiResponse)
async def get_trends() -> ApiResponse:
    eng = _engine()
    return ApiResponse(success=True, message="Trend analysis", data=analyze_trends(eng.analytics_report))


@router.get("/anomalies", response_model=ApiResponse)
async def get_anomalies() -> ApiResponse:
    eng = _engine()
    return ApiResponse(
        success=True,
        message="Anomaly detection",
        data=detect_anomalies(eng.df, eng.analytics_report),
    )


@router.get("/benchmarks", response_model=ApiResponse)
async def get_benchmarks() -> ApiResponse:
    eng = _engine()
    return ApiResponse(success=True, message="Business benchmarks", data=compute_benchmarks(eng.analytics_report))


@router.get("/recommendations", response_model=ApiResponse)
async def get_recommendations() -> ApiResponse:
    eng = _engine()
    anomalies = detect_anomalies(eng.df, eng.analytics_report)
    return ApiResponse(
        success=True,
        message="Business recommendations",
        data=generate_recommendations(eng.analytics_report, anomalies),
    )


@router.get("/scorecard", response_model=ApiResponse)
async def get_scorecard() -> ApiResponse:
    eng = _engine()
    scorecard, health = build_executive_scorecard(eng.analytics_report)
    return ApiResponse(
        success=True,
        message="Executive scorecard",
        data={"scorecard": scorecard, "business_health": health},
    )


@router.post("/run-sample", response_model=ApiResponse)
async def run_sample() -> ApiResponse:
    report = run_sample_intelligence()
    return ApiResponse(
        success=True,
        message="Executive intelligence report generated",
        data=report.model_dump(),
    )
