from fastapi import APIRouter

from app.api.v1.analytics import router as analytics_router
from app.api.v1.etl import router as etl_router
from app.api.v1.generator import router as generator_router
from app.api.v1.forecasting import router as forecasting_router
from app.api.v1.health import router as health_router
from app.api.v1.intelligence import router as intelligence_router
from app.api.v1.monitoring import router as monitoring_router
from app.api.v1.statistics import router as statistics_router

api_router = APIRouter()
api_router.include_router(health_router, tags=["Health"])
api_router.include_router(generator_router, tags=["Synthetic Data Generator"])
api_router.include_router(etl_router, tags=["ETL Pipeline"])
api_router.include_router(statistics_router, tags=["Statistics Engine"])
api_router.include_router(analytics_router, tags=["Business Analytics Engine"])
api_router.include_router(intelligence_router, tags=["Executive Intelligence Platform"])
api_router.include_router(forecasting_router, tags=["Forecasting Engine"])
api_router.include_router(monitoring_router, tags=["Pipeline Monitoring"])
