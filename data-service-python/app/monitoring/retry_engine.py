"""Retry engine — retry metadata and recommendations without automatic execution."""

from __future__ import annotations

from typing import List

from app.monitoring.execution_tracker import execution_tracker
from app.monitoring.failure_engine import failure_engine, FAILURE_TAXONOMY
from app.monitoring.models import RetryRecord

DEFAULT_RETRY_LIMIT = 3


class RetryEngine:
    def build_retries(self) -> List[RetryRecord]:
        executions = execution_tracker.get_executions(limit=25)
        retries: List[RetryRecord] = []

        for i, execution in enumerate(executions):
            if execution.status not in ("failed", "warning"):
                continue
            category = failure_engine._category_for_execution(i, execution.pipeline_name)
            meta = FAILURE_TAXONOMY.get(category, FAILURE_TAXONOMY["unknown_error"])
            retry_count = min(i + 1, DEFAULT_RETRY_LIMIT)
            retries.append(
                RetryRecord(
                    id=f"retry-{execution.execution_id}",
                    pipeline=execution.pipeline_name,
                    pipeline_id=execution.pipeline_id,
                    retry_count=retry_count,
                    retry_limit=DEFAULT_RETRY_LIMIT,
                    last_retry=execution.end_time,
                    retry_recommendation=meta["retry_recommendation"],
                    retry_reason=meta["probable_cause"],
                    next_retry_placeholder="T+15m",
                    retryable=meta["retryable"] and retry_count < DEFAULT_RETRY_LIMIT,
                    status="queued" if meta["retryable"] else "blocked",
                )
            )

        if not retries:
            retries.append(
                RetryRecord(
                    id="retry-idle",
                    pipeline="ETL Pipeline",
                    pipeline_id="etl-pipeline",
                    retry_count=0,
                    retry_limit=DEFAULT_RETRY_LIMIT,
                    last_retry=None,
                    retry_recommendation="No pending retries",
                    retry_reason="All pipelines healthy",
                    next_retry_placeholder="—",
                    retryable=False,
                    status="idle",
                )
            )

        return retries

    def retry_history(self) -> List[RetryRecord]:
        return [r for r in self.build_retries() if r.retry_count > 0]


retry_engine = RetryEngine()
