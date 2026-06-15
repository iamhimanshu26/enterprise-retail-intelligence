from fastapi import APIRouter, Depends

from app.core.config import Settings
from app.core.dependencies import get_settings
from app.models.schemas import ApiResponse, HealthResponse

router = APIRouter()


@router.get("/health", response_model=ApiResponse)
async def health_check(settings: Settings = Depends(get_settings)) -> ApiResponse:
    return ApiResponse(
        success=True,
        message="Service is healthy",
        data=HealthResponse(
            status="UP",
            service="retail-intelligence-data-service",
            version=settings.app_version,
        ),
    )
