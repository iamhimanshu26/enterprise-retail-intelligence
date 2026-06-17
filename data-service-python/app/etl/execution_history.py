"""ETL execution history store — in-memory with future PostgreSQL persistence."""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional


class ExecutionRecord:
    def __init__(
        self,
        pipeline_id: str,
        pipeline_name: str,
        entity: str,
        start_time: datetime,
        end_time: datetime,
        status: str,
        processed_rows: int,
        failed_rows: int,
        quality_score: float,
        duration_seconds: float,
        metrics: Optional[Dict[str, Any]] = None,
    ) -> None:
        self.pipeline_id = pipeline_id
        self.pipeline_name = pipeline_name
        self.entity = entity
        self.start_time = start_time
        self.end_time = end_time
        self.status = status
        self.processed_rows = processed_rows
        self.failed_rows = failed_rows
        self.quality_score = quality_score
        self.duration_seconds = duration_seconds
        self.metrics = metrics or {}

    def to_dict(self) -> Dict[str, Any]:
        return {
            "pipeline_id": self.pipeline_id,
            "pipeline_name": self.pipeline_name,
            "entity": self.entity,
            "start_time": self.start_time.isoformat(),
            "end_time": self.end_time.isoformat(),
            "duration_seconds": round(self.duration_seconds, 3),
            "status": self.status,
            "processed_rows": self.processed_rows,
            "failed_rows": self.failed_rows,
            "quality_score": round(self.quality_score, 2),
            "metrics": self.metrics,
        }


class ExecutionHistoryStore:
    """In-memory execution history — replace with PostgreSQL in future sprint."""

    def __init__(self) -> None:
        self._records: List[ExecutionRecord] = []

    def record(
        self,
        pipeline_name: str,
        entity: str,
        start_time: datetime,
        end_time: datetime,
        success: bool,
        processed_rows: int,
        failed_rows: int,
        quality_score: float,
        metrics: Optional[Dict[str, Any]] = None,
    ) -> str:
        pipeline_id = str(uuid.uuid4())
        duration = (end_time - start_time).total_seconds()
        record = ExecutionRecord(
            pipeline_id=pipeline_id,
            pipeline_name=pipeline_name,
            entity=entity,
            start_time=start_time,
            end_time=end_time,
            status="success" if success else "failed",
            processed_rows=processed_rows,
            failed_rows=failed_rows,
            quality_score=quality_score,
            duration_seconds=duration,
            metrics=metrics,
        )
        self._records.insert(0, record)
        if len(self._records) > 100:
            self._records = self._records[:100]
        return pipeline_id

    def get_history(self, limit: int = 20) -> List[Dict[str, Any]]:
        return [r.to_dict() for r in self._records[:limit]]

    def get_latest(self) -> Optional[Dict[str, Any]]:
        if not self._records:
            return None
        return self._records[0].to_dict()

    def get_by_id(self, pipeline_id: str) -> Optional[Dict[str, Any]]:
        for r in self._records:
            if r.pipeline_id == pipeline_id:
                return r.to_dict()
        return None

    def count(self) -> int:
        return len(self._records)


execution_history_store = ExecutionHistoryStore()
