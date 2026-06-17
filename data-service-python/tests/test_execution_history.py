"""Tests for ETL execution history."""

import unittest
from datetime import datetime, timezone

from app.etl.execution_history import ExecutionHistoryStore


class ExecutionHistoryTest(unittest.TestCase):
    def test_record_and_retrieve(self):
        store = ExecutionHistoryStore()
        start = datetime.now(timezone.utc)
        end = datetime.now(timezone.utc)
        pid = store.record(
            pipeline_name="test_pipeline",
            entity="stores",
            start_time=start,
            end_time=end,
            success=True,
            processed_rows=100,
            failed_rows=2,
            quality_score=97.5,
        )
        self.assertIsNotNone(pid)
        history = store.get_history()
        self.assertEqual(len(history), 1)
        self.assertEqual(history[0]["pipeline_id"], pid)
        self.assertEqual(history[0]["processed_rows"], 100)

    def test_get_latest(self):
        store = ExecutionHistoryStore()
        start = datetime.now(timezone.utc)
        store.record("p1", "stores", start, start, True, 50, 0, 95.0)
        store.record("p2", "products", start, start, True, 200, 1, 98.0)
        latest = store.get_latest()
        self.assertEqual(latest["pipeline_name"], "p2")


if __name__ == "__main__":
    unittest.main()
