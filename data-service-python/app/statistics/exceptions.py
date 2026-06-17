"""Statistics engine exceptions."""


class StatisticsError(Exception):
    def __init__(self, message: str, module: str = "statistics") -> None:
        self.message = message
        self.module = module
        super().__init__(message)


class InsufficientDataError(StatisticsError):
    pass
