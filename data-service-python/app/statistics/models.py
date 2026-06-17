"""Pydantic models for statistics API responses."""

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class DescriptiveStats(BaseModel):
    column: str
    count: int = 0
    sum: Optional[float] = None
    mean: Optional[float] = None
    median: Optional[float] = None
    mode: Optional[float] = None
    min: Optional[float] = None
    max: Optional[float] = None
    range: Optional[float] = None
    variance: Optional[float] = None
    std: Optional[float] = None
    q1: Optional[float] = None
    q3: Optional[float] = None
    p25: Optional[float] = None
    p75: Optional[float] = None
    p90: Optional[float] = None
    p95: Optional[float] = None
    skewness: Optional[float] = None
    kurtosis: Optional[float] = None


class BusinessMetrics(BaseModel):
    average_order_value: float = 0.0
    revenue_per_store: float = 0.0
    revenue_per_customer: float = 0.0
    revenue_per_product: float = 0.0
    profit_margin_pct: float = 0.0
    gross_profit: float = 0.0
    return_rate_pct: float = 0.0
    discount_rate_pct: float = 0.0
    inventory_turnover: Optional[float] = None
    customer_lifetime_value: Optional[float] = None
    sales_per_transaction: float = 0.0
    units_per_transaction: float = 0.0
    total_revenue: float = 0.0
    total_orders: int = 0


class DistributionBucket(BaseModel):
    label: str
    count: int
    percentage: float


class DistributionSummary(BaseModel):
    name: str
    buckets: List[DistributionBucket] = Field(default_factory=list)
    chart_ready: bool = True


class TimeSeriesPoint(BaseModel):
    period: str
    revenue: float
    orders: int = 0
    growth_pct: Optional[float] = None


class TimeSeriesStats(BaseModel):
    daily: List[TimeSeriesPoint] = Field(default_factory=list)
    weekly: List[TimeSeriesPoint] = Field(default_factory=list)
    monthly: List[TimeSeriesPoint] = Field(default_factory=list)
    quarterly: List[TimeSeriesPoint] = Field(default_factory=list)
    yearly: List[TimeSeriesPoint] = Field(default_factory=list)
    month_over_month_growth_pct: Optional[float] = None
    year_over_year_growth_pct: Optional[float] = None
    rolling_average_7d: Optional[float] = None


class RegionalStatRow(BaseModel):
    region: str
    revenue: float
    profit: float
    orders: int
    customers: int
    average_order_value: float
    return_rate_pct: float


class RegionalStats(BaseModel):
    rows: List[RegionalStatRow] = Field(default_factory=list)
    top_region: Optional[str] = None
    lowest_region: Optional[str] = None
    fastest_growing_region: Optional[str] = None


class DatasetHealth(BaseModel):
    total_records: int = 0
    valid_records: int = 0
    invalid_records: int = 0
    null_percentage: float = 0.0
    duplicate_percentage: float = 0.0
    completeness_pct: float = 100.0
    consistency_pct: float = 100.0
    quality_score: float = 100.0
    data_quality_index: float = 100.0


class StatisticsOverview(BaseModel):
    sprint: str = "5.1"
    status: str = "statistics_engine_ready"
    modules: List[str] = Field(default_factory=list)
    supported_metrics: List[str] = Field(default_factory=list)
    data_source: str = "sample"


class UnifiedStatisticsReport(BaseModel):
    overview: StatisticsOverview
    descriptive: List[DescriptiveStats]
    business: BusinessMetrics
    distributions: List[DistributionSummary]
    time_series: TimeSeriesStats
    regional: RegionalStats
    health: DatasetHealth
    execution_time_seconds: float = 0.0
