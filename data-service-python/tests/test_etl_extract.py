"""Tests for ETL extraction layer."""

import unittest

import pandas as pd

from app.etl.config import SourceFormat
from app.etl.extract import extract_data


class EtlExtractTest(unittest.TestCase):
    def test_csv_extract(self) -> None:
        csv_content = "store_code,store_name\nST-001,Test Store\n"
        df = extract_data(SourceFormat.CSV, content=csv_content)
        self.assertEqual(len(df), 1)
        self.assertEqual(df.iloc[0]["store_code"], "ST-001")

    def test_json_extract(self) -> None:
        records = [{"store_code": "ST-002", "store_name": "JSON Store"}]
        df = extract_data(SourceFormat.JSON, content=records)
        self.assertEqual(len(df), 1)

    def test_memory_extract(self) -> None:
        records = [{"product_code": "P-001", "product_name": "Item"}]
        df = extract_data(SourceFormat.MEMORY, content=records)
        self.assertEqual(len(df), 1)


if __name__ == "__main__":
    unittest.main()
