"""Monitoring module exceptions — Phase 8.1."""


class MonitoringError(Exception):
    """Base error for monitoring subsystem."""


class PipelineNotFoundError(MonitoringError):
    def __init__(self, pipeline_id: str) -> None:
        super().__init__(f"Pipeline not found: {pipeline_id}")
        self.pipeline_id = pipeline_id


class ExecutionNotFoundError(MonitoringError):
    def __init__(self, execution_id: str) -> None:
        super().__init__(f"Execution not found: {execution_id}")
        self.execution_id = execution_id
