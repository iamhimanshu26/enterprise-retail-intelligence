"""Executive intelligence exceptions."""


class IntelligenceError(Exception):
    """Base error for executive intelligence modules."""


class InsufficientIntelligenceDataError(IntelligenceError):
    """Raised when dataset is too small for intelligence analysis."""
