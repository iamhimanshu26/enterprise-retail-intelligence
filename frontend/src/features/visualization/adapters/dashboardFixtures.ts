import type { BusinessAnalyticsReport } from '@/types/analytics'
import type { QualityScore, ExecutionRecord } from '@/types/etl'
import type { ExecutiveIntelligenceReport } from '@/types/intelligence'
import type { UnifiedStatisticsReport } from '@/types/statistics'

const breakdown = (dimension: string, value: number) => ({
  dimension,
  value,
  count: 1,
  percentage: 50,
})

export const mockAnalyticsReport: BusinessAnalyticsReport = {
  overview: {
    sprint: '5.2',
    status: 'complete',
    modules: ['sales'],
    data_source: 'warehouse',
  },
  kpis: { metrics: [{ id: 'revenue', label: 'Revenue', value: 100000, unit: 'JPY' }] },
  sales: {
    by_day: [breakdown('2024-01-01', 5000), breakdown('2024-01-02', 3000)],
    by_week: [breakdown('W1', 20000)],
    by_month: [breakdown('Jan', 80000), breakdown('Feb', 90000)],
    by_quarter: [breakdown('Q1', 250000)],
    by_year: [breakdown('2024', 1000000)],
    by_region: [breakdown('Tokyo', 40000), breakdown('Osaka', 30000)],
    by_store: [breakdown('Store A', 25000), breakdown('Store B', 20000)],
    by_category: [breakdown('Electronics', 35000), breakdown('Apparel', 15000)],
    by_payment_method: [breakdown('Card', 60000), breakdown('Cash', 20000)],
    top_sales_days: [breakdown('2024-01-01', 5000)],
    low_sales_days: [breakdown('2024-01-02', 3000)],
    growth_trend_pct: 5,
  },
  stores: {
    rankings: [
      {
        store_code: 'S1',
        revenue: 25000,
        orders: 100,
        profit: 8000,
        average_order_value: 250,
        growth_pct: 3,
        performance_score: 85,
      },
    ],
    high_performers: ['S1'],
    underperformers: [],
  },
  products: {
    top_by_revenue: [
      {
        product_code: 'P1',
        revenue: 10000,
        units_sold: 50,
        profit: 3000,
        return_rate_pct: 2,
        contribution_pct: 10,
        performance_score: 80,
      },
    ],
    top_by_units: [
      {
        product_code: 'P2',
        revenue: 8000,
        units_sold: 80,
        profit: 2000,
        return_rate_pct: 1,
        contribution_pct: 8,
        performance_score: 75,
      },
    ],
    slow_moving: ['P3'],
    high_return: ['P4'],
    category_performance: [breakdown('Electronics', 35000)],
    brand_performance: [breakdown('Brand A', 20000)],
  },
  customers: {
    new_customers: 120,
    returning_customers: 380,
    segments: [breakdown('Premium', 50000)],
    membership_distribution: [breakdown('Gold', 200), breakdown('Silver', 300)],
    revenue_contribution: [breakdown('Premium', 60000)],
    average_spend: 250,
    purchase_frequency: 3.2,
    clv_placeholder: 1200,
    segment_score: 78,
  },
  inventory: {
    inventory_value: 500000,
    low_stock_count: 12,
    overstock_count: 5,
    out_of_stock_count: 3,
    fast_moving: ['P1'],
    slow_moving: ['P3'],
    reorder_candidates: [
      {
        product_code: 'P1',
        stock_on_hand: 5,
        reorder_level: 10,
        inventory_value: 500,
        risk_score: 75,
        status: 'low',
      },
    ],
    stock_risk_score: 45,
  },
  suppliers: {
    rankings: [
      {
        supplier_id: 'SUP1',
        supplier_name: 'Supplier A',
        product_count: 20,
        revenue_contribution: 40000,
        reliability_score: 88,
        risk_score: 12,
      },
    ],
    delayed_suppliers: ['SUP2'],
  },
  promotions: {
    promotional_revenue: 15000,
    non_promotional_revenue: 65000,
    discount_effectiveness_pct: 12,
    category_performance: [breakdown('Electronics', 10000)],
    region_performance: [breakdown('Tokyo', 8000)],
    promotion_roi_placeholder: 1.5,
  },
  performance: {
    store_scores: { S1: 85 },
    product_scores: { P1: 80 },
    customer_segment_score: 78,
    inventory_risk_score: 45,
    supplier_risk_score: 12,
  },
  execution_time_seconds: 0.5,
}

export const mockStatisticsReport: UnifiedStatisticsReport = {
  overview: {
    sprint: '5.1',
    status: 'complete',
    modules: ['time_series'],
    supported_metrics: ['revenue'],
    data_source: 'warehouse',
  },
  descriptive: [],
  business: {
    average_order_value: 250,
    revenue_per_store: 50000,
    revenue_per_customer: 200,
    revenue_per_product: 1000,
    profit_margin_pct: 25,
    gross_profit: 25000,
    return_rate_pct: 3,
    discount_rate_pct: 5,
    sales_per_transaction: 250,
    units_per_transaction: 2.5,
    total_revenue: 100000,
    total_orders: 400,
  },
  distributions: [],
  time_series: {
    daily: [],
    weekly: [],
    monthly: [
      { period: 'Jan', revenue: 80000, orders: 320, growth_pct: 4 },
      { period: 'Feb', revenue: 90000, orders: 360, growth_pct: 6 },
    ],
    quarterly: [],
    yearly: [],
  },
  regional: {
    rows: [
      {
        region: 'Tokyo',
        revenue: 40000,
        profit: 12000,
        orders: 160,
        customers: 200,
        average_order_value: 250,
        return_rate_pct: 2,
      },
      {
        region: 'Osaka',
        revenue: 30000,
        profit: 9000,
        orders: 120,
        customers: 150,
        average_order_value: 250,
        return_rate_pct: 3,
      },
    ],
  },
  health: {
    total_records: 1000,
    valid_records: 980,
    invalid_records: 20,
    null_percentage: 1,
    duplicate_percentage: 0.5,
    completeness_pct: 98,
    consistency_pct: 97,
    quality_score: 95,
    data_quality_index: 94,
  },
  execution_time_seconds: 0.3,
}

export const mockIntelligenceReport: ExecutiveIntelligenceReport = {
  overview: {
    sprint: '5.3',
    status: 'complete',
    modules: ['scorecard'],
    data_source: 'analytics',
  },
  executive_summary: {
    summary: 'Business performing well',
    highlights: ['Revenue up'],
    tags: ['Growth'],
  },
  kpi_intelligence: [
    {
      id: 'revenue',
      label: 'Revenue',
      value: 100000,
      unit: 'JPY',
      status: 'good',
      trend: 'upward',
      health_indicator: 'healthy',
    },
    {
      id: 'margin',
      label: 'Margin',
      value: 25,
      unit: '%',
      status: 'excellent',
      trend: 'stable',
      health_indicator: 'healthy',
    },
  ],
  trends: [],
  benchmarks: [
    { metric: 'Revenue', actual: 100000, target: 95000, achievement_pct: 105, unit: 'JPY' },
  ],
  anomalies: [
    {
      id: 'a1',
      anomaly_type: 'spike',
      severity: 'warning',
      metric: 'Returns',
      value: 5,
      expected_range: '0-3',
      explanation: 'Elevated returns',
    },
  ],
  recommendations: [
    {
      id: 'r1',
      priority: 'high',
      title: 'Replenish stock',
      description: 'Low stock items',
      action: 'Reorder',
      area: 'Inventory',
    },
  ],
  scorecard: {
    dimensions: [
      { name: 'Revenue', score: 85, status: 'good', explanation: 'On target' },
      { name: 'Profit', score: 78, status: 'good', explanation: 'Stable' },
    ],
    overall_score: 82,
    overall_status: 'good',
    methodology: 'weighted',
  },
  business_health: {
    overall_score: 82,
    overall_status: 'good',
    strongest_area: 'Revenue',
    weakest_area: 'Inventory',
    highest_risk: 'Stock',
    biggest_opportunity: 'Expansion',
  },
  execution_time_seconds: 0.4,
}

export const mockQualityScore: QualityScore = {
  completeness: 95,
  accuracy: 92,
  consistency: 90,
  validity: 88,
  timeliness: 91,
  uniqueness: 94,
  data_quality_index: 92,
  overall: 92,
}

export const mockExecutionHistory: ExecutionRecord[] = [
  {
    pipeline_id: 'p1',
    pipeline_name: 'Retail ETL',
    entity: 'sales',
    start_time: '2024-01-01T00:00:00Z',
    end_time: '2024-01-01T00:05:00Z',
    duration_seconds: 300,
    status: 'success',
    processed_rows: 10000,
    failed_rows: 12,
    quality_score: 92,
    metrics: {
      execution_time_seconds: 300,
      rows_processed: 10000,
      successful_records: 9988,
      failed_records: 12,
      throughput_rows_per_second: 33,
      memory_usage_mb: 256,
      cpu_usage_percent: 45,
    },
  },
]
