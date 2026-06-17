"""Load layer abstractions for PostgreSQL and DuckDB targets."""

from abc import ABC, abstractmethod
from typing import Any, Dict, Optional

import pandas as pd

from app.etl.config import LoadConfig, LoadTarget
from app.etl.exceptions import LoadError


class BaseLoader(ABC):
    @abstractmethod
    def load(self, df: pd.DataFrame, table_name: str, **kwargs: Any) -> Dict[str, Any]:
        ...


class PostgresLoader(BaseLoader):
    """PostgreSQL loader interface — full write path in future sprint."""

    def load(
        self,
        df: pd.DataFrame,
        table_name: str,
        connection_string: Optional[str] = None,
        dry_run: bool = False,
        **kwargs: Any,
    ) -> Dict[str, Any]:
        if dry_run:
            return {
                "target": "postgres",
                "table": table_name,
                "rows_prepared": len(df),
                "status": "dry_run",
                "message": "PostgreSQL load prepared — SQLAlchemy write path in next sprint",
            }
        raise LoadError(
            "PostgreSQL load requires SQLAlchemy integration (planned). Use dry_run=True or DuckDB target.",
            stage="load",
        )


class DuckDBLoader(BaseLoader):
    def __init__(self) -> None:
        self._connection = None
        self._tables: Dict[str, pd.DataFrame] = {}

    def load(self, df: pd.DataFrame, table_name: str, **kwargs: Any) -> Dict[str, Any]:
        try:
            import duckdb

            if self._connection is None:
                self._connection = duckdb.connect(database=":memory:")
            self._connection.register("_etl_frame", df)
            self._connection.execute(f"CREATE OR REPLACE TABLE {table_name} AS SELECT * FROM _etl_frame")
            self._tables[table_name] = df.copy()
            count = self._connection.execute(f"SELECT COUNT(*) FROM {table_name}").fetchone()[0]
            return {
                "target": "duckdb",
                "table": table_name,
                "rows_loaded": int(count),
                "status": "success",
            }
        except ImportError:
            self._tables[table_name] = df.copy()
            return {
                "target": "memory",
                "table": table_name,
                "rows_loaded": len(df),
                "status": "success",
                "message": "DuckDB not available — stored in memory fallback",
            }
        except Exception as exc:
            raise LoadError(f"DuckDB load failed: {exc}", stage="load")

    def get_table(self, table_name: str) -> Optional[pd.DataFrame]:
        return self._tables.get(table_name)


class MemoryLoader(BaseLoader):
    def __init__(self) -> None:
        self.tables: Dict[str, pd.DataFrame] = {}

    def load(self, df: pd.DataFrame, table_name: str, **kwargs: Any) -> Dict[str, Any]:
        self.tables[table_name] = df.copy()
        return {
            "target": "memory",
            "table": table_name,
            "rows_loaded": len(df),
            "status": "success",
        }


_LOADERS: Dict[LoadTarget, BaseLoader] = {
    LoadTarget.POSTGRES: PostgresLoader(),
    LoadTarget.DUCKDB: DuckDBLoader(),
    LoadTarget.MEMORY: MemoryLoader(),
}


def load_dataframe(
    df: pd.DataFrame,
    table_name: str,
    config: LoadConfig,
    connection_string: Optional[str] = None,
) -> Dict[str, Any]:
    loader = _LOADERS.get(config.target)
    if not loader:
        raise LoadError(f"Unsupported load target: {config.target}", stage="load")
    return loader.load(
        df,
        table_name,
        connection_string=connection_string,
        dry_run=config.dry_run,
    )
