"""Pydantic schemas for ETL API."""

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field

from app.etl.config import PipelineConfig, StageInfo, get_cleaning_engine_stages, get_pipeline_stages


FINAL_ETL_FLOW = [
    "Synthetic Data", "Extract", "Validate", "Profile", "Clean",
    "Normalize", "Transform", "Business Rules", "Aggregate",
    "Load", "Analytics Warehouse", "Quality Dashboard", "Execution Report",
]


class EtlOverviewResponse(BaseModel):
    pipeline_flow: List[str] = FINAL_ETL_FLOW
    cleaning_flow: List[str] = [
        "Profile", "Validate", "Detect Missing", "Detect Duplicates",
        "Clean", "Normalize", "Transform", "Business Rules",
        "Quality Score", "Analytics Ready",
    ]
    warehouse_flow: List[str] = [
        "Operational Data", "ETL Pipeline", "Transformation",
        "Warehouse", "Analytics", "Forecasting", "AI Insights",
    ]
    stages: List[StageInfo] = Field(default_factory=get_pipeline_stages)
    cleaning_stages: List[StageInfo] = Field(default_factory=get_cleaning_engine_stages)
    supported_sources: List[str] = ["csv", "xlsx", "json", "postgres", "memory"]
    supported_load_targets: List[str] = ["postgres", "duckdb", "memory"]
    warehouse_tables: List[str] = [
        "fact_sales", "fact_returns", "dim_store", "dim_product",
        "dim_customer", "dim_supplier", "dim_date",
    ]
    load_strategies: List[str] = ["full", "incremental", "append", "replace"]
    entities: List[str] = ["stores", "products", "sales_transactions"]
    sprint: str = "4.3"
    status: str = "phase_4_complete"
    phase: str = "4"


class EtlRunRequest(BaseModel):
    use_sample: bool = True
    use_cleaning_engine: bool = True
    use_warehouse: bool = True
    config: Optional[PipelineConfig] = None


class EtlRunResponse(BaseModel):
    success: bool
    report: Dict[str, Any]
    entity: Optional[str] = None
    pipeline_id: Optional[str] = None
    rows_in_output: Optional[int] = None
    quality_score: Optional[Dict[str, Any]] = None
    lineage: Optional[Dict[str, Any]] = None
    metrics: Optional[Dict[str, Any]] = None
    warehouse_summary: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


class ExecutionHistoryItem(BaseModel):
    pipeline_id: str
    pipeline_name: str
    entity: str
    start_time: str
    end_time: str
    duration_seconds: float
    status: str
    processed_rows: int
    failed_rows: int
    quality_score: float
    metrics: Dict[str, Any] = Field(default_factory=dict)


class WarehouseSummaryResponse(BaseModel):
    stores: int
    products: int
    customers: int
    suppliers: int = 0
    sales: int
    returns: int
    tables: Dict[str, int] = Field(default_factory=dict)
    loaded_tables: List[str] = Field(default_factory=list)


class QualityDashboardResponse(BaseModel):
    completeness: float
    accuracy: float
    consistency: float
    validity: float
    timeliness: float
    uniqueness: float
    data_quality_index: float
    overall: float


class ApiResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
