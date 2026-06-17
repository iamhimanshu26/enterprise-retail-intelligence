"""Tests for standardization and normalization."""

import unittest

import pandas as pd

from app.etl.normalize import normalize_dataframe
from app.etl.standardize import standardize_dataframe


class NormalizationTest(unittest.TestCase):
    def test_store_name_standardization(self) -> None:
        df = pd.DataFrame({"store_name": ["AEON TOKYO", "  aeon tokyo  "]})
        result, report = standardize_dataframe(df)
        self.assertEqual(result.iloc[0]["store_name"], "Aeon Tokyo")

    def test_category_standardization(self) -> None:
        df = pd.DataFrame({"category": ["electronics", "ELECTRONICS"]})
        result, _ = standardize_dataframe(df)
        self.assertEqual(result.iloc[0]["category"], "Electronics")

    def test_prefecture_normalization(self) -> None:
        df = pd.DataFrame({"prefecture": ["TOKYO", "東京都", "tokyo"]})
        result, report = normalize_dataframe(df, "stores")
        self.assertTrue(all(v == "Tokyo" for v in result["prefecture"]))


if __name__ == "__main__":
    unittest.main()
