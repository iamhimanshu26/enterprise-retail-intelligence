import { buildCustomerOverview } from './customers-bi'
import { buildInventoryOverview } from './inventory'
import { buildRegionPerformance } from './regions'
import { buildSalesRevenuePeriods } from './sales-bi'
import { buildExecutiveWidgets } from './widgets'
import { getActivityEvents } from './activity'
import { MOCK_ALERTS } from './alerts'
import { buildChartDatasets } from './charts'
import { REGION_OPTIONS } from './customers'
import { buildKpiMetrics } from './kpis'
import { BASE_TOP_PRODUCTS, CATEGORY_OPTIONS } from './products'
import { BASE_STORE_RANKINGS, STORE_OPTIONS } from './stores'
import {
  MOCK_BUSINESS_SUMMARY,
  MOCK_EXECUTIVE_SUMMARY,
  MOCK_REGIONAL_HIGHLIGHTS,
} from './summary'
import type {
  DashboardQueryParams,
  ExecutiveDashboardData,
  QuickAction,
  StoreRow,
} from '@/types/dashboard'

const WORKSPACE_MULTIPLIERS: Record<string, number> = {
  'north-america': 1.0,
  europe: 0.72,
  'asia-pacific': 0.85,
}

const DATE_RANGE_MULTIPLIERS: Record<string, number> = {
  '7d': 0.28,
  '30d': 1.0,
  '90d': 2.85,
  ytd: 4.2,
}

export const MOCK_QUICK_ACTIONS: QuickAction[] = [
  { id: 'qa1', label: 'Generate Retail Data', path: '/generator' },
  { id: 'qa2', label: 'ETL Pipeline', path: '/etl' },
  { id: 'qa3', label: 'Statistics Lab', path: '/statistics' },
  { id: 'qa4', label: 'Forecast Center', path: '/forecasting' },
  { id: 'qa5', label: 'Pipeline Monitor', path: '/pipeline' },
  { id: 'qa6', label: 'Engineering Architecture', path: '/engineering' },
]

function getMultiplier(params: DashboardQueryParams): number {
  const workspaceMultiplier = WORKSPACE_MULTIPLIERS[params.workspaceId] ?? 1
  const dateMultiplier = DATE_RANGE_MULTIPLIERS[params.dateRange] ?? 1
  const regionMultiplier = params.region === 'all' ? 1 : 0.42
  const storeMultiplier = params.store === 'all' ? 1 : 0.18
  const categoryMultiplier = params.category === 'all' ? 1 : 0.35
  return workspaceMultiplier * dateMultiplier * regionMultiplier * storeMultiplier * categoryMultiplier
}

function filterProducts(category: string) {
  if (category === 'all') return BASE_TOP_PRODUCTS
  return BASE_TOP_PRODUCTS.filter((p) => p.category === category)
}

function filterStores(region: string): StoreRow[] {
  if (region === 'all') return BASE_STORE_RANKINGS
  const regionMap: Record<string, string> = {
    'North America': 'North America',
    Europe: 'Europe',
    APAC: 'APAC',
    Tokyo: 'APAC',
    Kansai: 'APAC',
  }
  const mapped = regionMap[region] ?? region
  return BASE_STORE_RANKINGS.filter((s) => s.region === mapped)
}

function scaleStoreRows(rows: StoreRow[], multiplier: number): StoreRow[] {
  return rows.map((row) => ({
    ...row,
    revenue: Math.round(row.revenue * multiplier),
    orders: Math.round(row.orders * multiplier),
    profit: Math.round(row.profit * multiplier),
  }))
}

export async function fetchExecutiveDashboard(
  params: DashboardQueryParams,
): Promise<ExecutiveDashboardData> {
  await new Promise((resolve) => setTimeout(resolve, 450))

  const multiplier = getMultiplier(params)
  const charts = buildChartDatasets(multiplier)

  return {
    kpis: buildKpiMetrics(multiplier),
    businessSummary: MOCK_BUSINESS_SUMMARY,
    executiveSummary: MOCK_EXECUTIVE_SUMMARY,
    regionalHighlights: MOCK_REGIONAL_HIGHLIGHTS,
    revenueTrend: charts.revenueTrend,
    monthlySales: charts.monthlySales,
    topCategories: charts.topCategories,
    storePerformance: charts.storePerformance,
    customerGrowth: charts.customerGrowth,
    revenueByRegion: charts.revenueByRegion,
    inventoryDistribution: charts.inventoryDistribution,
    topProducts: filterProducts(params.category),
    storeRankings: scaleStoreRows(filterStores(params.region).slice(0, 10), multiplier),
    alerts: MOCK_ALERTS,
    activities: getActivityEvents(),
    quickActions: MOCK_QUICK_ACTIONS,
    salesRevenue: buildSalesRevenuePeriods(multiplier),
    regionPerformance: buildRegionPerformance(multiplier),
    customerOverview: buildCustomerOverview(multiplier),
    inventoryOverview: buildInventoryOverview(multiplier),
    executiveWidgets: buildExecutiveWidgets(multiplier),
  }
}

export { CATEGORY_OPTIONS, REGION_OPTIONS, STORE_OPTIONS }
