#!/usr/bin/env python3
"""Verify Python dependencies and run synthetic generator smoke tests."""

import subprocess
import sys


def main() -> int:
    print("=== Retail Intelligence — Generator verification ===\n")

    print("1. Checking dependency imports...")
    try:
        import duckdb
        import faker
        import numpy
        import openpyxl
        import pandas
        import polars
        from fastapi.testclient import TestClient

        import importlib.metadata

        print(f"   numpy {numpy.__version__}")
        print(f"   pandas {pandas.__version__}")
        print(f"   polars {polars.__version__}")
        print(f"   duckdb {duckdb.__version__}")
        print(f"   faker {importlib.metadata.version('Faker')}")
        print(f"   openpyxl {openpyxl.__version__}")
    except ImportError as exc:
        print(f"   FAILED: {exc}")
        print("   Run: pip install -r requirements.txt")
        return 1

    print("\n2. Running data service smoke tests (generator + ETL)...")
    result = subprocess.run(
        [sys.executable, "-m", "unittest", "discover", "-s", "tests", "-v"],
        check=False,
    )
    if result.returncode != 0:
        print("\nVerification FAILED.")
        return result.returncode

    print("\nVerification PASSED — data service ready locally.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
