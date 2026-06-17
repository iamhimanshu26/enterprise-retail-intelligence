import type { ChartSeriesPoint } from './chartAdapters'
import type { DashboardFilters } from '@/types/dashboard'

/** Client-side filter scaling — API-ready placeholder until backend filtering. */
export function applyDashboardFilters<T extends ChartSeriesPoint>(
  data: T[],
  filters: DashboardFilters,
): T[] {
  if (!data.length) return data

  let filtered = [...data]

  if (filters.region !== 'all') {
    filtered = filtered.filter(
      (point) =>
        point.label.toLowerCase().includes(filters.region.replace('-', ' ')) ||
        filters.region === 'all',
    )
    if (filtered.length === 0) filtered = data.slice(0, Math.max(3, Math.floor(data.length / 2)))
  }

  const multiplier =
    filters.dateRange === '7d' ? 0.25 : filters.dateRange === '90d' ? 1.15 : filters.dateRange === 'ytd' ? 1.3 : 1

  return filtered.map((point) => ({
    ...point,
    value: Math.round(point.value * multiplier * 100) / 100,
    secondary:
      point.secondary != null
        ? Math.round(Number(point.secondary) * multiplier * 100) / 100
        : undefined,
  }))
}

export function hasChartData(data: ChartSeriesPoint[] | undefined): boolean {
  return Boolean(data && data.length > 0)
}
