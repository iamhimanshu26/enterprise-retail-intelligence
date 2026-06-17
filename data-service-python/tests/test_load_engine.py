"""Tests for enterprise load engine."""

import unittest

import pandas as pd

from app.etl.config import LoadStrategy
from app.etl.load_engine import execute_load


class LoadEngineTest(unittest.TestCase):
    def test_full_load(self):
        df = pd.DataFrame({"id": [1, 2, 3]})
        loaded, result = execute_load(df, "test_table", LoadStrategy.FULL)
        self.assertEqual(len(loaded), 3)
        self.assertEqual(result.inserted, 3)

    def test_append_load(self):
        existing = pd.DataFrame({"id": [1, 2]})
        new = pd.DataFrame({"id": [3, 4]})
        loaded, result = execute_load(new, "test_table", LoadStrategy.APPEND, existing)
        self.assertEqual(len(loaded), 4)
        self.assertEqual(result.inserted, 2)

    def test_replace_load(self):
        existing = pd.DataFrame({"id": [1, 2]})
        new = pd.DataFrame({"id": [5]})
        loaded, result = execute_load(new, "test_table", LoadStrategy.REPLACE, existing)
        self.assertEqual(len(loaded), 1)
        self.assertEqual(result.inserted, 1)

    def test_incremental_load(self):
        existing = pd.DataFrame({"store_code": ["A", "B"]})
        new = pd.DataFrame({"store_code": ["B", "C"], "name": ["updated", "new"]})
        loaded, result = execute_load(
            new, "dim_store", LoadStrategy.INCREMENTAL, existing, "store_code"
        )
        self.assertEqual(result.inserted, 1)
        self.assertEqual(result.updated, 1)
        self.assertEqual(len(loaded), 3)


if __name__ == "__main__":
    unittest.main()
