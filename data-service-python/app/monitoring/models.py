"""Pydantic models for pipeline monitoring API — Phase 8."""

from typing import List, Optional

from pydantic import BaseModel, Field


class MonitoringOverview(BaseModel):
    sprint: str = "8.2"
    status: str = "operations_center_ready"
    modules: List[str] = Field(default_factory=list)
    data_source: str = "aggregated"


class PipelineModuleStatus(BaseModel):
    module_id: str
    module_name: str
    status: str
    last_run: str
    duration_seconds: float
    quality_score: float
    processed_rows: int
    trend: str = "stable"


class ExecutionHistoryRow(BaseModel):
    run_id: str
    pipeline: str
    start_time: str
    end_time: str
    duration_seconds: float
    status: str
    rows_processed: int
    failed_rows: int
    trigger_source: str = "scheduled"


class QualityDimension(BaseModel):
    name: str
    score: float
    trend: str = "stable"


class QualityHistoryPoint(BaseModel):
    label: str
    value: float


class QualityCenter(BaseModel):
    dimensions: List[QualityDimension] = Field(default_factory=list)
    overall_quality_index: float = 0.0
    history: List[QualityHistoryPoint] = Field(default_factory=list)


class PipelineMetrics(BaseModel):
    success_rate: float
    failure_rate: float
    average_duration: float
    throughput: float
    rows_processed: int
    average_quality_score: float
    slowest_stage: str
    most_common_failure: str


class FailureRecord(BaseModel):
    id: str
    category: str
    severity: str
    pipeline: str
    root_cause_placeholder: str
    suggested_action: str
    retry_recommendation: str
    frequency: int


class RetryRecord(BaseModel):
    id: str
    pipeline: str
    retry_count: int
    retry_recommendation: str
    retryable: bool
    next_retry_placeholder: str
    status: str


class LineageNode(BaseModel):
    id: str
    label: str
    description: str


class ServiceHealthItem(BaseModel):
    service_id: str
    service_name: str
    status: str
    latency_ms: Optional[float] = None
    message: str = ""


class OperationalKpis(BaseModel):
    total_runs: int
    successful_runs: int
    failed_runs: int
    average_quality_score: float
    average_runtime: float
    total_processed_records: int
    platform_health_score: float


class MonitoringReport(BaseModel):
    overview: MonitoringOverview
    pipeline_modules: List[PipelineModuleStatus] = Field(default_factory=list)
    executions: List[ExecutionHistoryRow] = Field(default_factory=list)
    quality: QualityCenter
    metrics: PipelineMetrics
    failures: List[FailureRecord] = Field(default_factory=list)
    retries: List[RetryRecord] = Field(default_factory=list)
    lineage: List[LineageNode] = Field(default_factory=list)
    service_health: List[ServiceHealthItem] = Field(default_factory=list)
    operational_kpis: OperationalKpis
    execution_time_seconds: float = 0.0
