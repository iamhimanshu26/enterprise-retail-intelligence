"""Transformation audit log for enterprise traceability."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional


class AuditLog:
    def __init__(self) -> None:
        self.entries: List[Dict[str, Any]] = []

    def record(
        self,
        column: str,
        original: Any,
        transformed: Any,
        reason: str,
        row_index: Optional[int] = None,
    ) -> None:
        self.entries.append(
            {
                "column": column,
                "original": str(original) if original is not None else None,
                "transformed": str(transformed) if transformed is not None else None,
                "reason": reason,
                "row_index": row_index,
                "timestamp": datetime.now(timezone.utc).isoformat(),
            }
        )

    def record_batch(self, column: str, count: int, reason: str) -> None:
        if count > 0:
            self.entries.append(
                {
                    "column": column,
                    "rows_affected": count,
                    "reason": reason,
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                }
            )

    def to_dict(self) -> Dict[str, Any]:
        return {"entry_count": len(self.entries), "entries": self.entries[:500]}

    def to_list(self) -> List[Dict[str, Any]]:
        return self.entries
