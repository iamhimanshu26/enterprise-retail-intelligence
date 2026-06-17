"""Pydantic models for executive intelligence API."""

from typing import List, Optional

from pydantic import BaseModel, Field


class IntelligenceOverview(BaseModel):
    sprint: str = "5.3"
    status: str = "executive_intelligence_ready"
    modules: List[str] = Field(default_factory=list)
    data_source: str = "sample"


class ExecutiveSummary(BaseModel):
    summary: str
    highlights: List[str] = Field(default_factory=list)
    tags: List[str] = Field(default_factory=list)
    recommendation: Optional[str] = None


class KpiIntelligenceItem(BaseModel):
    id: str
    label: str
    value: float
    unit: str = ""
    status: str
    trend: str
    benchmark_pct: Optional[float] = None
    change_pct: Optional[float] = None
    health_indicator: str


class TrendAnalysisItem(BaseModel):
    metric: str
    direction: str
    change_pct: float
    description: str
    seasonal_note: Optional[str] = None


class BenchmarkItem(BaseModel):
    metric: str
    actual: float
    target: float
    achievement_pct: float
    unit: str = ""


class AnomalyItem(BaseModel):
    id: str
    anomaly_type: str
    severity: str
    metric: str
    value: float
    expected_range: str
    explanation: str


class RecommendationItem(BaseModel):
    id: str
    priority: str
    title: str
    description: str
    action: str
    area: str


class ScorecardDimension(BaseModel):
    name: str
    score: float
    status: str
    explanation: str


class ExecutiveScorecard(BaseModel):
    dimensions: List[ScorecardDimension] = Field(default_factory=list)
    overall_score: float = 0.0
    overall_status: str = "Good"
    methodology: str = ""


class BusinessHealthCenter(BaseModel):
    overall_score: float
    overall_status: str
    strongest_area: str
    weakest_area: str
    highest_risk: str
    biggest_opportunity: str


class ExecutiveIntelligenceReport(BaseModel):
    overview: IntelligenceOverview
    executive_summary: ExecutiveSummary
    kpi_intelligence: List[KpiIntelligenceItem] = Field(default_factory=list)
    trends: List[TrendAnalysisItem] = Field(default_factory=list)
    benchmarks: List[BenchmarkItem] = Field(default_factory=list)
    anomalies: List[AnomalyItem] = Field(default_factory=list)
    recommendations: List[RecommendationItem] = Field(default_factory=list)
    scorecard: ExecutiveScorecard
    business_health: BusinessHealthCenter
    execution_time_seconds: float = 0.0
