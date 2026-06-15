import type {
  ActivityEvent,
  BusinessAlert,
  BusinessSummaryItem,
  DashboardQueryParams,
  ExecutiveDashboardData,
  ExecutiveSummary,
  KpiMetric,
  QuickAction,
  RegionalHighlight,
} from '@/types/dashboard'
import { BASE_CUSTOMER_GROWTH, REGION_OPTIONS } from './customers'
import { BASE_INVENTORY_DISTRIBUTION, BASE_TOP_PRODUCTS, CATEGORY_OPTIONS } from './products'
import {
  BASE_MONTHLY_SALES,
  BASE_REVENUE_BY_REGION,
  BASE_REVENUE_TREND,
  BASE_TOP_CATEGORIES,
  scaleChartData,
} from './sales'
import { BASE_STORE_PERFORMANCE, BASE_STORE_RANKINGS, STORE_OPTIONS } from './stores'

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

const BASE_KPIS: Omit<KpiMetric, 'value' | 'change'>[] = [
  { id: 'revenue', label: 'Total Revenue', format: 'currency', trend: 'up', comparisonBadge: 'vs last month', tooltip: 'Gross revenue across all channels and regions' },
  { id: 'orders', label: 'Total Orders', format: 'number', trend: 'up', comparisonBadge: 'vs last month', tooltip: 'Completed and fulfilled order count' },
  { id: 'customers', label: 'Total Customers', format: 'number', trend: 'up', comparisonBadge: 'vs last month', tooltip: 'Active customer accounts in the last 90 days' },
  { id: 'stores', label: 'Active Stores', format: 'number', trend: 'up', comparisonBadge: 'net new', tooltip: 'Operational retail locations currently active' },
  { id: 'products', label: 'Total Products', format: 'number', trend: 'up', comparisonBadge: 'SKU count', tooltip: 'Unique product SKUs available for sale' },
  { id: 'margin', label: 'Profit Margin', format: 'percent', trend: 'up', comparisonBadge: 'vs last month', tooltip: 'Net profit margin after COGS and operating costs' },
  { id: 'inventory', label: 'Inventory Value', format: 'currency', trend: 'down', comparisonBadge: 'vs last month', tooltip: 'Total value of on-hand inventory at cost' },
  { id: 'growth', label: 'Growth Rate', format: 'percent', trend: 'up', comparisonBadge: 'YoY', tooltip: 'Year-over-year revenue growth rate' },
]

const BASE_KPI_VALUES: Record<string, { value: number; change: number }> = {
  revenue: { value: 124_800_000, change: 14.8 },
  orders: { value: 892_450, change: 11.2 },
  customers: { value: 2_420_000, change: 8.6 },
  stores: { value: 847, change: 12 },
  products: { value: 12_400, change: 4.2 },
  margin: { value: 23.4, change: 1.8 },
  inventory: { value: 48_200_000, change: -2.4 },
  growth: { value: 14.8, change: 3.2 },
}

const BASE_BUSINESS_SUMMARY: BusinessSummaryItem[] = [
  { id: 'bs1', label: 'Average Order Value', value: '$139.80', change: '+6.4%', trend: 'up', description: 'Up from $131.40 last period' },
  { id: 'bs2', label: 'Conversion Rate', value: '3.8%', change: '+0.4pp', trend: 'up', description: 'E-commerce conversion improved across mobile' },
  { id: 'bs3', label: 'Return Rate', value: '2.1%', change: '-0.3pp', trend: 'up', description: 'Quality improvements reduced product returns' },
  { id: 'bs4', label: 'Fulfillment SLA', value: '98.6%', change: '+1.2pp', trend: 'up', description: 'Same-day and next-day delivery performance' },
]

const BASE_EXECUTIVE_SUMMARY: ExecutiveSummary = {
  summary: 'Revenue increased by 14.8% compared to last month, driven by electronics and APAC expansion.',
  highlights: [
    'Electronics remain the highest-performing category with 34.2% share.',
    'Tokyo region contributes 32% of total sales.',
    'Customer acquisition grew 8.6% with strong mobile conversion.',
  ],
}

const BASE_REGIONAL_HIGHLIGHTS: RegionalHighlight[] = [
  { id: 'rh1', label: 'Top Performing Region', region: 'Tokyo', value: '$39.9M', metric: 'Revenue', trend: 'up' },
  { id: 'rh2', label: 'Lowest Performing Region', region: 'Kansai', value: '$8.2M', metric: 'Revenue', trend: 'down' },
  { id: 'rh3', label: 'Fastest Growing Region', region: 'Southeast Asia', value: '+24.6%', metric: 'Growth', trend: 'up' },
  { id: 'rh4', label: 'Highest Profit Region', region: 'North America', value: '28.4%', metric: 'Margin', trend: 'up' },
]

const BASE_ALERTS: BusinessAlert[] = [
  { id: 'a1', title: 'Low inventory detected', message: 'Outdoor Patio Set stock below reorder threshold in 12 stores.', severity: 'warning', timestamp: new Date(Date.now() - 45 * 60_000).toISOString() },
  { id: 'a2', title: 'Revenue declined in Kansai region', message: 'Kansai revenue down 4.2% week-over-week. Review local promotions.', severity: 'critical', timestamp: new Date(Date.now() - 2 * 3600_000).toISOString() },
  { id: 'a3', title: 'Promotion campaign ending soon', message: 'SmartWatch Series X promotion expires in 3 days.', severity: 'info', timestamp: new Date(Date.now() - 5 * 3600_000).toISOString() },
  { id: 'a4', title: 'Supplier delay detected', message: 'Premium Denim Collection shipment delayed by 48 hours from supplier #4421.', severity: 'warning', timestamp: new Date(Date.now() - 8 * 3600_000).toISOString() },
]

const BASE_ACTIVITIES: ActivityEvent[] = [
  { id: 'act1', title: 'Sales report generated', description: 'Weekly executive sales summary exported to PDF.', category: 'Reporting', timestamp: new Date(Date.now() - 20 * 60_000).toISOString() },
  { id: 'act2', title: 'New store added', description: 'Singapore Marina Bay location activated in APAC workspace.', category: 'Operations', timestamp: new Date(Date.now() - 3 * 3600_000).toISOString() },
  { id: 'act3', title: 'Forecast completed', description: 'Q1 demand forecast model run completed with 94.2% accuracy.', category: 'Forecasting', timestamp: new Date(Date.now() - 6 * 3600_000).toISOString() },
  { id: 'act4', title: 'Pipeline executed', description: 'Daily ETL pipeline ingested 2.4M transaction records.', category: 'ETL', timestamp: new Date(Date.now() - 12 * 3600_000).toISOString() },
  { id: 'act5', title: 'Inventory updated', description: 'Stock levels synchronized across 847 active stores.', category: 'Inventory', timestamp: new Date(Date.now() - 18 * 3600_000).toISOString() },
]

const QUICK_ACTIONS: QuickAction[] = [
  { id: 'qa1', label: 'Generate Retail Data', path: '/generator' },
  { id: 'qa2', label: 'Run ETL', path: '/etl' },
  { id: 'qa3', label: 'View Forecast', path: '/forecasting' },
  { id: 'qa4', label: 'Open Statistics Lab', path: '/statistics' },
  { id: 'qa5', label: 'Pipeline Monitor', path: '/pipeline' },
]

function getMultiplier(params: DashboardQueryParams): number {
  const workspaceMultiplier = WORKSPACE_MULTIPLIERS[params.workspaceId] ?? 1
  const dateMultiplier = DATE_RANGE_MULTIPLIERS[params.dateRange] ?? 1
  const regionMultiplier = params.region === 'all' ? 1 : 0.42
  const storeMultiplier = params.store === 'all' ? 1 : 0.18
  const categoryMultiplier = params.category === 'all' ? 1 : 0.35
  return workspaceMultiplier * dateMultiplier * regionMultiplier * storeMultiplier * categoryMultiplier
}

function buildKpis(multiplier: number): KpiMetric[] {
  return BASE_KPIS.map((kpi) => {
    const base = BASE_KPI_VALUES[kpi.id]
    const value =
      kpi.format === 'percent' && kpi.id !== 'growth'
        ? base.value
        : kpi.format === 'percent'
          ? base.value + (multiplier - 1) * 2
          : base.value * multiplier

    return {
      ...kpi,
      value: Number(value.toFixed(kpi.format === 'percent' ? 1 : 0)),
      change: base.change,
      trend: kpi.id === 'inventory' ? 'down' : 'up',
    }
  })
}

function filterProducts(category: string) {
  if (category === 'all') return BASE_TOP_PRODUCTS
  return BASE_TOP_PRODUCTS.filter((p) => p.category === category)
}

function filterStores(region: string) {
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

export async function fetchExecutiveDashboard(
  params: DashboardQueryParams,
): Promise<ExecutiveDashboardData> {
  await new Promise((resolve) => setTimeout(resolve, 450))

  const multiplier = getMultiplier(params)

  return {
    kpis: buildKpis(multiplier),
    businessSummary: BASE_BUSINESS_SUMMARY,
    executiveSummary: BASE_EXECUTIVE_SUMMARY,
    regionalHighlights: BASE_REGIONAL_HIGHLIGHTS,
    revenueTrend: scaleChartData(BASE_REVENUE_TREND, multiplier),
    monthlySales: scaleChartData(BASE_MONTHLY_SALES, multiplier),
    topCategories: scaleChartData(BASE_TOP_CATEGORIES, multiplier),
    storePerformance: scaleChartData(BASE_STORE_PERFORMANCE, multiplier),
    customerGrowth: scaleChartData(BASE_CUSTOMER_GROWTH, multiplier),
    revenueByRegion: BASE_REVENUE_BY_REGION,
    inventoryDistribution: BASE_INVENTORY_DISTRIBUTION,
    topProducts: filterProducts(params.category),
    storeRankings: filterStores(params.region).slice(0, 10),
    alerts: BASE_ALERTS,
    activities: BASE_ACTIVITIES,
    quickActions: QUICK_ACTIONS,
  }
}

export { CATEGORY_OPTIONS, REGION_OPTIONS, STORE_OPTIONS }
