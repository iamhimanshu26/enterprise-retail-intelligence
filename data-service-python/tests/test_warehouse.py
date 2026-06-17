"""Tests for analytics warehouse layer."""

import unittest

import pandas as pd

from app.etl.config import LoadStrategy, LoadTarget
from app.etl.warehouse import (
    build_dim_date,
    build_dim_table,
    get_warehouse_summary,
    load_to_warehouse,
)


class WarehouseTest(unittest.TestCase):
    def test_build_dim_store(self):
        df = pd.DataFrame({
            "store_code": ["ST-001"],
            "store_name": ["Tokyo Store"],
            "region": ["KANTO"],
        })
        dim = build_dim_table("stores", df)
        self.assertIn("store_key", dim.columns)

    def test_build_dim_date(self):
        df = pd.DataFrame({"opening_date": ["2020-04-01", "2021-03-10"]})
        dates = build_dim_date(df)
        self.assertEqual(len(dates), 2)
        self.assertIn("date_key", dates.columns)

    def test_load_stores_to_warehouse(self):
        df = pd.DataFrame({
            "store_code": ["ST-001", "ST-002"],
            "store_name": ["Store A", "Store B"],
            "region": ["KANTO", "KANSAI"],
            "prefecture": ["Tokyo", "Osaka"],
            "city": ["Tokyo", "Osaka"],
            "address": ["1 St", "2 Ave"],
            "store_type": ["FLAGSHIP", "STANDARD"],
            "opening_date": ["2020-01-01", "2019-06-15"],
            "status": ["ACTIVE", "ACTIVE"],
        })
        report = load_to_warehouse(
            {"stores": df},
            target=LoadTarget.MEMORY,
            strategy=LoadStrategy.REPLACE,
        )
        self.assertGreater(report.total_inserted, 0)
        self.assertIn("dim_store", report.tables_loaded)

    def test_warehouse_summary(self):
        summary = get_warehouse_summary()
        self.assertIn("stores", summary)
        self.assertIn("products", summary)
        self.assertGreater(summary["stores"], 0)


if __name__ == "__main__":
    unittest.main()
