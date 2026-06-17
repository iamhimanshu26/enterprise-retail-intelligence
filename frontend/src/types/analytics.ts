export interface AnalyticsOverview {
  sprint: string
  status: string
  modules: string[]
  data_source: string
}

export interface AnalyticsKpiMetric {
  id: string
  label: string
  value: number
  unit: string
  change_pct?: number | null
}

export interface AnalyticsKpiAnalytics {
  metrics: AnalyticsKpiMetric[]
}

export interface AnalyticsBreakdownRow {
  dimension: string
  value: number
  count?: number
  percentage?: number | null
}

export interface SalesAnalytics {
  by_day: AnalyticsBreakdownRow[]
  by_week: AnalyticsBreakdownRow[]
  by_month: AnalyticsBreakdownRow[]
  by_quarter: AnalyticsBreakdownRow[]
  by_year: AnalyticsBreakdownRow[]
  by_region: AnalyticsBreakdownRow[]
  by_store: AnalyticsBreakdownRow[]
  by_category: AnalyticsBreakdownRow[]
  by_payment_method: AnalyticsBreakdownRow[]
  top_sales_days: AnalyticsBreakdownRow[]
  low_sales_days: AnalyticsBreakdownRow[]
  growth_trend_pct?: number | null
}

export interface StoreRankRow {
  store_code: string
  revenue: number
  orders: number
  profit: number
  average_order_value: number
  growth_pct?: number | null
  performance_score: number
}

export interface StoreAnalytics {
  rankings: StoreRankRow[]
  high_performers: string[]
  underperformers: string[]
}

export interface ProductRankRow {
  product_code: string
  revenue: number
  units_sold: number
  profit: number
  return_rate_pct: number
  contribution_pct: number
  performance_score: number
}

export interface ProductAnalytics {
  top_by_revenue: ProductRankRow[]
  top_by_units: ProductRankRow[]
  slow_moving: string[]
  high_return: string[]
  category_performance: AnalyticsBreakdownRow[]
  brand_performance: AnalyticsBreakdownRow[]
}

export interface CustomerAnalytics {
  new_customers: number
  returning_customers: number
  segments: AnalyticsBreakdownRow[]
  membership_distribution: AnalyticsBreakdownRow[]
  revenue_contribution: AnalyticsBreakdownRow[]
  average_spend: number
  purchase_frequency: number
  clv_placeholder?: number | null
  segment_score: number
}

export interface InventoryItem {
  product_code: string
  stock_on_hand: number
  reorder_level: number
  inventory_value: number
  risk_score: number
  status: string
}

export interface InventoryAnalytics {
  inventory_value: number
  low_stock_count: number
  overstock_count: number
  out_of_stock_count: number
  fast_moving: string[]
  slow_moving: string[]
  reorder_candidates: InventoryItem[]
  stock_risk_score: number
}

export interface SupplierRankRow {
  supplier_id: string
  supplier_name: string
  product_count: number
  revenue_contribution: number
  reliability_score: number
  risk_score: number
}

export interface SupplierAnalytics {
  rankings: SupplierRankRow[]
  delayed_suppliers: string[]
}

export interface PromotionAnalytics {
  promotional_revenue: number
  non_promotional_revenue: number
  discount_effectiveness_pct: number
  category_performance: AnalyticsBreakdownRow[]
  region_performance: AnalyticsBreakdownRow[]
  promotion_roi_placeholder?: number | null
}

export interface PerformanceScores {
  store_scores: Record<string, number>
  product_scores: Record<string, number>
  customer_segment_score: number
  inventory_risk_score: number
  supplier_risk_score: number
}

export interface BusinessAnalyticsReport {
  overview: AnalyticsOverview
  kpis: AnalyticsKpiAnalytics
  sales: SalesAnalytics
  stores: StoreAnalytics
  products: ProductAnalytics
  customers: CustomerAnalytics
  inventory: InventoryAnalytics
  suppliers: SupplierAnalytics
  promotions: PromotionAnalytics
  performance: PerformanceScores
  execution_time_seconds: number
}

export interface FormulaReference {
  name: string
  formula: string
  description?: string
}

export const ANALYTICS_FORMULAS: FormulaReference[] = [
  {
    name: 'Gross Margin',
    formula: 'Gross Margin = Gross Profit / Revenue × 100',
    description: 'Profitability after cost of goods sold.',
  },
  {
    name: 'Average Order Value',
    formula: 'Average Order Value = Revenue / Orders',
    description: 'Mean transaction value across all orders.',
  },
  {
    name: 'Inventory Risk Score',
    formula: 'Inventory Risk Score = weighted score based on stock status, sales velocity, and reorder level',
    description: 'Higher score indicates more stock risk across the catalog.',
  },
  {
    name: 'Store Performance Score',
    formula: 'Store Performance Score = weighted score based on revenue, profit, growth, and order volume',
    description: 'Normalized composite of revenue (40%), profit (30%), orders (20%), and AOV (10%).',
  },
  {
    name: 'Product Performance Score',
    formula: 'Product Performance Score = 40% revenue + 35% units + 25% profit',
    description: 'Normalized ranking for product contribution.',
  },
  {
    name: 'Supplier Risk Score',
    formula: 'Supplier Risk Score = 100 − reliability score',
    description: 'Placeholder reliability derived from revenue contribution.',
  },
]
