"""Pydantic models for business analytics API."""

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field


class AnalyticsOverview(BaseModel):
    sprint: str = "5.2"
    status: str = "business_analytics_ready"
    modules: List[str] = Field(default_factory=list)
    data_source: str = "sample"


class KpiMetric(BaseModel):
    id: str
    label: str
    value: float
    unit: str = ""
    change_pct: Optional[float] = None


class KpiAnalytics(BaseModel):
    metrics: List[KpiMetric] = Field(default_factory=list)


class BreakdownRow(BaseModel):
    dimension: str
    value: float
    count: int = 0
    percentage: Optional[float] = None


class SalesAnalytics(BaseModel):
    by_day: List[BreakdownRow] = Field(default_factory=list)
    by_week: List[BreakdownRow] = Field(default_factory=list)
    by_month: List[BreakdownRow] = Field(default_factory=list)
    by_quarter: List[BreakdownRow] = Field(default_factory=list)
    by_year: List[BreakdownRow] = Field(default_factory=list)
    by_region: List[BreakdownRow] = Field(default_factory=list)
    by_store: List[BreakdownRow] = Field(default_factory=list)
    by_category: List[BreakdownRow] = Field(default_factory=list)
    by_payment_method: List[BreakdownRow] = Field(default_factory=list)
    top_sales_days: List[BreakdownRow] = Field(default_factory=list)
    low_sales_days: List[BreakdownRow] = Field(default_factory=list)
    growth_trend_pct: Optional[float] = None


class StoreRankRow(BaseModel):
    store_code: str
    revenue: float
    orders: int
    profit: float
    average_order_value: float
    growth_pct: Optional[float] = None
    performance_score: float = 0.0


class StoreAnalytics(BaseModel):
    rankings: List[StoreRankRow] = Field(default_factory=list)
    high_performers: List[str] = Field(default_factory=list)
    underperformers: List[str] = Field(default_factory=list)


class ProductRankRow(BaseModel):
    product_code: str
    revenue: float
    units_sold: int
    profit: float
    return_rate_pct: float
    contribution_pct: float
    performance_score: float = 0.0


class ProductAnalytics(BaseModel):
    top_by_revenue: List[ProductRankRow] = Field(default_factory=list)
    top_by_units: List[ProductRankRow] = Field(default_factory=list)
    slow_moving: List[str] = Field(default_factory=list)
    high_return: List[str] = Field(default_factory=list)
    category_performance: List[BreakdownRow] = Field(default_factory=list)
    brand_performance: List[BreakdownRow] = Field(default_factory=list)


class CustomerAnalytics(BaseModel):
    new_customers: int = 0
    returning_customers: int = 0
    segments: List[BreakdownRow] = Field(default_factory=list)
    membership_distribution: List[BreakdownRow] = Field(default_factory=list)
    revenue_contribution: List[BreakdownRow] = Field(default_factory=list)
    average_spend: float = 0.0
    purchase_frequency: float = 0.0
    clv_placeholder: Optional[float] = None
    segment_score: float = 0.0


class InventoryItem(BaseModel):
    product_code: str
    stock_on_hand: int
    reorder_level: int
    inventory_value: float
    risk_score: float
    status: str


class InventoryAnalytics(BaseModel):
    inventory_value: float = 0.0
    low_stock_count: int = 0
    overstock_count: int = 0
    out_of_stock_count: int = 0
    fast_moving: List[str] = Field(default_factory=list)
    slow_moving: List[str] = Field(default_factory=list)
    reorder_candidates: List[InventoryItem] = Field(default_factory=list)
    stock_risk_score: float = 0.0


class SupplierRankRow(BaseModel):
    supplier_id: str
    supplier_name: str
    product_count: int
    revenue_contribution: float
    reliability_score: float
    risk_score: float


class SupplierAnalytics(BaseModel):
    rankings: List[SupplierRankRow] = Field(default_factory=list)
    delayed_suppliers: List[str] = Field(default_factory=list)


class PromotionAnalytics(BaseModel):
    promotional_revenue: float = 0.0
    non_promotional_revenue: float = 0.0
    discount_effectiveness_pct: float = 0.0
    category_performance: List[BreakdownRow] = Field(default_factory=list)
    region_performance: List[BreakdownRow] = Field(default_factory=list)
    promotion_roi_placeholder: Optional[float] = None


class PerformanceScores(BaseModel):
    store_scores: Dict[str, float] = Field(default_factory=dict)
    product_scores: Dict[str, float] = Field(default_factory=dict)
    customer_segment_score: float = 0.0
    inventory_risk_score: float = 0.0
    supplier_risk_score: float = 0.0


class BusinessAnalyticsReport(BaseModel):
    overview: AnalyticsOverview
    kpis: KpiAnalytics
    sales: SalesAnalytics
    stores: StoreAnalytics
    products: ProductAnalytics
    customers: CustomerAnalytics
    inventory: InventoryAnalytics
    suppliers: SupplierAnalytics
    promotions: PromotionAnalytics
    performance: PerformanceScores
    execution_time_seconds: float = 0.0
