"""Business Analytics API — Sprint 5.2."""

from fastapi import APIRouter

from app.analytics.customer_analytics import compute_customer_analytics
from app.analytics.data import load_analytics_data
from app.analytics.engine import BusinessAnalyticsEngine, run_sample_analytics
from app.analytics.inventory_analytics import compute_inventory_analytics
from app.analytics.kpi import compute_kpi_analytics
from app.analytics.models import AnalyticsOverview
from app.analytics.product_analytics import compute_product_analytics
from app.analytics.promotion_analytics import compute_promotion_analytics
from app.analytics.sales_analytics import compute_sales_analytics
from app.analytics.store_analytics import compute_store_analytics
from app.analytics.supplier_analytics import compute_supplier_analytics
from app.models.etl_schemas import ApiResponse

router = APIRouter(prefix="/analytics")

OVERVIEW = AnalyticsOverview(
    modules=[
        "kpi", "sales", "stores", "products", "customers",
        "inventory", "suppliers", "promotions", "performance",
    ],
)


def _engine() -> BusinessAnalyticsEngine:
    df, source = load_analytics_data()
    return BusinessAnalyticsEngine(df=df, data_source=source)


@router.get("/overview", response_model=ApiResponse)
async def get_analytics_overview() -> ApiResponse:
    return ApiResponse(success=True, message="Business analytics overview", data=OVERVIEW)


@router.get("/kpis", response_model=ApiResponse)
async def get_kpis() -> ApiResponse:
    eng = _engine()
    return ApiResponse(success=True, message="KPI analytics", data=compute_kpi_analytics(eng.df))


@router.get("/sales", response_model=ApiResponse)
async def get_sales() -> ApiResponse:
    eng = _engine()
    return ApiResponse(success=True, message="Sales analytics", data=compute_sales_analytics(eng.df))


@router.get("/stores", response_model=ApiResponse)
async def get_stores() -> ApiResponse:
    eng = _engine()
    return ApiResponse(success=True, message="Store analytics", data=compute_store_analytics(eng.df))


@router.get("/products", response_model=ApiResponse)
async def get_products() -> ApiResponse:
    eng = _engine()
    return ApiResponse(success=True, message="Product analytics", data=compute_product_analytics(eng.df))


@router.get("/customers", response_model=ApiResponse)
async def get_customers() -> ApiResponse:
    eng = _engine()
    return ApiResponse(success=True, message="Customer analytics", data=compute_customer_analytics(eng.df))


@router.get("/inventory", response_model=ApiResponse)
async def get_inventory() -> ApiResponse:
    eng = _engine()
    return ApiResponse(success=True, message="Inventory analytics", data=compute_inventory_analytics(eng.df))


@router.get("/suppliers", response_model=ApiResponse)
async def get_suppliers() -> ApiResponse:
    eng = _engine()
    return ApiResponse(success=True, message="Supplier analytics", data=compute_supplier_analytics(eng.df))


@router.get("/promotions", response_model=ApiResponse)
async def get_promotions() -> ApiResponse:
    eng = _engine()
    return ApiResponse(success=True, message="Promotion analytics", data=compute_promotion_analytics(eng.df))


@router.post("/run-sample", response_model=ApiResponse)
async def run_sample() -> ApiResponse:
    report = run_sample_analytics()
    return ApiResponse(
        success=True,
        message="Business analytics report generated",
        data=report.model_dump(),
    )
