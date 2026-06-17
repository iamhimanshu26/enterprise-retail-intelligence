"""ETL pipeline API endpoints — Sprint 4.1 foundation + 4.2 cleaning engine."""

from fastapi import APIRouter

from app.etl.cleaning_pipeline import CleaningTransformationPipeline, run_cleaning_sample
from app.etl.config import ENTITY_SCHEMAS, PipelineConfig, get_cleaning_engine_stages, get_pipeline_stages
from app.etl.pipeline import EtlPipeline, run_sample_pipeline
from app.models.etl_schemas import ApiResponse, EtlOverviewResponse, EtlRunRequest, EtlRunResponse

router = APIRouter(prefix="/etl")


@router.get("/overview", response_model=ApiResponse)
async def get_etl_overview() -> ApiResponse:
    overview = EtlOverviewResponse()
    return ApiResponse(success=True, message="ETL pipeline overview", data=overview)


@router.get("/stages", response_model=ApiResponse)
async def get_pipeline_stages_endpoint() -> ApiResponse:
    stages = get_pipeline_stages()
    return ApiResponse(success=True, message="Pipeline stages", data=stages)


@router.get("/schemas", response_model=ApiResponse)
async def get_entity_schemas() -> ApiResponse:
    return ApiResponse(success=True, message="Entity validation schemas", data=ENTITY_SCHEMAS)


@router.get("/config/defaults", response_model=ApiResponse)
async def get_default_config() -> ApiResponse:
    defaults = PipelineConfig()
    return ApiResponse(success=True, message="Default pipeline configuration", data=defaults)


@router.get("/cleaning/stages", response_model=ApiResponse)
async def get_cleaning_stages_endpoint() -> ApiResponse:
    stages = get_cleaning_engine_stages()
    return ApiResponse(success=True, message="Cleaning engine stages", data=stages)


@router.post("/run/sample", response_model=ApiResponse)
async def run_sample_etl() -> ApiResponse:
    result = run_sample_pipeline()
    response = EtlRunResponse(
        success=result["success"],
        report=result.get("report", {}),
        entity=result.get("entity"),
        rows_in_output=result.get("rows_in_output"),
        quality_score=result.get("quality_score"),
        error=result.get("error"),
    )
    return ApiResponse(
        success=result["success"],
        message="Sample ETL pipeline executed",
        data=response,
    )


@router.post("/run", response_model=ApiResponse)
async def run_etl(request: EtlRunRequest) -> ApiResponse:
    if request.use_sample:
        result = run_cleaning_sample() if request.use_cleaning_engine else run_sample_pipeline()
    else:
        config = request.config or PipelineConfig()
        if config.use_cleaning_engine:
            pipeline = CleaningTransformationPipeline(config)
            result = pipeline.run()
        else:
            pipeline = EtlPipeline(config)
            result = pipeline.run()

    response = EtlRunResponse(
        success=result["success"],
        report=result.get("report", {}),
        entity=result.get("entity"),
        rows_in_output=result.get("rows_in_output"),
        quality_score=result.get("quality_score"),
        error=result.get("error"),
    )
    return ApiResponse(
        success=result["success"],
        message="ETL pipeline executed",
        data=response,
    )
