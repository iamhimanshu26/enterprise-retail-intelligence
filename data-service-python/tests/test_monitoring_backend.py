"""Tests for enterprise monitoring backend — Phase 8.1."""

import unittest

from app.monitoring.engine import run_monitoring_report
from app.monitoring.execution_tracker import execution_tracker
from app.monitoring.failure_engine import failure_engine
from app.monitoring.metrics_engine import metrics_engine
from app.monitoring.pipeline_registry import pipeline_registry
from app.monitoring.quality_monitor import quality_monitor
from app.monitoring.retry_engine import retry_engine
from app.monitoring.service_health import service_health_engine
from app.monitoring.status_engine import status_engine


class PipelineRegistryTest(unittest.TestCase):
    def test_registry_lists_eight_pipelines(self) -> None:
        pipelines = pipeline_registry.list_pipelines()
        self.assertEqual(len(pipelines), 8)
        ids = {p.pipeline_id for p in pipelines}
        self.assertIn("forecasting-engine", ids)
        self.assertIn("etl-pipeline", ids)


class ExecutionTrackerTest(unittest.TestCase):
    def test_get_executions_returns_records(self) -> None:
        executions = execution_tracker.get_executions(limit=10)
        self.assertGreater(len(executions), 0)
        first = executions[0]
        self.assertTrue(first.execution_id)
        self.assertIn(
            first.status,
            ("queued", "running", "success", "warning", "failed", "cancelled"),
        )


class QualityMonitorTest(unittest.TestCase):
    def test_quality_dimensions_and_status(self) -> None:
        quality = quality_monitor.build_quality_summary()
        self.assertEqual(len(quality.dimensions), 6)
        self.assertIn(quality.quality_status, ("Excellent", "Good", "Warning", "Critical"))
        self.assertGreater(quality.overall_quality_index, 0)


class MetricsEngineTest(unittest.TestCase):
    def test_metrics_summary(self) -> None:
        metrics = metrics_engine.build_metrics()
        self.assertGreaterEqual(metrics.total_executions, 1)
        self.assertGreaterEqual(metrics.success_rate, 0)
        self.assertGreater(metrics.longest_runtime, 0)
        self.assertGreater(metrics.throughput_placeholder, 0)


class FailureEngineTest(unittest.TestCase):
    def test_failure_taxonomy(self) -> None:
        failures = failure_engine.build_failures()
        self.assertGreater(len(failures), 0)
        categories = {f.category for f in failures}
        self.assertTrue(
            categories.issubset(
                {
                    "schema_error",
                    "validation_error",
                    "transformation_error",
                    "warehouse_load_error",
                    "statistics_error",
                    "analytics_error",
                    "forecasting_error",
                    "unknown_error",
                }
            )
        )


class RetryEngineTest(unittest.TestCase):
    def test_retry_metadata(self) -> None:
        retries = retry_engine.build_retries()
        self.assertGreater(len(retries), 0)
        idle = retries[0]
        self.assertTrue(hasattr(idle, "retry_limit"))
        self.assertTrue(hasattr(idle, "retry_reason"))


class ServiceHealthTest(unittest.TestCase):
    def test_service_health_cards(self) -> None:
        cards = service_health_engine.build_health_cards()
        self.assertGreaterEqual(len(cards), 7)
        score = service_health_engine.platform_health_score(cards)
        self.assertGreater(score, 0)


class StatusEngineTest(unittest.TestCase):
    def test_status_snapshots(self) -> None:
        snapshots = status_engine.build_status_snapshots()
        self.assertEqual(len(snapshots), 8)
        self.assertTrue(snapshots[0].health_indicator)


class MonitoringOrchestratorTest(unittest.TestCase):
    def test_run_monitoring_report(self) -> None:
        report = run_monitoring_report()
        self.assertEqual(report.overview.status, "monitoring_backend_ready")
        self.assertEqual(len(report.pipeline_registry), 8)
        self.assertEqual(len(report.pipeline_modules), 8)
        self.assertGreaterEqual(len(report.lineage), 8)
        self.assertIsNotNone(report.lineage_graph)
        self.assertGreater(report.operational_kpis.platform_health_score, 0)


if __name__ == "__main__":
    unittest.main()
