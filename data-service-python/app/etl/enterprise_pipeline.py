"""Sprint 4.3 enterprise ETL pipeline — warehouse, lineage, history, metrics."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, Optional, Union

import pandas as pd

from app.etl.aggregate import run_aggregations
from app.etl.cleaning_pipeline import CleaningTransformationPipeline
from app.etl.config import PipelineConfig, SourceFormat
from app.etl.execution_history import execution_history_store
from app.etl.lineage import build_pipeline_lineage
from app.etl.metrics import compute_etl_metrics
from app.etl.warehouse import get_warehouse_loader, get_warehouse_summary, load_to_warehouse


def finalize_enterprise_run(
    config: PipelineConfig,
    df: pd.DataFrame,
    entity: str,
    stage_reports: Dict[str, Any],
    quality_dict: Dict[str, Any],
    quality_report: Dict[str, Any],
    rows_processed: int,
    start_dt: datetime,
    elapsed: float,
) -> Dict[str, Any]:
    """Extend cleaning pipeline with warehouse, lineage, history, and metrics."""
    datasets: Dict[str, pd.DataFrame] = {entity: df}
    aggregations: Dict[str, pd.DataFrame] = {}

    if config.run_aggregations:
        aggregations, agg_report = run_aggregations(datasets)
        stage_reports["aggregate"] = agg_report.to_dict()

    warehouse_report = None
    lineage = None
    warehouse_summary = None
    loaded_tables: list = []

    if config.use_warehouse and config.warehouse.enabled:
        warehouse_report = load_to_warehouse(
            datasets,
            target=config.warehouse.target,
            strategy=config.warehouse.strategy,
        )
        stage_reports["warehouse"] = warehouse_report.to_dict()
        loader = get_warehouse_loader(config.warehouse.target)
        warehouse_summary = get_warehouse_summary(loader)
        loaded_tables = list(warehouse_report.tables_loaded.keys())

    source_name = f"{entity}.csv"
    lineage_tracker = build_pipeline_lineage(source_name, entity, loaded_tables or [entity])
    lineage = lineage_tracker.to_dict()
    stage_reports["lineage"] = lineage

    failed_rows = quality_report.get("invalid_records", 0)
    metrics = compute_etl_metrics(
        rows_processed=rows_processed,
        execution_time=elapsed,
        successful=len(df),
        failed=failed_rows,
    )
    stage_reports["metrics"] = metrics.to_dict()

    end_dt = datetime.now(timezone.utc)
    pipeline_id = execution_history_store.record(
        pipeline_name=config.pipeline_name,
        entity=entity,
        start_time=start_dt,
        end_time=end_dt,
        success=True,
        processed_rows=rows_processed,
        failed_rows=failed_rows,
        quality_score=quality_dict.get("data_quality_index", quality_dict.get("overall", 100)),
        metrics=metrics.to_dict(),
    )

    quality_report["lineage"] = lineage
    quality_report["metrics"] = metrics.to_dict()
    quality_report["warehouse_summary"] = warehouse_summary
    quality_report["pipeline_id"] = pipeline_id

    return {
        "success": True,
        "entity": entity,
        "pipeline_id": pipeline_id,
        "rows_in_output": len(df),
        "report": quality_report,
        "quality_score": quality_dict,
        "lineage": lineage,
        "metrics": metrics.to_dict(),
        "warehouse_summary": warehouse_summary,
        "execution_history": execution_history_store.get_latest(),
    }


class EnterpriseEtlPipeline(CleaningTransformationPipeline):
    """Full Phase 4 pipeline: cleaning + warehouse + lineage + history."""

    def run(
        self,
        content: Optional[Union[str, bytes, list]] = None,
        connection_string: Optional[str] = None,
    ) -> Dict[str, Any]:
        import time

        start_dt = datetime.now(timezone.utc)
        start_time = time.time()
        entity = self.config.entity

        if not self.config.use_warehouse:
            return super().run(content=content, connection_string=connection_string)

        # Run cleaning stages manually to capture df before return
        from app.etl.business_rules import validate_business_rules
        from app.etl.clean import clean_dataframe
        from app.etl.config import ENTITY_SCHEMAS
        from app.etl.currency import normalize_currency
        from app.etl.dates import transform_dates
        from app.etl.duplicates import DuplicateConfig, detect_duplicates, handle_duplicates
        from app.etl.extract import extract_data
        from app.etl.exceptions import EtlError
        from app.etl.load import load_dataframe
        from app.etl.missing_values import MissingValueConfig, detect_missing, handle_missing_values
        from app.etl.normalize import normalize_dataframe
        from app.etl.profiling import profile_dataframe
        from app.etl.quality_report import build_quality_report
        from app.etl.quality_score import compute_quality_score
        from app.etl.standardize import standardize_dataframe
        from app.etl.transform import transform_dataframe
        from app.etl.validate import validate_dataframe

        schema = ENTITY_SCHEMAS.get(entity, {})
        pk = schema.get("primary_key")
        stage_reports: Dict[str, Any] = {}

        try:
            df = extract_data(
                self.config.extract.source_format,
                content=content,
                connection_string=connection_string or self.config.extract.connection_string,
                table_name=self.config.extract.table_name,
            )
            rows_processed = len(df)
            stage_reports["extract"] = {"rows_extracted": rows_processed}

            validation = validate_dataframe(df, entity)
            stage_reports["schema_validation"] = validation.to_dict()

            profile = profile_dataframe(df)
            stage_reports["profile"] = profile.to_dict()

            missing_detection = detect_missing(df)
            stage_reports["missing_detection"] = missing_detection

            missing_config = MissingValueConfig(strategy="mark")
            df, missing_report = handle_missing_values(df, missing_config, self.audit)
            stage_reports["missing_values"] = missing_report.to_dict()

            dup_detection = detect_duplicates(df, pk)
            stage_reports["duplicate_detection"] = dup_detection

            dup_config = DuplicateConfig(action="remove", keep="first")
            df, dup_report = handle_duplicates(df, dup_config, pk, self.audit)
            stage_reports["duplicate_handling"] = dup_report.to_dict()

            df, clean_report = clean_dataframe(df, self.config.clean, primary_key=pk)
            stage_reports["clean"] = clean_report.to_dict()

            df, std_report = standardize_dataframe(df, self.audit)
            stage_reports["standardize"] = std_report.to_dict()

            df, norm_report = normalize_dataframe(df, entity, self.audit)
            stage_reports["normalize"] = norm_report.to_dict()

            df, date_report = transform_dates(df, self.audit)
            stage_reports["dates"] = date_report.to_dict()

            df, currency_report = normalize_currency(df, self.audit)
            stage_reports["currency"] = currency_report.to_dict()

            df, transform_report = transform_dataframe(df, entity, self.config.transform)
            stage_reports["transform"] = transform_report.to_dict()

            business = validate_business_rules(df, entity)
            stage_reports["business_rules"] = business.to_dict()

            quality = compute_quality_score(
                df,
                profile,
                duplicate_count=dup_report.rows_removed,
                business_violations=business.total_violations,
                primary_key=pk,
            )
            stage_reports["quality_score"] = quality.to_dict()

            table_name = f"{self.config.load.table_prefix}{entity}"
            load_result = load_dataframe(
                df,
                table_name,
                self.config.load,
                connection_string=connection_string,
            )
            stage_reports["load"] = load_result

            elapsed = time.time() - start_time
            transformations = self.audit.to_dict()["entry_count"]

            quality_report = build_quality_report(
                rows_processed=rows_processed,
                rows_output=len(df),
                duplicates_removed=dup_report.rows_removed + clean_report.duplicates_removed,
                missing_fixed=missing_report.values_fixed,
                invalid_records=business.total_violations,
                transformations_applied=transformations,
                quality=quality,
                execution_time=elapsed,
                audit=self.audit,
                stage_reports=stage_reports,
            )

            return finalize_enterprise_run(
                self.config,
                df,
                entity,
                stage_reports,
                quality.to_dict(),
                quality_report,
                rows_processed,
                start_dt,
                elapsed,
            )

        except EtlError as exc:
            end_dt = datetime.now(timezone.utc)
            execution_history_store.record(
                pipeline_name=self.config.pipeline_name,
                entity=entity,
                start_time=start_dt,
                end_time=end_dt,
                success=False,
                processed_rows=0,
                failed_rows=0,
                quality_score=0,
            )
            return {
                "success": False,
                "error": str(exc),
                "report": {"errors": [str(exc)], "stage_reports": stage_reports},
            }
        except Exception as exc:
            end_dt = datetime.now(timezone.utc)
            execution_history_store.record(
                pipeline_name=self.config.pipeline_name,
                entity=entity,
                start_time=start_dt,
                end_time=end_dt,
                success=False,
                processed_rows=0,
                failed_rows=0,
                quality_score=0,
            )
            return {
                "success": False,
                "error": str(exc),
                "report": {"errors": [str(exc)], "stage_reports": stage_reports},
            }


def run_enterprise_sample() -> Dict[str, Any]:
    """Run full enterprise pipeline on sample data."""
    sample = [
        {
            "store_code": "ST-KAN-00001",
            "store_name": "AEON TOKYO",
            "region": "kanto",
            "prefecture": "TOKYO",
            "city": "tokyo",
            "address": "1-1 Test St",
            "store_type": "FLAGSHIP",
            "opening_date": "2020/04/01",
            "status": "active",
            "unit_price": "¥1,000",
            "cost_price": 800,
        },
        {
            "store_code": "ST-KAN-00002",
            "store_name": "  aeon tokyo  ",
            "region": "KANSAI",
            "prefecture": "東京都",
            "city": "Osaka",
            "address": "2-2 Ave",
            "store_type": "STANDARD",
            "opening_date": "15/06/2019",
            "status": "ACTIVE",
            "unit_price": "1000.00",
            "cost_price": "¥1,200",
        },
        {
            "store_code": "ST-KAN-00003",
            "store_name": "Electronics Hub",
            "region": "KANTO",
            "prefecture": "Kanagawa",
            "city": "  Yokohama ",
            "address": "3-3 Bay",
            "store_type": "EXPRESS",
            "opening_date": "2021-03-10",
            "status": "ACTIVE",
            "category": "electronics",
            "unit_price": 500,
            "cost_price": 300,
        },
    ]
    config = PipelineConfig(entity="stores")
    config.extract.source_format = SourceFormat.MEMORY
    config.load.dry_run = False
    config.use_warehouse = True
    pipeline = EnterpriseEtlPipeline(config)
    return pipeline.run(content=sample)
