"""Background job management for dataset generation."""

import threading
import time
import uuid
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional

import pandas as pd

from app.generator.constants import PREVIEW_ROW_LIMIT
from app.generator.engine import GenerationEngine
from app.generator.export import export_dataset, get_export_filename


class GenerationJob:
    def __init__(self, job_id: str, config: Dict[str, Any], dataset_name: str, seed: Optional[int] = None):
        self.job_id = job_id
        self.config = config
        self.dataset_name = dataset_name
        self.seed = seed
        self.status = "pending"
        self.progress = 0.0
        self.current_step = "queued"
        self.started_at: Optional[datetime] = None
        self.completed_at: Optional[datetime] = None
        self.elapsed_seconds = 0.0
        self.estimated_remaining_seconds: Optional[float] = None
        self.error: Optional[str] = None
        self.summary: Optional[Dict[str, Any]] = None
        self.datasets: Dict[str, pd.DataFrame] = {}
        self._lock = threading.Lock()

    def _update_progress(self, step: str, progress_pct: float) -> None:
        with self._lock:
            self.current_step = step
            self.progress = round(min(progress_pct, 99.9), 1)
            if self.started_at:
                elapsed = (datetime.now(timezone.utc) - self.started_at).total_seconds()
                self.elapsed_seconds = round(elapsed, 2)
                if self.progress > 0:
                    total_estimated = elapsed / (self.progress / 100)
                    self.estimated_remaining_seconds = round(max(total_estimated - elapsed, 0), 2)

    def run(self) -> None:
        self.status = "running"
        self.started_at = datetime.now(timezone.utc)
        start_time = time.time()

        try:
            engine = GenerationEngine(self.config, seed=self.seed)

            def on_progress(step: str, pct: float) -> None:
                self._update_progress(step, pct)

            datasets = engine.run(progress_callback=on_progress)
            duration = time.time() - start_time

            with self._lock:
                self.datasets = datasets
                self.summary = engine.build_summary(datasets, duration)
                self.progress = 100.0
                self.current_step = "completed"
                self.status = "completed"
                self.completed_at = datetime.now(timezone.utc)
                self.elapsed_seconds = round(duration, 2)
                self.estimated_remaining_seconds = 0.0
        except Exception as exc:
            with self._lock:
                self.status = "failed"
                self.error = str(exc)
                self.current_step = "failed"
                self.completed_at = datetime.now(timezone.utc)

    def to_status_dict(self) -> Dict[str, Any]:
        with self._lock:
            return {
                "job_id": self.job_id,
                "dataset_name": self.dataset_name,
                "status": self.status,
                "progress": self.progress,
                "current_step": self.current_step,
                "started_at": self.started_at.isoformat() if self.started_at else None,
                "completed_at": self.completed_at.isoformat() if self.completed_at else None,
                "elapsed_seconds": self.elapsed_seconds,
                "estimated_remaining_seconds": self.estimated_remaining_seconds,
                "error": self.error,
                "summary": self.summary,
            }

    def get_preview(self, entity: str, limit: int = PREVIEW_ROW_LIMIT) -> Dict[str, Any]:
        with self._lock:
            if entity not in self.datasets:
                return {"entity": entity, "rows": [], "row_count": 0, "columns": []}
            df = self.datasets[entity]
            preview_df = df.head(limit)
            return {
                "entity": entity,
                "row_count": len(df),
                "columns": list(df.columns),
                "rows": preview_df.fillna("").astype(str).to_dict(orient="records"),
            }

    def export(self, entity: str, format: str) -> tuple:
        with self._lock:
            content, media_type, error = export_dataset(self.datasets, entity, format)
            filename = get_export_filename(entity, format)
            return content, media_type, filename, error


class JobManager:
    def __init__(self) -> None:
        self._jobs: Dict[str, GenerationJob] = {}
        self._lock = threading.Lock()

    def create_job(
        self,
        config: Dict[str, Any],
        dataset_name: str,
        seed: Optional[int] = None,
    ) -> GenerationJob:
        job_id = str(uuid.uuid4())
        job = GenerationJob(job_id, config, dataset_name, seed=seed)
        with self._lock:
            self._jobs[job_id] = job

        thread = threading.Thread(target=job.run, daemon=True)
        thread.start()
        return job

    def get_job(self, job_id: str) -> Optional[GenerationJob]:
        with self._lock:
            return self._jobs.get(job_id)

    def list_jobs(self) -> List[Dict[str, Any]]:
        with self._lock:
            return [job.to_status_dict() for job in self._jobs.values()]


job_manager = JobManager()
