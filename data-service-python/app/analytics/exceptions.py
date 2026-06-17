"""Business analytics exceptions."""


class AnalyticsError(Exception):
    def __init__(self, message: str, module: str = "analytics") -> None:
        self.message = message
        self.module = module
        super().__init__(message)
