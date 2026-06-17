"""Tests for ETL validation layer."""

import unittest

import pandas as pd

from app.etl.validate import validate_dataframe


class EtlValidateTest(unittest.TestCase):
    def test_valid_stores_pass(self) -> None:
        df = pd.DataFrame(
            {
                "store_code": ["ST-001"],
                "store_name": ["Test"],
                "region": ["KANTO"],
                "prefecture": ["Tokyo"],
                "city": ["Tokyo"],
                "address": ["1 Main"],
                "store_type": ["FLAGSHIP"],
                "opening_date": ["2020-01-01"],
                "status": ["ACTIVE"],
            }
        )
        report = validate_dataframe(df, "stores")
        self.assertTrue(report.passed)

    def test_missing_columns_fail(self) -> None:
        df = pd.DataFrame({"store_code": ["ST-001"]})
        report = validate_dataframe(df, "stores")
        self.assertFalse(report.passed)
        self.assertTrue(report.stats["missing_columns"])


if __name__ == "__main__":
    unittest.main()
