"""Export synthetic datasets to multiple formats."""

import io
from typing import Dict, Optional, Tuple

import pandas as pd

SUPPORTED_FORMATS = {"csv", "json", "xlsx", "parquet"}


def estimate_size_bytes(datasets: Dict[str, pd.DataFrame]) -> int:
    total = 0
    for df in datasets.values():
        if not df.empty:
            total += int(df.memory_usage(deep=True).sum())
    return total


def export_dataset(
    datasets: Dict[str, pd.DataFrame],
    entity: str,
    format: str,
) -> Tuple[Optional[bytes], str, Optional[str]]:
    """Export a single entity or combined bundle. Returns (content, media_type, error)."""
    format = format.lower()
    if format not in SUPPORTED_FORMATS:
        return None, "", f"Unsupported format: {format}"

    if entity == "all":
        combined = _combine_datasets(datasets)
        df = combined
        filename_entity = "retail_dataset"
    else:
        if entity not in datasets:
            return None, "", f"Entity not found: {entity}"
        df = datasets[entity]
        filename_entity = entity

    if df.empty:
        return None, "", "No data available for export"

    if format == "parquet":
        return None, "", "Parquet export is planned for a future release — use CSV, JSON, or Excel"

    buffer = io.BytesIO()

    if format == "csv":
        df.to_csv(buffer, index=False)
        media_type = "text/csv"
    elif format == "json":
        buffer.write(df.to_json(orient="records", date_format="iso").encode("utf-8"))
        media_type = "application/json"
    elif format == "xlsx":
        with pd.ExcelWriter(buffer, engine="openpyxl") as writer:
            if entity == "all":
                for name, entity_df in datasets.items():
                    if not entity_df.empty:
                        entity_df.to_excel(writer, sheet_name=name[:31], index=False)
            else:
                df.to_excel(writer, sheet_name=filename_entity[:31], index=False)
        media_type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    else:
        return None, "", f"Unsupported format: {format}"

    buffer.seek(0)
    return buffer.read(), media_type, None


def get_export_filename(entity: str, format: str) -> str:
    return f"{entity}_{format}.{'xlsx' if format == 'xlsx' else format}"


def _combine_datasets(datasets: Dict[str, pd.DataFrame]) -> pd.DataFrame:
    parts = []
    for name, df in datasets.items():
        if not df.empty:
            tagged = df.copy()
            tagged.insert(0, "_entity", name)
            parts.append(tagged)
    if not parts:
        return pd.DataFrame()
    return pd.concat(parts, ignore_index=True)
