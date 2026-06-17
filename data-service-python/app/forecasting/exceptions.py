"""Forecasting engine exceptions."""


class ForecastingError(Exception):
    """Base forecasting error."""


class InsufficientForecastDataError(ForecastingError):
    """Raised when time series is too short for forecasting."""
