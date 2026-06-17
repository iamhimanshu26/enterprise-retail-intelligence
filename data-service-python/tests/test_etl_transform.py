"""Tests for ETL transformation layer."""

import unittest

import pandas as pd

from app.etl.config import TransformConfig
from app.etl.transform import transform_dataframe


class EtlTransformTest(unittest.TestCase):
    def test_product_margin_calculation(self) -> None:
        df = pd.DataFrame(
            {"unit_price": [100.0], "cost_price": [60.0], "status": ["ACTIVE"]}
        )
        config = TransformConfig(compute_gross_margin=True)
        result, report = transform_dataframe(df, "products", config)
        self.assertIn("gross_margin", result.columns)
        self.assertIn("margin_pct", result.columns)
        self.assertEqual(float(result.iloc[0]["gross_margin"]), 40.0)


if __name__ == "__main__":
    unittest.main()
