"""Pydantic models for pipeline monitoring API — Phase 8.1."""

from typing import List, Optional

from pydantic import BaseModel, Field


class MonitoringOverview(BaseModel):
    sprint: str = "8.1"
    status: str = "monitoring_backend_ready"
    modules: List[str] = Field(default_factory=list)
    data_source: str = "aggregated"


class PipelineDefinition(BaseModel):
    pipeline_id: str
    name: str
    description: str
    owner: str = "platform-ops"
    version: str = "1.0.0"
    current_status: str = "success"
    enabled: bool = True


class TrackedExecution(BaseModel):
    execution_id: str
    pipeline_id: str
    pipeline_name: str
    start_time: str
    end_time: str
    duration_seconds: float
    trigger_source: str = "scheduled"
    status: str
    records_processed: int
    records_failed: int
    quality_score: float
    execution_notes: str = ""


class PipelineStatusSnapshot(BaseModel):
    pipeline_id: str
    name: str
    current_status: str
    last_execution: Optional[str] = None
    last_successful_execution: Optional[str] = None
    current_stage: str = "idle"
    execution_duration_seconds: float = 0.0
    health_indicator: str = "healthy"


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
    status: str = "Good"


class QualityHistoryPoint(BaseModel):
    label: str
    value: float


class QualityCenter(BaseModel):
    dimensions: List[QualityDimension] = Field(default_factory=list)
    overall_quality_index: float = 0.0
    history: List[QualityHistoryPoint] = Field(default_factory=list)
    quality_status: str = "Good"
    quality_trend: str = "stable"


class PipelineMetrics(BaseModel):
    success_rate: float
    failure_rate: float
    average_duration: float
    throughput: float
    rows_processed: int
    average_quality_score: float
    slowest_stage: str
    most_common_failure: str
    total_executions: int = 0
    successful_executions: int = 0
    failed_executions: int = 0
    longest_runtime: float = 0.0
    shortest_runtime: float = 0.0
    throughput_placeholder: float = 0.0


class FailureRecord(BaseModel):
    id: str
    category: str
    severity: str
    pipeline: str
    root_cause_placeholder: str
    suggested_action: str
    retry_recommendation: str
    frequency: int
    retryable: bool = False
    probable_cause: str = ""
    recommendation: str = ""


class RetryRecord(BaseModel):
    id: str
    pipeline: str
    retry_count: int
    retry_recommendation: str
    retryable: bool
    next_retry_placeholder: str
    status: str
    pipeline_id: str = ""
    retry_limit: int = 3
    last_retry: Optional[str] = None
    retry_reason: str = ""


class LineageNode(BaseModel):
    id: str
    label: str
    description: str


class LineageEdge(BaseModel):
    source: str
    target: str
    transformation: str = ""


class LineageGraph(BaseModel):
    nodes: List[LineageNode] = Field(default_factory=list)
    edges: List[LineageEdge] = Field(default_factory=list)
    flow: List[str] = Field(default_factory=list)


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
    pipeline_registry: List[PipelineDefinition] = Field(default_factory=list)
    pipeline_modules: List[PipelineModuleStatus] = Field(default_factory=list)
    pipeline_status: List[PipelineStatusSnapshot] = Field(default_factory=list)
    executions: List[ExecutionHistoryRow] = Field(default_factory=list)
    tracked_executions: List[TrackedExecution] = Field(default_factory=list)
    quality: QualityCenter
    metrics: PipelineMetrics
    failures: List[FailureRecord] = Field(default_factory=list)
    retries: List[RetryRecord] = Field(default_factory=list)
    lineage: List[LineageNode] = Field(default_factory=list)
    lineage_graph: Optional[LineageGraph] = None
    service_health: List[ServiceHealthItem] = Field(default_factory=list)
    operational_kpis: OperationalKpis
    execution_time_seconds: float = 0.0
