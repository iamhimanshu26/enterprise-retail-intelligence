"""Tests for business rule validation."""

import unittest

import pandas as pd

from app.etl.business_rules import validate_business_rules


class BusinessRuleTest(unittest.TestCase):
    def test_revenue_gte_cost(self) -> None:
        df = pd.DataFrame({"unit_price": [100, 50], "cost_price": [80, 60]})
        report = validate_business_rules(df, "products")
        self.assertGreater(report.total_violations, 0)

    def test_future_transaction_date(self) -> None:
        df = pd.DataFrame({"transaction_date": ["2099-01-01"]})
        report = validate_business_rules(df, "sales_transactions")
        self.assertGreater(report.total_violations, 0)


if __name__ == "__main__":
    unittest.main()
