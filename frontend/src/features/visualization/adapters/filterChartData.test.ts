import { describe, expect, it } from 'vitest'
import { applyDashboardFilters, hasChartData } from './filterChartData'

const sampleData = [
  { label: 'Tokyo', value: 100 },
  { label: 'Osaka', value: 80 },
  { label: 'Kyoto', value: 60 },
]

describe('filterChartData', () => {
  it('scales values for shorter date ranges', () => {
    const filtered = applyDashboardFilters(sampleData, {
      dateRange: '7d',
      region: 'all',
      store: 'all',
      category: 'all',
    })
    expect(filtered[0].value).toBe(25)
  })

  it('returns subset when region filter is applied', () => {
    const filtered = applyDashboardFilters(sampleData, {
      dateRange: '30d',
      region: 'tokyo',
      store: 'all',
      category: 'all',
    })
    expect(filtered.some((p) => p.label === 'Tokyo')).toBe(true)
  })

  it('detects empty chart data', () => {
    expect(hasChartData([])).toBe(false)
    expect(hasChartData(sampleData)).toBe(true)
    expect(hasChartData(undefined)).toBe(false)
  })
})
