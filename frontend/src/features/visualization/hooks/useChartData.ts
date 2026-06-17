import { useQuery } from '@tanstack/react-query'
import { runAnalyticsSample, runStatisticsSample } from '@/lib/dataServiceApi'
import {
  breakdownToChartData,
  distributionToChartData,
  kpiToChartData,
  regionalToChartData,
  timeSeriesToChartData,
  type ChartSeriesPoint,
} from '../adapters/chartAdapters'

export interface VisualizationChartData {
  revenue: {
    daily: ChartSeriesPoint[]
    monthly: ChartSeriesPoint[]
    byRegion: ChartSeriesPoint[]
    byCategory: ChartSeriesPoint[]
    byStore: ChartSeriesPoint[]
  }
  customer: {
    segments: ChartSeriesPoint[]
    membership: ChartSeriesPoint[]
    contribution: ChartSeriesPoint[]
  }
  product: {
    topRevenue: ChartSeriesPoint[]
    categoryPerformance: ChartSeriesPoint[]
    brandPerformance: ChartSeriesPoint[]
  }
  inventory: {
    reorderHeatmap: ChartSeriesPoint[]
    categoryExposure: ChartSeriesPoint[]
  }
  regional: ChartSeriesPoint[]
  timeSeries: {
    daily: ChartSeriesPoint[]
    monthly: ChartSeriesPoint[]
    quarterly: ChartSeriesPoint[]
  }
  kpi: ChartSeriesPoint[]
  source: 'live' | 'mock'
}

function buildFromAnalyticsAndStatistics(
  analytics: Awaited<ReturnType<typeof runAnalyticsSample>>,
  statistics: Awaited<ReturnType<typeof runStatisticsSample>>,
): VisualizationChartData {
  return {
    revenue: {
      daily: breakdownToChartData(analytics.sales.by_day),
      monthly: breakdownToChartData(analytics.sales.by_month),
      byRegion: breakdownToChartData(analytics.sales.by_region),
      byCategory: breakdownToChartData(analytics.sales.by_category),
      byStore: breakdownToChartData(analytics.sales.by_store),
    },
    customer: {
      segments: breakdownToChartData(analytics.customers.segments),
      membership: breakdownToChartData(analytics.customers.membership_distribution),
      contribution: breakdownToChartData(analytics.customers.revenue_contribution),
    },
    product: {
      topRevenue: analytics.products.top_by_revenue.map((p) => ({
        label: p.product_code,
        value: p.revenue,
        secondary: p.units_sold,
      })),
      categoryPerformance: breakdownToChartData(analytics.products.category_performance),
      brandPerformance: breakdownToChartData(analytics.products.brand_performance),
    },
    inventory: {
      reorderHeatmap: analytics.inventory.reorder_candidates.map((item) => ({
        label: item.product_code,
        value: item.risk_score,
        secondary: item.stock_on_hand,
      })),
      categoryExposure: breakdownToChartData(analytics.products.category_performance.slice(0, 8)),
    },
    regional: breakdownToChartData(analytics.sales.by_region),
    timeSeries: {
      daily: timeSeriesToChartData(statistics.time_series.daily),
      monthly: timeSeriesToChartData(statistics.time_series.monthly),
      quarterly: timeSeriesToChartData(statistics.time_series.quarterly),
    },
    kpi: kpiToChartData(
      analytics.kpis.metrics.map((m) => ({ label: m.label, value: m.value, unit: m.unit })),
    ),
    source: 'live',
  }
}

export function useChartData() {
  return useQuery({
    queryKey: ['visualization-chart-data'],
    queryFn: async () => {
      const [analytics, statistics] = await Promise.all([
        runAnalyticsSample(),
        runStatisticsSample(),
      ])
      return buildFromAnalyticsAndStatistics(analytics, statistics)
    },
    staleTime: 60_000,
    retry: 1,
  })
}

export { regionalToChartData, breakdownToChartData, distributionToChartData }
