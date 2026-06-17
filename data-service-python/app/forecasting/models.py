"""Pydantic models for forecasting API."""

from typing import List, Optional

from pydantic import BaseModel, Field


class ForecastingOverview(BaseModel):
    sprint: str = "7.1"
    status: str = "forecasting_engine_ready"
    modules: List[str] = Field(default_factory=list)
    data_source: str = "sample"
    supported_models: List[str] = Field(
        default_factory=lambda: [
            "moving_average",
            "linear_regression",
            "seasonal_naive",
            "exponential_smoothing",
        ]
    )


class ForecastPoint(BaseModel):
    forecast_date: str
    predicted_value: float
    confidence_low: Optional[float] = None
    confidence_high: Optional[float] = None
    trend_direction: str = "stable"
    model_name: str = "moving_average"
    forecast_horizon: int = 1


class ForecastSeries(BaseModel):
    granularity: str
    model_name: str
    horizon: int
    points: List[ForecastPoint] = Field(default_factory=list)


class SalesForecast(BaseModel):
    daily: ForecastSeries
    weekly: ForecastSeries
    monthly: ForecastSeries


class RevenueForecast(BaseModel):
    daily: ForecastSeries
    weekly: ForecastSeries
    monthly: ForecastSeries
    quarterly: ForecastSeries


class DemandForecastRow(BaseModel):
    dimension: str
    dimension_type: str
    predicted_demand: float
    trend_direction: str = "stable"
    model_name: str = "moving_average"


class DemandForecast(BaseModel):
    product_demand: List[DemandForecastRow] = Field(default_factory=list)
    category_demand: List[DemandForecastRow] = Field(default_factory=list)
    fast_moving: List[DemandForecastRow] = Field(default_factory=list)
    slow_moving: List[DemandForecastRow] = Field(default_factory=list)


class InventoryForecastRow(BaseModel):
    product_code: str
    expected_usage: float
    stock_out_risk_score: float
    reorder_recommendation: str
    days_until_stock_out: Optional[float] = None
    reorder_quantity_placeholder: Optional[float] = None
    current_stock: float = 0.0


class InventoryForecast(BaseModel):
    items: List[InventoryForecastRow] = Field(default_factory=list)
    aggregate_stock_out_risk: float = 0.0


class StoreForecastRow(BaseModel):
    store_code: str
    predicted_revenue: float
    predicted_orders: float
    revenue_trend: str = "stable"
    order_trend: str = "stable"
    performance_risk_score: float = 0.0
    classification: str = "stable"


class StoreForecast(BaseModel):
    stores: List[StoreForecastRow] = Field(default_factory=list)
    high_growth_stores: List[str] = Field(default_factory=list)
    declining_stores: List[str] = Field(default_factory=list)


class AccuracyMetrics(BaseModel):
    metric_name: str
    model_name: str
    mae: float
    rmse: float
    mape: float
    smape: Optional[float] = None
    bias: float = 0.0
    accuracy_score: float = 0.0


class AccuracyReport(BaseModel):
    metrics: List[AccuracyMetrics] = Field(default_factory=list)
    overall_accuracy_score: float = 0.0


class ScenarioResult(BaseModel):
    scenario: str
    metric: str
    base_value: float
    adjusted_value: float
    adjustment_pct: float


class ScenarioOutputs(BaseModel):
    scenarios: List[ScenarioResult] = Field(default_factory=list)


class ForecastingReport(BaseModel):
    overview: ForecastingOverview
    sales: SalesForecast
    revenue: RevenueForecast
    demand: DemandForecast
    inventory: InventoryForecast
    stores: StoreForecast
    accuracy: AccuracyReport
    scenarios: ScenarioOutputs
    execution_time_seconds: float = 0.0
