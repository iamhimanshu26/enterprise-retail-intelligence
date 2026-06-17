"""Pipeline registry — metadata for every platform pipeline module."""

from __future__ import annotations

from typing import Dict, List, Optional

from app.monitoring.models import PipelineDefinition

PIPELINE_DEFINITIONS: List[PipelineDefinition] = [
    PipelineDefinition(
        pipeline_id="synthetic-generator",
        name="Synthetic Data Generator",
        description="Faker/Pandas retail dataset generation for stores, products, sales, and inventory.",
        owner="data-platform",
        version="1.2.0",
        current_status="success",
        enabled=True,
    ),
    PipelineDefinition(
        pipeline_id="etl-pipeline",
        name="ETL Pipeline",
        description="Enterprise ingestion orchestrator from raw files through validation and load.",
        owner="data-engineering",
        version="4.3.0",
        current_status="success",
        enabled=True,
    ),
    PipelineDefinition(
        pipeline_id="data-cleaning",
        name="Data Cleaning Engine",
        description="Missing values, duplicates, normalization, and business rule enforcement.",
        owner="data-engineering",
        version="4.2.0",
        current_status="success",
        enabled=True,
    ),
    PipelineDefinition(
        pipeline_id="analytics-warehouse",
        name="Analytics Warehouse",
        description="Star schema warehouse load and dimensional model maintenance.",
        owner="analytics-platform",
        version="4.1.0",
        current_status="warning",
        enabled=True,
    ),
    PipelineDefinition(
        pipeline_id="statistics-engine",
        name="Statistics Engine",
        description="Descriptive, distribution, regional, and dataset health statistics.",
        owner="analytics-platform",
        version="5.1.0",
        current_status="success",
        enabled=True,
    ),
    PipelineDefinition(
        pipeline_id="business-analytics",
        name="Business Analytics Engine",
        description="Dimensional KPI computation across sales, inventory, and customer metrics.",
        owner="analytics-platform",
        version="6.0.0",
        current_status="success",
        enabled=True,
    ),
    PipelineDefinition(
        pipeline_id="executive-intelligence",
        name="Executive Intelligence Engine",
        description="Executive summaries, health scores, and strategic insight generation.",
        owner="executive-analytics",
        version="6.1.0",
        current_status="success",
        enabled=True,
    ),
    PipelineDefinition(
        pipeline_id="forecasting-engine",
        name="Forecasting Engine",
        description="Sales, demand, inventory, and scenario forecasting with accuracy tracking.",
        owner="ml-platform",
        version="7.0.0",
        current_status="queued",
        enabled=True,
    ),
]


class PipelineRegistry:
    """In-memory registry of platform pipelines — future PostgreSQL persistence."""

    def __init__(self) -> None:
        self._pipelines: Dict[str, PipelineDefinition] = {
            p.pipeline_id: p for p in PIPELINE_DEFINITIONS
        }

    def list_pipelines(self) -> List[PipelineDefinition]:
        return list(self._pipelines.values())

    def get(self, pipeline_id: str) -> Optional[PipelineDefinition]:
        return self._pipelines.get(pipeline_id)

    def update_status(self, pipeline_id: str, status: str) -> None:
        if pipeline_id in self._pipelines:
            self._pipelines[pipeline_id].current_status = status


pipeline_registry = PipelineRegistry()
