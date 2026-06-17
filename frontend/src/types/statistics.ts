export interface DescriptiveStat {
  column: string
  count: number
  sum?: number
  mean?: number
  median?: number
  mode?: number
  min?: number
  max?: number
  range?: number
  variance?: number
  std?: number
  q1?: number
  q3?: number
  p90?: number
  p95?: number
  skewness?: number
  kurtosis?: number
}

export interface BusinessMetrics {
  average_order_value: number
  revenue_per_store: number
  revenue_per_customer: number
  revenue_per_product: number
  profit_margin_pct: number
  gross_profit: number
  return_rate_pct: number
  discount_rate_pct: number
  inventory_turnover?: number | null
  customer_lifetime_value?: number | null
  sales_per_transaction: number
  units_per_transaction: number
  total_revenue: number
  total_orders: number
}

export interface DistributionBucket {
  label: string
  count: number
  percentage: number
}

export interface DistributionSummary {
  name: string
  buckets: DistributionBucket[]
  chart_ready: boolean
}

export interface TimeSeriesPoint {
  period: string
  revenue: number
  orders: number
  growth_pct?: number | null
}

export interface TimeSeriesStats {
  daily: TimeSeriesPoint[]
  weekly: TimeSeriesPoint[]
  monthly: TimeSeriesPoint[]
  quarterly: TimeSeriesPoint[]
  yearly: TimeSeriesPoint[]
  month_over_month_growth_pct?: number | null
  year_over_year_growth_pct?: number | null
  rolling_average_7d?: number | null
}

export interface RegionalStatRow {
  region: string
  revenue: number
  profit: number
  orders: number
  customers: number
  average_order_value: number
  return_rate_pct: number
}

export interface RegionalStats {
  rows: RegionalStatRow[]
  top_region?: string | null
  lowest_region?: string | null
  fastest_growing_region?: string | null
}

export interface DatasetHealth {
  total_records: number
  valid_records: number
  invalid_records: number
  null_percentage: number
  duplicate_percentage: number
  completeness_pct: number
  consistency_pct: number
  quality_score: number
  data_quality_index: number
}

export interface StatisticsOverview {
  sprint: string
  status: string
  modules: string[]
  supported_metrics: string[]
  data_source: string
}

export interface UnifiedStatisticsReport {
  overview: StatisticsOverview
  descriptive: DescriptiveStat[]
  business: BusinessMetrics
  distributions: DistributionSummary[]
  time_series: TimeSeriesStats
  regional: RegionalStats
  health: DatasetHealth
  execution_time_seconds: number
}

export interface FormulaReference {
  name: string
  formula: string
  description?: string
}

export const STATISTICS_FORMULAS: FormulaReference[] = [
  {
    name: 'Average Order Value',
    formula: 'Total Revenue / Total Orders',
    description: 'Mean revenue per transaction',
  },
  {
    name: 'Profit Margin',
    formula: 'Gross Profit / Revenue × 100',
    description: 'Percentage of revenue retained as profit',
  },
  {
    name: 'Return Rate',
    formula: 'Returned Transactions / Total Transactions × 100',
    description: 'Share of orders resulting in returns',
  },
  {
    name: 'Revenue per Store',
    formula: 'Total Revenue / Unique Stores',
  },
  {
    name: 'Revenue per Customer',
    formula: 'Total Revenue / Unique Customers',
  },
  {
    name: 'Units per Transaction',
    formula: 'Total Quantity / Total Orders',
  },
  {
    name: 'Standard Deviation',
    formula: '√Variance',
    description: 'Spread of numeric retail metrics',
  },
]
