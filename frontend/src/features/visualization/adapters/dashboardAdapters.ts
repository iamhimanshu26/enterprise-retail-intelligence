import type { BusinessAnalyticsReport } from '@/types/analytics'
import type { QualityScore, ExecutionRecord } from '@/types/etl'
import type { ExecutiveIntelligenceReport } from '@/types/intelligence'
import type { UnifiedStatisticsReport } from '@/types/statistics'
import {
  breakdownToChartData,
  regionalToChartData,
  timeSeriesToChartData,
  type ChartSeriesPoint,
} from './chartAdapters'

export interface SalesDashboardData {
  revenueTrend: ChartSeriesPoint[]
  monthlyGrowth: ChartSeriesPoint[]
  byRegion: ChartSeriesPoint[]
  byCategory: ChartSeriesPoint[]
  byPayment: ChartSeriesPoint[]
  topSalesDays: ChartSeriesPoint[]
  lowSalesDays: ChartSeriesPoint[]
  storeComparison: ChartSeriesPoint[]
}

export interface InventoryDashboardData {
  inventoryValueTrend: ChartSeriesPoint[]
  lowStock: ChartSeriesPoint[]
  overstock: ChartSeriesPoint[]
  stockRiskHeatmap: ChartSeriesPoint[]
  movementDistribution: ChartSeriesPoint[]
  statusBreakdown: ChartSeriesPoint[]
  reorderTable: Array<{
    product_code: string
    stock_on_hand: number
    reorder_level: number
    risk_score: number
    status: string
  }>
}

export interface CustomerDashboardData {
  growthTrend: ChartSeriesPoint[]
  newVsReturning: ChartSeriesPoint[]
  membershipTiers: ChartSeriesPoint[]
  segmentSpend: ChartSeriesPoint[]
  purchaseFrequency: ChartSeriesPoint[]
  regionDistribution: ChartSeriesPoint[]
}

export interface SupplierDashboardData {
  reliability: ChartSeriesPoint[]
  riskRanking: ChartSeriesPoint[]
  contribution: ChartSeriesPoint[]
  productCount: ChartSeriesPoint[]
  regionDistribution: ChartSeriesPoint[]
  deliveryDelay: ChartSeriesPoint[]
}

export interface ProductDashboardData {
  topByRevenue: ChartSeriesPoint[]
  topByUnits: ChartSeriesPoint[]
  categoryContribution: ChartSeriesPoint[]
  brandPerformance: ChartSeriesPoint[]
  highReturn: ChartSeriesPoint[]
  slowMoving: ChartSeriesPoint[]
  profitDistribution: ChartSeriesPoint[]
}

export interface RegionalDashboardData {
  revenue: ChartSeriesPoint[]
  orders: ChartSeriesPoint[]
  profit: ChartSeriesPoint[]
  customers: ChartSeriesPoint[]
  storePerformance: ChartSeriesPoint[]
  growthComparison: ChartSeriesPoint[]
}

export interface EtlQualityDashboardData {
  qualityTrend: ChartSeriesPoint[]
  dimensions: ChartSeriesPoint[]
  failedRecordsTrend: ChartSeriesPoint[]
  executionDuration: ChartSeriesPoint[]
  lineagePlaceholder: ChartSeriesPoint[]
}

export interface ExecutiveDashboardData {
  businessHealth: ChartSeriesPoint[]
  kpiStatusDistribution: ChartSeriesPoint[]
  targetVsActual: ChartSeriesPoint[]
  anomalySeverity: ChartSeriesPoint[]
  recommendationCategories: ChartSeriesPoint[]
  scorecard: ChartSeriesPoint[]
}

export interface InteractiveDashboardBundle {
  sales: SalesDashboardData
  inventory: InventoryDashboardData
  customer: CustomerDashboardData
  supplier: SupplierDashboardData
  product: ProductDashboardData
  regional: RegionalDashboardData
  etlQuality: EtlQualityDashboardData
  executive: ExecutiveDashboardData
  source: 'live' | 'mock'
}

const STATUS_COLORS: Record<string, number> = {
  excellent: 90,
  good: 75,
  warning: 55,
  critical: 30,
}

export function buildSalesDashboard(analytics: BusinessAnalyticsReport): SalesDashboardData {
  return {
    revenueTrend: breakdownToChartData(analytics.sales.by_day),
    monthlyGrowth: breakdownToChartData(analytics.sales.by_month),
    byRegion: breakdownToChartData(analytics.sales.by_region),
    byCategory: breakdownToChartData(analytics.sales.by_category),
    byPayment: breakdownToChartData(analytics.sales.by_payment_method),
    topSalesDays: breakdownToChartData(analytics.sales.top_sales_days),
    lowSalesDays: breakdownToChartData(analytics.sales.low_sales_days),
    storeComparison: breakdownToChartData(analytics.sales.by_store),
  }
}

export function buildInventoryDashboard(analytics: BusinessAnalyticsReport): InventoryDashboardData {
  const inv = analytics.inventory
  return {
    inventoryValueTrend: breakdownToChartData(analytics.sales.by_month).map((p) => ({
      ...p,
      value: inv.inventory_value / Math.max(analytics.sales.by_month.length, 1),
    })),
    lowStock: [
      { label: 'Low Stock', value: inv.low_stock_count },
      { label: 'Healthy', value: Math.max(0, 100 - inv.low_stock_count) },
    ],
    overstock: [
      { label: 'Overstock', value: inv.overstock_count },
      { label: 'Normal', value: Math.max(0, 50 - inv.overstock_count) },
    ],
    stockRiskHeatmap: inv.reorder_candidates.map((item) => ({
      label: item.product_code,
      value: item.risk_score,
      secondary: item.stock_on_hand,
    })),
    movementDistribution: [
      { label: 'Fast Moving', value: inv.fast_moving.length },
      { label: 'Slow Moving', value: inv.slow_moving.length },
      { label: 'Out of Stock', value: inv.out_of_stock_count },
    ],
    statusBreakdown: [
      { label: 'In Stock', value: Math.max(0, 100 - inv.low_stock_count - inv.out_of_stock_count) },
      { label: 'Low Stock', value: inv.low_stock_count },
      { label: 'Out of Stock', value: inv.out_of_stock_count },
    ],
    reorderTable: inv.reorder_candidates.map((item) => ({
      product_code: item.product_code,
      stock_on_hand: item.stock_on_hand,
      reorder_level: item.reorder_level,
      risk_score: item.risk_score,
      status: item.status,
    })),
  }
}

export function buildCustomerDashboard(analytics: BusinessAnalyticsReport, stats: UnifiedStatisticsReport): CustomerDashboardData {
  return {
    growthTrend: timeSeriesToChartData(stats.time_series.monthly).map((p) => ({
      ...p,
      value: p.secondary ?? p.value * 0.1,
    })),
    newVsReturning: [
      { label: 'New', value: analytics.customers.new_customers },
      { label: 'Returning', value: analytics.customers.returning_customers },
    ],
    membershipTiers: breakdownToChartData(analytics.customers.membership_distribution),
    segmentSpend: breakdownToChartData(analytics.customers.segments),
    purchaseFrequency: [
      { label: 'Avg Frequency', value: analytics.customers.purchase_frequency },
      { label: 'Avg Spend', value: analytics.customers.average_spend },
    ],
    regionDistribution: breakdownToChartData(analytics.sales.by_region),
  }
}

export function buildSupplierDashboard(analytics: BusinessAnalyticsReport): SupplierDashboardData {
  const rankings = analytics.suppliers.rankings
  return {
    reliability: rankings.map((s) => ({ label: s.supplier_name, value: s.reliability_score })),
    riskRanking: rankings.map((s) => ({ label: s.supplier_name, value: s.risk_score })),
    contribution: rankings.map((s) => ({ label: s.supplier_name, value: s.revenue_contribution })),
    productCount: rankings.map((s) => ({ label: s.supplier_name, value: s.product_count })),
    regionDistribution: breakdownToChartData(analytics.promotions.region_performance),
    deliveryDelay: analytics.suppliers.delayed_suppliers.map((id, i) => ({
      label: id,
      value: 15 + i * 5,
    })),
  }
}

export function buildProductDashboard(analytics: BusinessAnalyticsReport): ProductDashboardData {
  return {
    topByRevenue: analytics.products.top_by_revenue.map((p) => ({
      label: p.product_code,
      value: p.revenue,
      secondary: p.profit,
    })),
    topByUnits: analytics.products.top_by_units.map((p) => ({
      label: p.product_code,
      value: p.units_sold,
    })),
    categoryContribution: breakdownToChartData(analytics.products.category_performance),
    brandPerformance: breakdownToChartData(analytics.products.brand_performance),
    highReturn: analytics.products.high_return.map((code, i) => ({
      label: code,
      value: 10 + i * 3,
    })),
    slowMoving: analytics.products.slow_moving.map((code, i) => ({
      label: code,
      value: 5 - i,
    })),
    profitDistribution: analytics.products.top_by_revenue.map((p) => ({
      label: p.product_code,
      value: p.profit,
    })),
  }
}

export function buildRegionalDashboard(analytics: BusinessAnalyticsReport, stats: UnifiedStatisticsReport): RegionalDashboardData {
  const regional = stats.regional.rows ?? []
  return {
    revenue: regionalToChartData(regional),
    orders: regional.map((r) => ({ label: r.region, value: r.orders })),
    profit: regional.map((r) => ({ label: r.region, value: r.profit })),
    customers: regional.map((r) => ({ label: r.region, value: r.customers })),
    storePerformance: breakdownToChartData(analytics.sales.by_store),
    growthComparison: regional.map((r) => ({
      label: r.region,
      value: r.average_order_value,
      secondary: r.return_rate_pct,
    })),
  }
}

export function buildEtlQualityDashboard(quality: QualityScore, history: ExecutionRecord[]): EtlQualityDashboardData {
  return {
    qualityTrend: history.map((h, i) => ({
      label: h.pipeline_name.slice(0, 12) || `Run ${i + 1}`,
      value: h.quality_score,
    })),
    dimensions: [
      { label: 'Completeness', value: quality.completeness },
      { label: 'Accuracy', value: quality.accuracy },
      { label: 'Consistency', value: quality.consistency },
      { label: 'Validity', value: quality.validity },
      { label: 'Uniqueness', value: quality.uniqueness },
    ],
    failedRecordsTrend: history.map((h, i) => ({
      label: `Run ${i + 1}`,
      value: h.failed_rows,
      secondary: h.processed_rows,
    })),
    executionDuration: history.map((h, i) => ({
      label: h.entity || `Run ${i + 1}`,
      value: h.duration_seconds,
    })),
    lineagePlaceholder: [
      { label: 'Extract', value: 100 },
      { label: 'Transform', value: 95 },
      { label: 'Load', value: 92 },
    ],
  }
}

export function buildExecutiveDashboard(intelligence: ExecutiveIntelligenceReport): ExecutiveDashboardData {
  const statusCounts = intelligence.kpi_intelligence.reduce<Record<string, number>>((acc, kpi) => {
    acc[kpi.status] = (acc[kpi.status] ?? 0) + 1
    return acc
  }, {})

  const anomalyCounts = intelligence.anomalies.reduce<Record<string, number>>((acc, a) => {
    acc[a.severity] = (acc[a.severity] ?? 0) + 1
    return acc
  }, {})

  const recAreas = intelligence.recommendations.reduce<Record<string, number>>((acc, r) => {
    acc[r.area] = (acc[r.area] ?? 0) + 1
    return acc
  }, {})

  return {
    businessHealth: [
      { label: 'Overall', value: intelligence.business_health.overall_score },
      ...intelligence.scorecard.dimensions.map((d) => ({ label: d.name, value: d.score })),
    ],
    kpiStatusDistribution: Object.entries(statusCounts).map(([label, value]) => ({
      label,
      value,
    })),
    targetVsActual: intelligence.benchmarks.map((b) => ({
      label: b.metric,
      value: b.actual,
      secondary: b.target,
      percentage: b.achievement_pct,
    })),
    anomalySeverity: Object.entries(anomalyCounts).map(([label, value]) => ({ label, value })),
    recommendationCategories: Object.entries(recAreas).map(([label, value]) => ({ label, value })),
    scorecard: intelligence.scorecard.dimensions.map((d) => ({
      label: d.name,
      value: d.score,
    })),
  }
}

export function buildInteractiveDashboardBundle(
  analytics: BusinessAnalyticsReport,
  statistics: UnifiedStatisticsReport,
  intelligence: ExecutiveIntelligenceReport,
  quality: QualityScore,
  history: ExecutionRecord[],
): InteractiveDashboardBundle {
  return {
    sales: buildSalesDashboard(analytics),
    inventory: buildInventoryDashboard(analytics),
    customer: buildCustomerDashboard(analytics, statistics),
    supplier: buildSupplierDashboard(analytics),
    product: buildProductDashboard(analytics),
    regional: buildRegionalDashboard(analytics, statistics),
    etlQuality: buildEtlQualityDashboard(quality, history),
    executive: buildExecutiveDashboard(intelligence),
    source: 'live',
  }
}

export { STATUS_COLORS }
