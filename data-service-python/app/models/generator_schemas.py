"""Pydantic schemas for synthetic data generator API."""

from datetime import date, datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field, field_validator


class EntityCountsConfig(BaseModel):
    stores: int = Field(50, ge=1, le=500)
    products: int = Field(500, ge=100, le=100000)
    customers: int = Field(1000, ge=100, le=1000000)
    suppliers: int = Field(50, ge=10, le=10000)
    sales_transactions: int = Field(5000, ge=1000, le=10000000)
    promotions: int = Field(20, ge=0, le=5000)
    returns: int = Field(200, ge=0, le=1000000)


class SimulationConfig(BaseModel):
    start_date: date
    end_date: date
    seasonal_demand: bool = True
    weekend_sales_boost: float = Field(0.15, ge=0, le=1)
    holiday_sales_boost: float = Field(0.25, ge=0, le=1)
    promotion_impact: float = Field(0.2, ge=0, le=1)
    regional_distribution: bool = True
    store_popularity: bool = True
    product_popularity: bool = True

    @field_validator("end_date")
    @classmethod
    def end_after_start(cls, end_date: date, info) -> date:
        start = info.data.get("start_date")
        if start and end_date < start:
            raise ValueError("end_date must be on or after start_date")
        return end_date


class DataQualityConfig(BaseModel):
    missing_values_pct: float = Field(1.0, ge=0, le=50)
    duplicate_rows_pct: float = Field(0.5, ge=0, le=20)
    invalid_records_pct: float = Field(0.3, ge=0, le=20)
    outliers_pct: float = Field(0.5, ge=0, le=20)
    null_values_pct: float = Field(0.5, ge=0, le=50)


class GenerationConfigRequest(BaseModel):
    dataset_name: str = Field("retail_dataset", min_length=1, max_length=100)
    counts: EntityCountsConfig
    simulation: SimulationConfig
    data_quality: DataQualityConfig = Field(default_factory=DataQualityConfig)
    seed: Optional[int] = None


class GenerationStartResponse(BaseModel):
    job_id: str
    dataset_name: str
    status: str


class GenerationStatusResponse(BaseModel):
    job_id: str
    dataset_name: str
    status: str
    progress: float
    current_step: str
    started_at: Optional[str] = None
    completed_at: Optional[str] = None
    elapsed_seconds: float = 0
    estimated_remaining_seconds: Optional[float] = None
    error: Optional[str] = None
    summary: Optional[Dict[str, Any]] = None


class PreviewResponse(BaseModel):
    entity: str
    row_count: int
    columns: List[str]
    rows: List[Dict[str, Any]]


class DefaultsResponse(BaseModel):
    counts: EntityCountsConfig
    simulation: SimulationConfig
    data_quality: DataQualityConfig
    entities: List[str]


class ApiResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
