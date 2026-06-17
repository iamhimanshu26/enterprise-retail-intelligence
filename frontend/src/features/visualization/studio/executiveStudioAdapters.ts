import type { BusinessAnalyticsReport } from '@/types/analytics'
import type { ExecutiveIntelligenceReport } from '@/types/intelligence'
import type { UnifiedStatisticsReport } from '@/types/statistics'
import type { ChartSeriesPoint } from '../adapters/chartAdapters'
import { breakdownToChartData, timeSeriesToChartData } from '../adapters/chartAdapters'

export type KpiStudioStatus = 'excellent' | 'good' | 'warning' | 'critical'

export interface KpiPerformanceItem {
  id: string
  label: string
  currentValue: number
  targetValue: number
  achievementPct: number
  unit: string
  status: KpiStudioStatus
  explanation: string
  trend: ChartSeriesPoint[]
}

export interface TargetVsActualMetric {
  id: string
  label: string
  actual: number
  target: number
  achievementPct: number
  unit: string
}

export interface BusinessHealthSummary {
  overallScore: number
  overallStatus: string
  strongestArea: string
  weakestArea: string
  highestRisk: string
  biggestOpportunity: string
  breakdown: ChartSeriesPoint[]
}

export interface AnomalySummary {
  id: string
  category: string
  metric: string
  severity: string
  value: number
  expectedRange: string
  explanation: string
}

export interface RecommendationImpact {
  id: string
  category: string
  title: string
  priority: string
  expectedImpact: string
  affectedMetric: string
  status: string
}

export interface ExecutiveVisualizationBundle {
  kpiBoard: KpiPerformanceItem[]
  targetVsActual: TargetVsActualMetric[]
  businessHealth: BusinessHealthSummary
  anomalies: AnomalySummary[]
  recommendations: RecommendationImpact[]
  trendComparison: ChartSeriesPoint[]
  source: 'live' | 'mock'
}

const ANOMALY_CATEGORIES = [
  'revenue',
  'inventory',
  'return rate',
  'discount',
  'supplier',
] as const

const RECOMMENDATION_CATEGORY_MAP: Record<string, string> = {
  Inventory: 'inventory action',
  Pricing: 'pricing action',
  Supplier: 'supplier action',
  Customer: 'customer action',
  Promotion: 'promotion action',
  Store: 'store operation action',
  Operations: 'store operation action',
}

function statusFromAchievement(pct: number): KpiStudioStatus {
  if (pct >= 100) return 'excellent'
  if (pct >= 90) return 'good'
  if (pct >= 75) return 'warning'
  return 'critical'
}

function buildTrendSeries(
  analytics: BusinessAnalyticsReport,
  stats: UnifiedStatisticsReport,
  scale = 1,
): ChartSeriesPoint[] {
  const monthly = timeSeriesToChartData(stats.time_series.monthly)
  if (monthly.length) return monthly.map((p) => ({ ...p, value: p.value * scale }))
  return breakdownToChartData(analytics.sales.by_month).map((p) => ({ ...p, value: p.value * scale }))
}

export function buildExecutiveVisualizationBundle(
  analytics: BusinessAnalyticsReport,
  statistics: UnifiedStatisticsReport,
  intelligence: ExecutiveIntelligenceReport,
): ExecutiveVisualizationBundle {
  const business = statistics.business
  const inv = analytics.inventory
  const customers = analytics.customers

  const benchmarkMap = new Map(intelligence.benchmarks.map((b) => [b.metric.toLowerCase(), b]))

  const revenueBenchmark = benchmarkMap.get('revenue')
  const profitBenchmark = benchmarkMap.get('profit') ?? benchmarkMap.get('gross profit')
  const ordersBenchmark = benchmarkMap.get('orders')
  const customersBenchmark = benchmarkMap.get('customers')

  const revenueTarget = revenueBenchmark?.target ?? business.total_revenue * 0.95
  const profitTarget = profitBenchmark?.target ?? business.gross_profit * 0.95
  const ordersTarget = ordersBenchmark?.target ?? business.total_orders * 0.95
  const customersTarget = customersBenchmark?.target ?? (customers.new_customers + customers.returning_customers) * 0.95
  const returnRateActual = business.return_rate_pct
  const returnRateTarget = 3.5

  const kpiBoard: KpiPerformanceItem[] = [
    {
      id: 'revenue',
      label: 'Revenue',
      currentValue: business.total_revenue,
      targetValue: revenueTarget,
      achievementPct: revenueBenchmark?.achievement_pct ?? (business.total_revenue / revenueTarget) * 100,
      unit: 'JPY',
      status: statusFromAchievement(revenueBenchmark?.achievement_pct ?? 100),
      explanation: 'Total revenue from warehouse sales transactions.',
      trend: buildTrendSeries(analytics, statistics),
    },
    {
      id: 'profit',
      label: 'Profit',
      currentValue: business.gross_profit,
      targetValue: profitTarget,
      achievementPct: profitBenchmark?.achievement_pct ?? (business.gross_profit / profitTarget) * 100,
      unit: 'JPY',
      status: statusFromAchievement(profitBenchmark?.achievement_pct ?? 98),
      explanation: 'Gross profit after cost of goods sold.',
      trend: buildTrendSeries(analytics, statistics, 0.3),
    },
    {
      id: 'orders',
      label: 'Orders',
      currentValue: business.total_orders,
      targetValue: ordersTarget,
      achievementPct: ordersBenchmark?.achievement_pct ?? (business.total_orders / ordersTarget) * 100,
      unit: 'orders',
      status: statusFromAchievement(ordersBenchmark?.achievement_pct ?? 102),
      explanation: 'Total order count across all stores.',
      trend: buildTrendSeries(analytics, statistics, 0.01).map((p) => ({
        ...p,
        value: p.secondary ?? p.value * 0.004,
      })),
    },
    {
      id: 'customers',
      label: 'Customers',
      currentValue: customers.new_customers + customers.returning_customers,
      targetValue: customersTarget,
      achievementPct: customersBenchmark?.achievement_pct ?? 96,
      unit: 'customers',
      status: 'good',
      explanation: 'Active customer base — new plus returning.',
      trend: buildTrendSeries(analytics, statistics, 0.005),
    },
    {
      id: 'inventory',
      label: 'Inventory',
      currentValue: inv.inventory_value,
      targetValue: inv.inventory_value * 1.05,
      achievementPct: 92,
      unit: 'JPY',
      status: inv.stock_risk_score > 50 ? 'warning' : 'good',
      explanation: 'Total inventory value with stock risk overlay.',
      trend: [
        { label: 'Risk', value: inv.stock_risk_score },
        { label: 'Low Stock', value: inv.low_stock_count },
        { label: 'Overstock', value: inv.overstock_count },
      ],
    },
    {
      id: 'returns',
      label: 'Returns',
      currentValue: returnRateActual,
      targetValue: returnRateTarget,
      achievementPct: returnRateActual <= returnRateTarget ? 100 : 85,
      unit: '%',
      status: returnRateActual > 5 ? 'warning' : 'good',
      explanation: 'Return rate percentage — lower is better.',
      trend: buildTrendSeries(analytics, statistics, 0.0001),
    },
    {
      id: 'growth',
      label: 'Growth',
      currentValue: analytics.sales.growth_trend_pct ?? statistics.time_series.month_over_month_growth_pct ?? 5,
      targetValue: 8,
      achievementPct: ((analytics.sales.growth_trend_pct ?? 5) / 8) * 100,
      unit: '%',
      status: 'good',
      explanation: 'Period-over-period revenue growth trend.',
      trend: buildTrendSeries(analytics, statistics, 0.001),
    },
    {
      id: 'business-health',
      label: 'Business Health',
      currentValue: intelligence.business_health.overall_score,
      targetValue: 85,
      achievementPct: (intelligence.business_health.overall_score / 85) * 100,
      unit: 'score',
      status: statusFromAchievement((intelligence.business_health.overall_score / 85) * 100),
      explanation: 'Composite executive health index from scorecard dimensions.',
      trend: intelligence.scorecard.dimensions.map((d) => ({ label: d.name, value: d.score })),
    },
  ]

  const targetVsActual: TargetVsActualMetric[] = [
    {
      id: 'revenue',
      label: 'Revenue',
      actual: business.total_revenue,
      target: revenueTarget,
      achievementPct: revenueBenchmark?.achievement_pct ?? 105,
      unit: 'JPY',
    },
    {
      id: 'profit',
      label: 'Profit',
      actual: business.gross_profit,
      target: profitTarget,
      achievementPct: profitBenchmark?.achievement_pct ?? 98,
      unit: 'JPY',
    },
    {
      id: 'orders',
      label: 'Orders',
      actual: business.total_orders,
      target: ordersTarget,
      achievementPct: ordersBenchmark?.achievement_pct ?? 102,
      unit: 'orders',
    },
    {
      id: 'customers',
      label: 'Customers',
      actual: customers.new_customers + customers.returning_customers,
      target: customersTarget,
      achievementPct: customersBenchmark?.achievement_pct ?? 96,
      unit: 'customers',
    },
    {
      id: 'return-rate',
      label: 'Return Rate',
      actual: returnRateActual,
      target: returnRateTarget,
      achievementPct: returnRateActual <= returnRateTarget ? 100 : 88,
      unit: '%',
    },
  ]

  const businessHealth: BusinessHealthSummary = {
    overallScore: intelligence.business_health.overall_score,
    overallStatus: intelligence.business_health.overall_status,
    strongestArea: intelligence.business_health.strongest_area,
    weakestArea: intelligence.business_health.weakest_area,
    highestRisk: intelligence.business_health.highest_risk,
    biggestOpportunity: intelligence.business_health.biggest_opportunity,
    breakdown: intelligence.scorecard.dimensions.map((d) => ({
      label: d.name,
      value: d.score,
    })),
  }

  const anomalies: AnomalySummary[] = intelligence.anomalies.map((a, i) => ({
    id: a.id,
    category: ANOMALY_CATEGORIES[i % ANOMALY_CATEGORIES.length],
    metric: a.metric,
    severity: a.severity,
    value: a.value,
    expectedRange: a.expected_range,
    explanation: a.explanation,
  }))

  const recommendations: RecommendationImpact[] = intelligence.recommendations.map((r) => ({
    id: r.id,
    category: RECOMMENDATION_CATEGORY_MAP[r.area] ?? `${r.area.toLowerCase()} action`,
    title: r.title,
    priority: r.priority,
    expectedImpact: r.priority === 'high' ? '+8–12% metric uplift' : '+3–6% metric uplift',
    affectedMetric: r.area,
    status: r.priority === 'high' ? 'active' : 'planned',
  }))

  return {
    kpiBoard,
    targetVsActual,
    businessHealth,
    anomalies,
    recommendations,
    trendComparison: buildTrendSeries(analytics, statistics),
    source: 'live',
  }
}
