export type DateRangeKey = '7d' | '30d' | '90d' | 'ytd'
export type TrendDirection = 'up' | 'down' | 'neutral'
export type AlertSeverity = 'info' | 'warning' | 'critical' | 'success'
export type ProductStatus = 'active' | 'low-stock' | 'discontinued' | 'promoted'
export type StorePerformance = 'excellent' | 'good' | 'average' | 'underperforming'

export interface DashboardFilters {
  dateRange: DateRangeKey
  region: string
  store: string
  category: string
}

export interface DashboardQueryParams extends DashboardFilters {
  workspaceId: string
}

export interface KpiMetric {
  id: string
  label: string
  value: number
  change: number
  trend: TrendDirection
  comparisonBadge: string
  tooltip: string
  format: 'currency' | 'number' | 'percent'
}

export interface BusinessSummaryItem {
  id: string
  label: string
  value: string
  change: string
  trend: TrendDirection
  description: string
}

export interface ChartDataPoint {
  label: string
  value: number
  secondary?: number
}

export interface RegionalHighlight {
  id: string
  label: string
  region: string
  value: string
  metric: string
  trend: TrendDirection
}

export interface ProductRow {
  id: string
  product: string
  category: string
  revenue: number
  unitsSold: number
  growth: number
  status: ProductStatus
}

export interface StoreRow {
  id: string
  rank: number
  storeName: string
  region: string
  revenue: number
  orders: number
  growth: number
  performance: StorePerformance
}

export interface BusinessAlert {
  id: string
  title: string
  message: string
  severity: AlertSeverity
  timestamp: string
}

export interface ActivityEvent {
  id: string
  title: string
  description: string
  category: string
  timestamp: string
}

export interface QuickAction {
  id: string
  label: string
  path: string
}

export interface ExecutiveSummary {
  summary: string
  highlights: string[]
}

export interface ExecutiveDashboardData {
  kpis: KpiMetric[]
  businessSummary: BusinessSummaryItem[]
  executiveSummary: ExecutiveSummary
  regionalHighlights: RegionalHighlight[]
  revenueTrend: ChartDataPoint[]
  monthlySales: ChartDataPoint[]
  topCategories: ChartDataPoint[]
  storePerformance: ChartDataPoint[]
  customerGrowth: ChartDataPoint[]
  revenueByRegion: ChartDataPoint[]
  inventoryDistribution: ChartDataPoint[]
  topProducts: ProductRow[]
  storeRankings: StoreRow[]
  alerts: BusinessAlert[]
  activities: ActivityEvent[]
  quickActions: QuickAction[]
}
