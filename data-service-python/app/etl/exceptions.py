"""ETL-specific exceptions."""

from __future__ import annotations


class EtlError(Exception):
    """Base exception for ETL pipeline errors."""

    def __init__(self, message: str, stage: str | None = None):
        super().__init__(message)
        self.stage = stage


class ExtractError(EtlError):
    """Raised when data extraction fails."""


class ValidationError(EtlError):
    """Raised when schema or quality validation fails critically."""

    def __init__(self, message: str, report: dict | None = None):
        super().__init__(message, stage="validate")
        self.report = report or {}


class CleanError(EtlError):
    """Raised when cleaning stage fails."""


class TransformError(EtlError):
    """Raised when transformation fails."""


class LoadError(EtlError):
    """Raised when load stage fails."""
