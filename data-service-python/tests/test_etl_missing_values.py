"""Tests for missing value engine."""

import unittest

import pandas as pd

from app.etl.audit_log import AuditLog
from app.etl.missing_values import MissingValueConfig, detect_missing, handle_missing_values


class MissingValueTest(unittest.TestCase):
    def test_detect_missing(self) -> None:
        df = pd.DataFrame({"a": [1, None, ""], "b": ["x", "nan", "y"]})
        stats = detect_missing(df)
        self.assertGreater(stats["total_missing_cells"], 0)

    def test_mark_strategy_tracks_without_removal(self) -> None:
        df = pd.DataFrame({"store_code": ["A", "B"], "city": [None, "Tokyo"]})
        config = MissingValueConfig(strategy="mark")
        audit = AuditLog()
        result, report = handle_missing_values(df, config, audit)
        self.assertEqual(len(result), 2)
        self.assertEqual(report.rows_removed, 0)


if __name__ == "__main__":
    unittest.main()
