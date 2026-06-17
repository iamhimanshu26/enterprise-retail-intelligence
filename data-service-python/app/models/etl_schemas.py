"""Pydantic schemas for ETL API."""

from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field

from app.etl.config import PipelineConfig, StageInfo, get_cleaning_engine_stages, get_pipeline_stages


class EtlOverviewResponse(BaseModel):
    pipeline_flow: List[str] = [
        "Profile", "Validate", "Missing Values", "Duplicates",
        "Clean", "Standardize", "Normalize", "Transform",
        "Business Rules", "Quality Score", "Load", "Report",
    ]
    cleaning_flow: List[str] = [
        "Profile", "Validate", "Detect Missing", "Detect Duplicates",
        "Clean", "Normalize", "Transform", "Business Rules",
        "Quality Score", "Analytics Ready",
    ]
    stages: List[StageInfo] = Field(default_factory=get_pipeline_stages)
    cleaning_stages: List[StageInfo] = Field(default_factory=get_cleaning_engine_stages)
    supported_sources: List[str] = ["csv", "xlsx", "json", "postgres", "memory"]
    supported_load_targets: List[str] = ["postgres", "duckdb", "memory"]
    entities: List[str] = ["stores", "products", "sales_transactions"]
    sprint: str = "4.2"
    status: str = "cleaning_engine_ready"


class EtlRunRequest(BaseModel):
    use_sample: bool = True
    use_cleaning_engine: bool = True
    config: Optional[PipelineConfig] = None


class EtlRunResponse(BaseModel):
    success: bool
    report: Dict[str, Any]
    entity: Optional[str] = None
    rows_in_output: Optional[int] = None
    quality_score: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


class ApiResponse(BaseModel):
    success: bool
    message: str
    data: Optional[Any] = None
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
