import type { SalesRevenuePeriod } from '@/types/dashboard'

const BASE_PERIODS: Omit<SalesRevenuePeriod, 'revenue' | 'previousRevenue' | 'growth'>[] = [
  { id: 'daily', label: 'Daily Revenue', trend: 'up', comparisonLabel: 'vs yesterday' },
  { id: 'weekly', label: 'Weekly Revenue', trend: 'up', comparisonLabel: 'vs last week' },
  { id: 'monthly', label: 'Monthly Revenue', trend: 'up', comparisonLabel: 'vs last month' },
  { id: 'quarterly', label: 'Quarterly Revenue', trend: 'up', comparisonLabel: 'vs last quarter' },
  { id: 'yearly', label: 'Yearly Revenue', trend: 'up', comparisonLabel: 'vs last year' },
]

const BASE_VALUES = [
  { revenue: 4_280_000, previous: 3_920_000, growth: 9.2 },
  { revenue: 28_400_000, previous: 25_100_000, growth: 13.1 },
  { revenue: 124_800_000, previous: 108_600_000, growth: 14.8 },
  { revenue: 342_500_000, previous: 298_400_000, growth: 14.8 },
  { revenue: 1_248_000_000, previous: 1_086_000_000, growth: 14.9 },
]

export function buildSalesRevenuePeriods(multiplier: number): SalesRevenuePeriod[] {
  return BASE_PERIODS.map((period, i) => {
    const base = BASE_VALUES[i]
    const revenue = Math.round(base.revenue * multiplier)
    const previousRevenue = Math.round(base.previous * multiplier)
    return {
      ...period,
      revenue,
      previousRevenue,
      growth: base.growth,
      trend: base.growth >= 0 ? 'up' : 'down',
    }
  })
}
