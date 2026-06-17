export interface ForecastingOverview {
  sprint: string
  status: string
  modules: string[]
  data_source: string
  supported_models: string[]
}

export interface ForecastPoint {
  forecast_date: string
  predicted_value: number
  confidence_low?: number | null
  confidence_high?: number | null
  trend_direction: string
  model_name: string
  forecast_horizon: number
}

export interface ForecastSeries {
  granularity: string
  model_name: string
  horizon: number
  points: ForecastPoint[]
}

export interface SalesForecast {
  daily: ForecastSeries
  weekly: ForecastSeries
  monthly: ForecastSeries
}

export interface RevenueForecast {
  daily: ForecastSeries
  weekly: ForecastSeries
  monthly: ForecastSeries
  quarterly: ForecastSeries
}

export interface DemandForecastRow extends Record<string, unknown> {
  dimension: string
  dimension_type: string
  predicted_demand: number
  trend_direction: string
  model_name: string
}

export interface DemandForecast {
  product_demand: DemandForecastRow[]
  category_demand: DemandForecastRow[]
  fast_moving: DemandForecastRow[]
  slow_moving: DemandForecastRow[]
}

export interface InventoryForecastRow extends Record<string, unknown> {
  product_code: string
  expected_usage: number
  stock_out_risk_score: number
  reorder_recommendation: string
  days_until_stock_out?: number | null
  reorder_quantity_placeholder?: number | null
  current_stock: number
}

export interface InventoryForecast {
  items: InventoryForecastRow[]
  aggregate_stock_out_risk: number
}

export interface StoreForecastRow extends Record<string, unknown> {
  store_code: string
  predicted_revenue: number
  predicted_orders: number
  revenue_trend: string
  order_trend: string
  performance_risk_score: number
  classification: string
}

export interface StoreForecast {
  stores: StoreForecastRow[]
  high_growth_stores: string[]
  declining_stores: string[]
}

export interface AccuracyMetrics {
  metric_name: string
  model_name: string
  mae: number
  rmse: number
  mape: number
  smape?: number | null
  bias: number
  accuracy_score: number
}

export interface AccuracyReport {
  metrics: AccuracyMetrics[]
  overall_accuracy_score: number
}

export interface ScenarioResult {
  scenario: string
  metric: string
  base_value: number
  adjusted_value: number
  adjustment_pct: number
}

export interface ScenarioOutputs {
  scenarios: ScenarioResult[]
}

export interface ForecastingReport {
  overview: ForecastingOverview
  sales: SalesForecast
  revenue: RevenueForecast
  demand: DemandForecast
  inventory: InventoryForecast
  stores: StoreForecast
  accuracy: AccuracyReport
  scenarios: ScenarioOutputs
  execution_time_seconds: number
}

export interface ForecastOverviewKpi {
  id: string
  label: string
  currentValue: number
  forecastValue: number
  unit: string
  trend: 'up' | 'down' | 'neutral'
  confidencePlaceholder: string
  modelName: string
  horizon: string
}

export interface ScenarioControls {
  demandIncreasePct: number
  discountImpactPct: number
  seasonalBoostPct: number
  inventoryConstraintPct: number
}

export interface ForecastingCenterBundle {
  report: ForecastingReport
  source: 'api' | 'mock'
  overviewKpis: ForecastOverviewKpi[]
  revenueHistoricalVsForecast: import('@/features/visualization/adapters/chartAdapters').ChartSeriesPoint[]
  salesHistoricalVsForecast: import('@/features/visualization/adapters/chartAdapters').ChartSeriesPoint[]
  monthlyRevenueForecast: import('@/features/visualization/adapters/chartAdapters').ChartSeriesPoint[]
  weeklySalesForecast: import('@/features/visualization/adapters/chartAdapters').ChartSeriesPoint[]
  categoryDemandChart: import('@/features/visualization/adapters/chartAdapters').ChartSeriesPoint[]
  demandGrowthChart: import('@/features/visualization/adapters/chartAdapters').ChartSeriesPoint[]
}
