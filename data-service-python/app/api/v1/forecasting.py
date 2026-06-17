"""Forecasting API — Phase 7."""

from fastapi import APIRouter

from app.forecasting.accuracy import compute_accuracy_report
from app.forecasting.demand_forecast import compute_demand_forecast
from app.forecasting.engine import ForecastingEngine, load_forecasting_data, run_sample_forecasting
from app.forecasting.features import aggregate_time_series
from app.forecasting.inventory_forecast import compute_inventory_forecast
from app.forecasting.models import ForecastingOverview
from app.forecasting.revenue_forecast import compute_revenue_forecast
from app.forecasting.sales_forecast import compute_sales_forecast
from app.forecasting.scenarios import build_scenario_outputs
from app.forecasting.store_forecast import compute_store_forecast
from app.models.etl_schemas import ApiResponse

router = APIRouter(prefix="/forecasting")

OVERVIEW = ForecastingOverview(
    modules=["sales", "revenue", "demand", "inventory", "stores", "accuracy", "scenarios"],
)


def _engine() -> ForecastingEngine:
    df, source = load_forecasting_data()
    return ForecastingEngine(df=df, data_source=source)


@router.get("/overview", response_model=ApiResponse)
async def get_forecasting_overview() -> ApiResponse:
    return ApiResponse(success=True, message="Forecasting engine overview", data=OVERVIEW)


@router.get("/sales", response_model=ApiResponse)
async def get_sales_forecast() -> ApiResponse:
    eng = _engine()
    return ApiResponse(success=True, message="Sales forecast", data=compute_sales_forecast(eng.df))


@router.get("/revenue", response_model=ApiResponse)
async def get_revenue_forecast() -> ApiResponse:
    eng = _engine()
    return ApiResponse(success=True, message="Revenue forecast", data=compute_revenue_forecast(eng.df))


@router.get("/demand", response_model=ApiResponse)
async def get_demand_forecast() -> ApiResponse:
    eng = _engine()
    return ApiResponse(success=True, message="Demand forecast", data=compute_demand_forecast(eng.df))


@router.get("/inventory", response_model=ApiResponse)
async def get_inventory_forecast() -> ApiResponse:
    eng = _engine()
    return ApiResponse(success=True, message="Inventory forecast", data=compute_inventory_forecast(eng.df))


@router.get("/stores", response_model=ApiResponse)
async def get_store_forecast() -> ApiResponse:
    eng = _engine()
    return ApiResponse(success=True, message="Store performance forecast", data=compute_store_forecast(eng.df))


@router.get("/accuracy", response_model=ApiResponse)
async def get_accuracy_report() -> ApiResponse:
    eng = _engine()
    daily = aggregate_time_series(eng.df, "revenue", "D")
    report = compute_accuracy_report(daily.values)
    return ApiResponse(success=True, message="Forecast accuracy report", data=report)


@router.get("/scenarios", response_model=ApiResponse)
async def get_scenarios() -> ApiResponse:
    eng = _engine()
    revenue = compute_revenue_forecast(eng.df)
    base = float(revenue.monthly.points[0].predicted_value) if revenue.monthly.points else 0.0
    return ApiResponse(success=True, message="Scenario outputs", data=build_scenario_outputs(base))


@router.post("/run-sample", response_model=ApiResponse)
async def run_sample() -> ApiResponse:
    report = run_sample_forecasting()
    return ApiResponse(
        success=True,
        message="Unified forecasting report generated",
        data=report.model_dump(),
    )
