import { useQuery } from '@tanstack/react-query'
import {
  getExecutionHistory,
  getQualityDashboard,
  runAnalyticsSample,
  runExecutiveIntelligenceSample,
  runStatisticsSample,
} from '@/lib/dataServiceApi'
import type { DashboardFilters } from '@/types/dashboard'
import { useDashboardStore } from '@/stores/dashboardStore'
import { buildInteractiveDashboardBundle, type InteractiveDashboardBundle } from '../adapters/dashboardAdapters'
import { applyDashboardFilters } from '../adapters/filterChartData'
import type { ChartSeriesPoint } from '../adapters/chartAdapters'

function applyFiltersToBundle(
  bundle: InteractiveDashboardBundle,
  filters: DashboardFilters,
): InteractiveDashboardBundle {
  const mapSeries = (series: ChartSeriesPoint[]) => applyDashboardFilters(series, filters)

  return {
    ...bundle,
    sales: {
      ...bundle.sales,
      revenueTrend: mapSeries(bundle.sales.revenueTrend),
      monthlyGrowth: mapSeries(bundle.sales.monthlyGrowth),
      byRegion: mapSeries(bundle.sales.byRegion),
      byCategory: mapSeries(bundle.sales.byCategory),
      byPayment: mapSeries(bundle.sales.byPayment),
      topSalesDays: mapSeries(bundle.sales.topSalesDays),
      lowSalesDays: mapSeries(bundle.sales.lowSalesDays),
      storeComparison: mapSeries(bundle.sales.storeComparison),
    },
    inventory: {
      ...bundle.inventory,
      stockRiskHeatmap: mapSeries(bundle.inventory.stockRiskHeatmap),
      movementDistribution: mapSeries(bundle.inventory.movementDistribution),
    },
    customer: {
      ...bundle.customer,
      growthTrend: mapSeries(bundle.customer.growthTrend),
      segmentSpend: mapSeries(bundle.customer.segmentSpend),
    },
    product: {
      ...bundle.product,
      topByRevenue: mapSeries(bundle.product.topByRevenue),
      categoryContribution: mapSeries(bundle.product.categoryContribution),
    },
    regional: {
      ...bundle.regional,
      revenue: mapSeries(bundle.regional.revenue),
      orders: mapSeries(bundle.regional.orders),
    },
    source: bundle.source,
  }
}

export function useInteractiveDashboardData() {
  const dateRange = useDashboardStore((s) => s.dateRange)
  const region = useDashboardStore((s) => s.region)
  const store = useDashboardStore((s) => s.store)
  const category = useDashboardStore((s) => s.category)

  return useQuery({
    queryKey: ['interactive-dashboard-data', dateRange, region, store, category],
    queryFn: async () => {
      const [analytics, statistics, intelligence, quality, history] = await Promise.all([
        runAnalyticsSample(),
        runStatisticsSample(),
        runExecutiveIntelligenceSample(),
        getQualityDashboard(),
        getExecutionHistory(10),
      ])
      const bundle = buildInteractiveDashboardBundle(
        analytics,
        statistics,
        intelligence,
        quality,
        history.executions ?? [],
      )
      return applyFiltersToBundle(bundle, { dateRange, region, store, category })
    },
    staleTime: 60_000,
    retry: 1,
  })
}
