"""Synthetic data generator API endpoints."""

from datetime import date

from fastapi import APIRouter, HTTPException
from fastapi.responses import Response

from app.generator.job_manager import job_manager
from app.models.generator_schemas import (
    ApiResponse,
    DataQualityConfig,
    DefaultsResponse,
    EntityCountsConfig,
    GenerationConfigRequest,
    GenerationStartResponse,
    GenerationStatusResponse,
    PreviewResponse,
    SimulationConfig,
)

router = APIRouter(prefix="/generator")

ENTITY_NAMES = [
    "stores",
    "suppliers",
    "products",
    "customers",
    "inventory",
    "promotions",
    "sales_transactions",
    "sales_transaction_items",
    "returns",
]


@router.get("/defaults", response_model=ApiResponse)
async def get_defaults() -> ApiResponse:
    today = date.today()
    start = date(today.year - 1, 1, 1)
    defaults = DefaultsResponse(
        counts=EntityCountsConfig(),
        simulation=SimulationConfig(start_date=start, end_date=today),
        data_quality=DataQualityConfig(),
        entities=ENTITY_NAMES,
    )
    return ApiResponse(success=True, message="Default generator configuration", data=defaults)


@router.post("/start", response_model=ApiResponse)
async def start_generation(request: GenerationConfigRequest) -> ApiResponse:
    config = {
        "counts": request.counts.model_dump(),
        "simulation": {
            **request.simulation.model_dump(),
            "start_date": request.simulation.start_date.isoformat(),
            "end_date": request.simulation.end_date.isoformat(),
        },
        "data_quality": request.data_quality.model_dump(),
    }

    job = job_manager.create_job(config, request.dataset_name, seed=request.seed)
    response = GenerationStartResponse(
        job_id=job.job_id,
        dataset_name=job.dataset_name,
        status=job.status,
    )
    return ApiResponse(success=True, message="Generation job started", data=response)


@router.get("/jobs", response_model=ApiResponse)
async def list_jobs() -> ApiResponse:
    jobs = job_manager.list_jobs()
    return ApiResponse(success=True, message="Generation jobs", data=jobs)


@router.get("/jobs/{job_id}", response_model=ApiResponse)
async def get_job_status(job_id: str) -> ApiResponse:
    job = job_manager.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    status = GenerationStatusResponse(**job.to_status_dict())
    return ApiResponse(success=True, message="Job status", data=status)


@router.get("/jobs/{job_id}/preview/{entity}", response_model=ApiResponse)
async def preview_entity(job_id: str, entity: str) -> ApiResponse:
    job = job_manager.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if entity not in ENTITY_NAMES:
        raise HTTPException(status_code=400, detail=f"Invalid entity: {entity}")

    preview = PreviewResponse(**job.get_preview(entity))
    return ApiResponse(success=True, message="Preview data", data=preview)


@router.get("/jobs/{job_id}/export/{entity}/{format}")
async def export_entity(job_id: str, entity: str, format: str) -> Response:
    if entity != "all" and entity not in ENTITY_NAMES:
        raise HTTPException(status_code=400, detail=f"Invalid entity: {entity}")

    job = job_manager.get_job(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    if job.status != "completed":
        raise HTTPException(status_code=400, detail="Job is not completed yet")

    content, media_type, filename, error = job.export(entity, format)
    if error:
        raise HTTPException(status_code=400, detail=error)

    return Response(
        content=content,
        media_type=media_type,
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )
