from __future__ import annotations

from typing import Optional

from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str
    service: str
    version: str


class ApiResponse(BaseModel):
    success: bool
    message: str
    data: Optional[HealthResponse] = None
