"""Tests for duplicate detection engine."""

import unittest

import pandas as pd

from app.etl.duplicates import DuplicateConfig, handle_duplicates


class DuplicateTest(unittest.TestCase):
    def test_remove_business_key_duplicates(self) -> None:
        df = pd.DataFrame({"store_code": ["A", "A", "B"], "name": ["x", "y", "z"]})
        config = DuplicateConfig(action="remove", keep="first")
        result, report = handle_duplicates(df, config, "store_code")
        self.assertEqual(len(result), 2)
        self.assertEqual(report.rows_removed, 1)


if __name__ == "__main__":
    unittest.main()
