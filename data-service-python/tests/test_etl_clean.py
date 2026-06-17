"""Tests for ETL cleaning layer."""

import unittest

import pandas as pd

from app.etl.clean import clean_dataframe
from app.etl.config import CleanConfig


class EtlCleanTest(unittest.TestCase):
    def test_trim_and_dedupe(self) -> None:
        df = pd.DataFrame(
            {
                "store_code": ["ST-001", "ST-001", "ST-002"],
                "store_name": ["  Alpha  ", "Dup", "Beta"],
            }
        )
        config = CleanConfig(remove_duplicates=True, trim_whitespace=True)
        cleaned, report = clean_dataframe(df, config, primary_key="store_code")
        self.assertEqual(len(cleaned), 2)
        self.assertEqual(report.duplicates_removed, 1)
        self.assertGreater(report.strings_trimmed, 0)


if __name__ == "__main__":
    unittest.main()
