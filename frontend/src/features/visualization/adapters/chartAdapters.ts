import type { ChartDataPoint } from '@/types/dashboard'
import type { AnalyticsBreakdownRow } from '@/types/analytics'
import type { DistributionBucket, RegionalStatRow, TimeSeriesPoint } from '@/types/statistics'
import type { TrendAnalysisItem } from '@/types/intelligence'

export interface ChartSeriesPoint extends ChartDataPoint {
  [key: string]: string | number | undefined
}

export function breakdownToChartData(rows: AnalyticsBreakdownRow[]): ChartSeriesPoint[] {
  return rows.map((row) => ({
    label: row.dimension,
    value: row.value,
    secondary: row.count ?? undefined,
    percentage: row.percentage ?? undefined,
  }))
}

export function timeSeriesToChartData(points: TimeSeriesPoint[]): ChartSeriesPoint[] {
  return points.map((point) => ({
    label: point.period,
    value: point.revenue,
    secondary: point.orders,
    growth: point.growth_pct ?? undefined,
  }))
}

export function distributionToChartData(buckets: DistributionBucket[]): ChartSeriesPoint[] {
  return buckets.map((bucket) => ({
    label: bucket.label,
    value: bucket.percentage,
    secondary: bucket.count,
  }))
}

export function regionalToChartData(rows: RegionalStatRow[]): ChartSeriesPoint[] {
  return rows.map((row) => ({
    label: row.region,
    value: row.revenue,
    secondary: row.profit,
    orders: row.orders,
  }))
}

export function trendsToChartData(trends: TrendAnalysisItem[]): ChartSeriesPoint[] {
  return trends.map((trend) => ({
    label: trend.metric,
    value: trend.change_pct,
    direction: trend.direction,
  }))
}

export function kpiToChartData(
  metrics: Array<{ label: string; value: number; unit?: string }>,
): ChartSeriesPoint[] {
  return metrics.map((m) => ({
    label: m.label,
    value: m.value,
    unit: m.unit,
  }))
}
