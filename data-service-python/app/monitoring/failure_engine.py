"""Failure analysis engine — classify and summarize pipeline failures."""

from __future__ import annotations

from collections import Counter
from typing import List

from app.monitoring.execution_tracker import execution_tracker
from app.monitoring.models import FailureRecord

FAILURE_TAXONOMY = {
    "schema_error": {
        "severity": "high",
        "probable_cause": "Source schema drift or incompatible column types",
        "recommendation": "Align source schema with validation profile and warehouse DDL",
        "retryable": False,
        "retry_recommendation": "Fix schema before retry",
    },
    "validation_error": {
        "severity": "medium",
        "probable_cause": "Business rule or nullable constraint violations",
        "recommendation": "Review validation rules and quarantine invalid records",
        "retryable": True,
        "retry_recommendation": "Retry after updating validation profile",
    },
    "transformation_error": {
        "severity": "high",
        "probable_cause": "Transformation logic exception or missing enrichment keys",
        "recommendation": "Inspect transformation stage logs and mapping tables",
        "retryable": True,
        "retry_recommendation": "Retry transformation stage only",
    },
    "warehouse_load_error": {
        "severity": "critical",
        "probable_cause": "Warehouse load timeout or constraint violation",
        "recommendation": "Check warehouse indexes, batch size, and star schema keys",
        "retryable": True,
        "retry_recommendation": "Retry load with reduced batch size",
    },
    "statistics_error": {
        "severity": "medium",
        "probable_cause": "Statistics engine unable to compute on incomplete warehouse slice",
        "recommendation": "Verify warehouse freshness and statistics input tables",
        "retryable": True,
        "retry_recommendation": "Retry statistics after warehouse refresh",
    },
    "analytics_error": {
        "severity": "medium",
        "probable_cause": "Analytics KPI computation failed on dimensional join",
        "recommendation": "Validate dimension keys and analytics cube definitions",
        "retryable": True,
        "retry_recommendation": "Retry analytics job after dimension repair",
    },
    "forecasting_error": {
        "severity": "low",
        "probable_cause": "Insufficient historical window for forecasting model",
        "recommendation": "Extend training window or fall back to baseline model",
        "retryable": True,
        "retry_recommendation": "Retry with extended history window",
    },
    "unknown_error": {
        "severity": "medium",
        "probable_cause": "Unclassified pipeline exception",
        "recommendation": "Review execution logs and escalate to platform ops",
        "retryable": False,
        "retry_recommendation": "Manual investigation required",
    },
}

CATEGORY_ROTATION = list(FAILURE_TAXONOMY.keys())


class FailureEngine:
    def _category_for_execution(self, index: int, pipeline_name: str) -> str:
        pipeline_lower = pipeline_name.lower()
        if "warehouse" in pipeline_lower:
            return "warehouse_load_error"
        if "forecast" in pipeline_lower:
            return "forecasting_error"
        if "statistic" in pipeline_lower:
            return "statistics_error"
        if "analytics" in pipeline_lower:
            return "analytics_error"
        if "clean" in pipeline_lower:
            return "validation_error"
        return CATEGORY_ROTATION[index % len(CATEGORY_ROTATION)]

    def build_failures(self) -> List[FailureRecord]:
        executions = execution_tracker.get_executions(limit=25)
        failed = [e for e in executions if e.status == "failed"]
        failures: List[FailureRecord] = []

        for i, execution in enumerate(failed):
            category = self._category_for_execution(i, execution.pipeline_name)
            meta = FAILURE_TAXONOMY[category]
            failures.append(
                FailureRecord(
                    id=f"fail-{execution.execution_id}",
                    category=category,
                    severity=meta["severity"],
                    pipeline=execution.pipeline_name,
                    root_cause_placeholder=meta["probable_cause"],
                    suggested_action=meta["recommendation"],
                    retry_recommendation=meta["retry_recommendation"],
                    frequency=1,
                    retryable=meta["retryable"],
                    probable_cause=meta["probable_cause"],
                    recommendation=meta["recommendation"],
                )
            )

        if not failures:
            meta = FAILURE_TAXONOMY["validation_error"]
            failures.append(
                FailureRecord(
                    id="fail-sample",
                    category="validation_error",
                    severity="low",
                    pipeline="Data Cleaning Engine",
                    root_cause_placeholder="No active critical failures — monitoring placeholder",
                    suggested_action="Continue monitoring execution history",
                    retry_recommendation="No retry required",
                    frequency=0,
                    retryable=False,
                    probable_cause=meta["probable_cause"],
                    recommendation="Continue monitoring execution history",
                )
            )

        frequency = Counter(f.category for f in failures)
        return [
            FailureRecord(
                id=f.id,
                category=f.category,
                severity=f.severity,
                pipeline=f.pipeline,
                root_cause_placeholder=f.root_cause_placeholder,
                suggested_action=f.suggested_action,
                retry_recommendation=f.retry_recommendation,
                frequency=frequency[f.category],
                retryable=f.retryable,
                probable_cause=f.probable_cause,
                recommendation=f.recommendation,
            )
            for f in failures
        ]

    def most_common_category(self) -> str:
        failures = self.build_failures()
        if not failures:
            return "none"
        return max(failures, key=lambda f: f.frequency).category


failure_engine = FailureEngine()
