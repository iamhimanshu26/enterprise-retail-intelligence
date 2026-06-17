import type { ChartSeriesPoint } from '@/features/visualization/adapters/chartAdapters'
import type {
  AccuracyMetrics,
  ForecastOverviewKpi,
  ForecastPoint,
  ForecastingCenterBundle,
  ForecastingReport,
  ScenarioControls,
  ScenarioResult,
} from '@/types/forecasting'

export function forecastPointsToChart(points: ForecastPoint[]): ChartSeriesPoint[] {
  return points.map((point) => ({
    label: point.forecast_date,
    value: point.predicted_value,
    secondary: point.confidence_high ?? undefined,
    growth: point.confidence_low ?? undefined,
  }))
}

export function buildHistoricalVsForecastChart(points: ForecastPoint[], historicalRatio = 0.9): ChartSeriesPoint[] {
  return points.map((point, index) => {
    const historicalValue = point.predicted_value * historicalRatio * (1 - index * 0.015)
    return {
      label: point.forecast_date,
      value: Math.round(historicalValue),
      secondary: point.predicted_value,
    }
  })
}

function trendToCardTrend(trend: string): 'up' | 'down' | 'neutral' {
  if (trend === 'upward' || trend === 'up') return 'up'
  if (trend === 'downward' || trend === 'down') return 'down'
  return 'neutral'
}

function sumDemand(rows: { predicted_demand: number }[]): number {
  return rows.reduce((sum, row) => sum + row.predicted_demand, 0)
}

export function buildOverviewKpis(report: ForecastingReport): ForecastOverviewKpi[] {
  const monthlyRevenue = report.revenue.monthly.points[0]?.predicted_value ?? 0
  const prevRevenue =
    report.revenue.monthly.points[1]?.predicted_value ?? monthlyRevenue * 0.96
  const monthlySales = report.sales.monthly.points[0]?.predicted_value ?? 0
  const prevSales = report.sales.monthly.points[1]?.predicted_value ?? monthlySales * 0.97
  const totalDemand = sumDemand(report.demand.product_demand)
  const growthOutlook =
    report.stores.high_growth_stores.length - report.stores.declining_stores.length

  return [
    {
      id: 'revenue',
      label: 'Predicted Revenue',
      currentValue: prevRevenue,
      forecastValue: monthlyRevenue,
      unit: '¥',
      trend: trendToCardTrend(report.revenue.monthly.points[0]?.trend_direction ?? 'stable'),
      confidencePlaceholder: '±8%',
      modelName: report.revenue.monthly.model_name,
      horizon: `${report.revenue.monthly.horizon} months`,
    },
    {
      id: 'sales',
      label: 'Predicted Sales',
      currentValue: prevSales,
      forecastValue: monthlySales,
      unit: '',
      trend: trendToCardTrend(report.sales.monthly.points[0]?.trend_direction ?? 'stable'),
      confidencePlaceholder: '±6%',
      modelName: report.sales.monthly.model_name,
      horizon: `${report.sales.monthly.horizon} months`,
    },
    {
      id: 'demand',
      label: 'Expected Demand',
      currentValue: totalDemand * 0.94,
      forecastValue: totalDemand,
      unit: 'units',
      trend: 'up',
      confidencePlaceholder: '±7%',
      modelName: report.demand.product_demand[0]?.model_name ?? 'moving_average',
      horizon: '30 days',
    },
    {
      id: 'stockout',
      label: 'Stock-out Risk',
      currentValue: report.inventory.aggregate_stock_out_risk * 100,
      forecastValue: report.inventory.aggregate_stock_out_risk * 100,
      unit: '%',
      trend: report.inventory.aggregate_stock_out_risk > 0.5 ? 'down' : 'neutral',
      confidencePlaceholder: 'risk index',
      modelName: 'inventory_risk',
      horizon: '14 days',
    },
    {
      id: 'accuracy',
      label: 'Forecast Accuracy',
      currentValue: report.accuracy.overall_accuracy_score,
      forecastValue: report.accuracy.overall_accuracy_score,
      unit: '%',
      trend: report.accuracy.overall_accuracy_score >= 90 ? 'up' : 'neutral',
      confidencePlaceholder: 'backtest',
      modelName: report.accuracy.metrics[0]?.model_name ?? 'ensemble',
      horizon: 'holdout',
    },
    {
      id: 'growth',
      label: 'Growth Outlook',
      currentValue: growthOutlook,
      forecastValue: growthOutlook + 1,
      unit: 'stores',
      trend: growthOutlook > 0 ? 'up' : growthOutlook < 0 ? 'down' : 'neutral',
      confidencePlaceholder: 'net growth',
      modelName: 'store_classifier',
      horizon: 'quarter',
    },
  ]
}

export function buildCategoryDemandChart(report: ForecastingReport): ChartSeriesPoint[] {
  return report.demand.category_demand.map((row) => ({
    label: row.dimension,
    value: row.predicted_demand,
    direction: row.trend_direction,
  }))
}

export function buildDemandGrowthChart(report: ForecastingReport): ChartSeriesPoint[] {
  const fast = sumDemand(report.demand.fast_moving)
  const slow = sumDemand(report.demand.slow_moving)
  return [
    { label: 'Fast-moving', value: fast },
    { label: 'Slow-moving', value: slow },
    { label: 'Net growth', value: fast - slow },
  ]
}

export function buildForecastingCenterBundle(
  report: ForecastingReport,
  source: 'api' | 'mock',
): ForecastingCenterBundle {
  return {
    report,
    source,
    overviewKpis: buildOverviewKpis(report),
    revenueHistoricalVsForecast: buildHistoricalVsForecastChart(report.revenue.monthly.points),
    salesHistoricalVsForecast: buildHistoricalVsForecastChart(report.sales.weekly.points),
    monthlyRevenueForecast: forecastPointsToChart(report.revenue.monthly.points),
    weeklySalesForecast: forecastPointsToChart(report.sales.weekly.points),
    categoryDemandChart: buildCategoryDemandChart(report),
    demandGrowthChart: buildDemandGrowthChart(report),
  }
}

export function applyScenarioControls(
  baseScenarios: ScenarioResult[],
  controls: ScenarioControls,
): ScenarioResult[] {
  const netAdjustment =
    controls.demandIncreasePct +
    controls.seasonalBoostPct -
    controls.discountImpactPct -
    controls.inventoryConstraintPct

  return baseScenarios.map((scenario) => {
    let multiplier = 1
    if (scenario.scenario === 'optimistic') multiplier = 1 + (netAdjustment + 10) / 100
    if (scenario.scenario === 'realistic') multiplier = 1 + netAdjustment / 100
    if (scenario.scenario === 'pessimistic') multiplier = 1 + (netAdjustment - 10) / 100

    const adjusted = scenario.base_value * multiplier
    return {
      ...scenario,
      adjusted_value: Math.round(adjusted),
      adjustment_pct: Math.round((multiplier - 1) * 100 * 10) / 10,
    }
  })
}

export const ACCURACY_METHODOLOGY = [
  { name: 'MAE', description: 'MAE measures average absolute error.' },
  { name: 'RMSE', description: 'RMSE penalizes larger errors.' },
  { name: 'MAPE', description: 'MAPE shows percentage error.' },
  { name: 'Bias', description: 'Bias shows over/under prediction tendency.' },
] as const

export function formatAccuracyMetric(metric: AccuracyMetrics, field: keyof AccuracyMetrics): string {
  const value = metric[field]
  if (typeof value !== 'number') return '—'
  if (field === 'mape' || field === 'smape' || field === 'accuracy_score') return `${value.toFixed(1)}%`
  if (field === 'bias') return `${value.toFixed(2)}%`
  return value.toLocaleString(undefined, { maximumFractionDigits: 0 })
}
