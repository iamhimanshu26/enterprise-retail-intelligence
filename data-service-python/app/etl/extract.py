"""Data extraction layer with pluggable source interfaces."""

import io
import json
from abc import ABC, abstractmethod
from typing import Any, Dict, Optional, Union

import pandas as pd

from app.etl.config import SourceFormat
from app.etl.exceptions import ExtractError


class BaseExtractor(ABC):
    """Interface for all extract sources."""

    @abstractmethod
    def extract(self, **kwargs: Any) -> pd.DataFrame:
        ...


class CsvExtractor(BaseExtractor):
    def extract(self, content: Union[str, bytes], **kwargs: Any) -> pd.DataFrame:
        try:
            if isinstance(content, bytes):
                content = content.decode("utf-8")
            return pd.read_csv(io.StringIO(content))
        except Exception as exc:
            raise ExtractError(f"CSV extraction failed: {exc}", stage="extract")


class ExcelExtractor(BaseExtractor):
    def extract(self, content: bytes, **kwargs: Any) -> pd.DataFrame:
        try:
            return pd.read_excel(io.BytesIO(content))
        except Exception as exc:
            raise ExtractError(f"Excel extraction failed: {exc}", stage="extract")


class JsonExtractor(BaseExtractor):
    def extract(self, content: Union[str, bytes, list], **kwargs: Any) -> pd.DataFrame:
        try:
            if isinstance(content, bytes):
                content = content.decode("utf-8")
            if isinstance(content, str):
                data = json.loads(content)
            else:
                data = content
            if isinstance(data, dict) and "data" in data:
                data = data["data"]
            return pd.DataFrame(data)
        except Exception as exc:
            raise ExtractError(f"JSON extraction failed: {exc}", stage="extract")


class PostgresExtractor(BaseExtractor):
    """PostgreSQL extractor — interface prepared for Phase 4+ direct DB reads."""

    def extract(
        self,
        connection_string: Optional[str] = None,
        table_name: Optional[str] = None,
        query: Optional[str] = None,
        **kwargs: Any,
    ) -> pd.DataFrame:
        if not connection_string or not (table_name or query):
            raise ExtractError(
                "PostgreSQL extract requires connection_string and table_name or query. "
                "Use CSV/JSON exports from the synthetic generator for Sprint 4.1.",
                stage="extract",
            )
        raise ExtractError(
            "PostgreSQL extraction will be enabled in a future sprint with SQLAlchemy.",
            stage="extract",
        )


class MemoryExtractor(BaseExtractor):
    def extract(self, records: list, **kwargs: Any) -> pd.DataFrame:
        if not records:
            raise ExtractError("No in-memory records provided", stage="extract")
        return pd.DataFrame(records)


_EXTRACTORS: Dict[SourceFormat, BaseExtractor] = {
    SourceFormat.CSV: CsvExtractor(),
    SourceFormat.EXCEL: ExcelExtractor(),
    SourceFormat.JSON: JsonExtractor(),
    SourceFormat.POSTGRES: PostgresExtractor(),
    SourceFormat.MEMORY: MemoryExtractor(),
}


def extract_data(
    source_format: SourceFormat,
    content: Any = None,
    **kwargs: Any,
) -> pd.DataFrame:
    extractor = _EXTRACTORS.get(source_format)
    if not extractor:
        raise ExtractError(f"Unsupported source format: {source_format}", stage="extract")
    if source_format == SourceFormat.MEMORY:
        return extractor.extract(records=content, **kwargs)
    if source_format == SourceFormat.POSTGRES:
        return extractor.extract(**kwargs)
    if content is None:
        raise ExtractError("Content required for file-based extraction", stage="extract")
    return extractor.extract(content, **kwargs)
