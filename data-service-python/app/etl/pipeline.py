"""Enterprise ETL pipeline orchestrator."""

from __future__ import annotations

from typing import Any, Dict, Optional, Union

import pandas as pd

from app.etl.aggregate import run_aggregations
from app.etl.clean import clean_dataframe
from app.etl.cleaning_pipeline import run_cleaning_sample
from app.etl.config import ENTITY_SCHEMAS, PipelineConfig, SourceFormat
from app.etl.extract import extract_data
from app.etl.exceptions import EtlError
from app.etl.load import load_dataframe
from app.etl.normalize import normalize_dataframe
from app.etl.report import ReportBuilder
from app.etl.transform import transform_dataframe
from app.etl.validate import validate_dataframe


class EtlPipeline:
    """Runs extract → validate → clean → transform → normalize → aggregate → load → report."""

    def __init__(self, config: PipelineConfig) -> None:
        self.config = config
        self.datasets: Dict[str, pd.DataFrame] = {}
        self.aggregations: Dict[str, pd.DataFrame] = {}

    def run(
        self,
        content: Optional[Union[str, bytes, list]] = None,
        connection_string: Optional[str] = None,
    ) -> Dict[str, Any]:
        builder = ReportBuilder(self.config.pipeline_name, self.config.entity)
        schema = ENTITY_SCHEMAS.get(self.config.entity, {})
        pk = schema.get("primary_key")

        try:
            # Extract
            df = extract_data(
                self.config.extract.source_format,
                content=content,
                connection_string=connection_string or self.config.extract.connection_string,
                table_name=self.config.extract.table_name,
            )
            builder.rows_processed = len(df)
            builder.add_stage("extract", {"rows_extracted": len(df), "format": self.config.extract.source_format.value})

            # Validate
            validation = validate_dataframe(df, self.config.entity)
            builder.add_stage("validate", validation)

            # Clean
            cleaned, clean_report = clean_dataframe(df, self.config.clean, primary_key=pk)
            builder.add_stage("clean", clean_report)

            # Transform
            transformed, transform_report = transform_dataframe(
                cleaned, self.config.entity, self.config.transform
            )
            builder.add_stage("transform", transform_report)

            # Normalize
            normalized, normalize_report = normalize_dataframe(transformed, self.config.entity)
            builder.add_stage("normalize", normalize_report)
            self.datasets[self.config.entity] = normalized

            # Aggregate (when sales data available in future multi-entity runs)
            if self.config.run_aggregations and self.config.entity == "sales_transactions":
                self.aggregations, agg_report = run_aggregations(self.datasets)
                builder.add_stage("aggregate", agg_report)
                builder.aggregations = agg_report.aggregations

            # Load
            table_name = f"{self.config.load.table_prefix}{self.config.entity}"
            load_result = load_dataframe(
                normalized,
                table_name,
                self.config.load,
                connection_string=connection_string,
            )
            builder.load_results.append(load_result)
            builder.add_stage("load", load_result)

            report = builder.finalize(success=True)
            builder.add_stage("report", report.model_dump())
            return {
                "success": True,
                "report": report.model_dump(),
                "entity": self.config.entity,
                "rows_in_output": len(normalized),
            }

        except EtlError as exc:
            builder.add_error(exc.stage or "pipeline", str(exc))
            report = builder.finalize(success=False)
            return {"success": False, "report": report.model_dump(), "error": str(exc)}
        except Exception as exc:
            builder.add_error("pipeline", str(exc))
            report = builder.finalize(success=False)
            return {"success": False, "report": report.model_dump(), "error": str(exc)}


def run_sample_pipeline() -> Dict[str, Any]:
    """Run Sprint 4.2 cleaning engine on sample data (backward-compatible entry point)."""
    config = PipelineConfig(entity="stores")
    if config.use_cleaning_engine:
        return run_cleaning_sample()
    return _run_legacy_sample_pipeline()


def _run_legacy_sample_pipeline() -> Dict[str, Any]:
    """Sprint 4.1 foundation pipeline sample."""
    sample = [
        {
            "store_code": "ST-KAN-00001",
            "store_name": "Tokyo Flagship Store",
            "region": "kanto",
            "prefecture": "Tokyo",
            "city": "Shibuya",
            "address": "1-1 Test St",
            "store_type": "FLAGSHIP",
            "opening_date": "2020-04-01",
            "status": "active",
        },
        {
            "store_code": "ST-KAN-00002",
            "store_name": " Osaka Standard Store ",
            "region": "KANSAI",
            "prefecture": "Osaka",
            "city": "Osaka",
            "address": "2-2 Sample Ave",
            "store_type": "STANDARD",
            "opening_date": "2019-06-15",
            "status": "ACTIVE",
        },
        {
            "store_code": "ST-KAN-00001",
            "store_name": "Duplicate Store",
            "region": "KANTO",
            "prefecture": "Tokyo",
            "city": "Tokyo",
            "address": "dup",
            "store_type": "STANDARD",
            "opening_date": "2020-04-01",
            "status": "ACTIVE",
        },
    ]
    config = PipelineConfig(entity="stores")
    config.extract.source_format = SourceFormat.MEMORY
    pipeline = EtlPipeline(config)
    return pipeline.run(content=sample)
