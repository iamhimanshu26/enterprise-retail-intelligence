import type { KpiMetric } from '@/types/dashboard'

export const KPI_DEFINITIONS: Omit<KpiMetric, 'value' | 'change'>[] = [
  {
    id: 'revenue',
    label: 'Total Revenue',
    format: 'currency',
    trend: 'up',
    comparisonBadge: 'vs last month',
    tooltip: 'Gross revenue across all channels and regions',
  },
  {
    id: 'orders',
    label: 'Total Orders',
    format: 'number',
    trend: 'up',
    comparisonBadge: 'vs last month',
    tooltip: 'Completed and fulfilled order count',
  },
  {
    id: 'customers',
    label: 'Total Customers',
    format: 'number',
    trend: 'up',
    comparisonBadge: 'vs last month',
    tooltip: 'Active customer accounts in the last 90 days',
  },
  {
    id: 'stores',
    label: 'Active Stores',
    format: 'number',
    trend: 'up',
    comparisonBadge: 'net new',
    tooltip: 'Operational retail locations currently active',
  },
  {
    id: 'products',
    label: 'Total Products',
    format: 'number',
    trend: 'up',
    comparisonBadge: 'SKU count',
    tooltip: 'Unique product SKUs available for sale',
  },
  {
    id: 'margin',
    label: 'Profit Margin',
    format: 'percent',
    trend: 'up',
    comparisonBadge: 'vs last month',
    tooltip: 'Net profit margin after COGS and operating costs',
  },
  {
    id: 'inventory',
    label: 'Inventory Value',
    format: 'currency',
    trend: 'down',
    comparisonBadge: 'vs last month',
    tooltip: 'Total value of on-hand inventory at cost',
  },
  {
    id: 'growth',
    label: 'Growth Rate',
    format: 'percent',
    trend: 'up',
    comparisonBadge: 'YoY',
    tooltip: 'Year-over-year revenue growth rate',
  },
]

export const KPI_BASE_VALUES: Record<string, { value: number; change: number }> = {
  revenue: { value: 124_800_000, change: 14.8 },
  orders: { value: 892_450, change: 11.2 },
  customers: { value: 2_420_000, change: 8.6 },
  stores: { value: 847, change: 12 },
  products: { value: 12_400, change: 4.2 },
  margin: { value: 23.4, change: 1.8 },
  inventory: { value: 48_200_000, change: -2.4 },
  growth: { value: 14.8, change: 3.2 },
}

export function buildKpiMetrics(multiplier: number): KpiMetric[] {
  return KPI_DEFINITIONS.map((kpi) => {
    const base = KPI_BASE_VALUES[kpi.id]
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
