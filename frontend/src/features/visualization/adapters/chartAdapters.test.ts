import { describe, expect, it } from 'vitest'
import {
  breakdownToChartData,
  distributionToChartData,
  kpiToChartData,
  timeSeriesToChartData,
} from '../adapters/chartAdapters'

describe('chartAdapters', () => {
  it('maps analytics breakdown rows', () => {
    const result = breakdownToChartData([
      { dimension: 'Tokyo', value: 1000, count: 5, percentage: 40 },
    ])
    expect(result[0]).toEqual({
      label: 'Tokyo',
      value: 1000,
      secondary: 5,
      percentage: 40,
    })
  })

  it('maps time series points', () => {
    const result = timeSeriesToChartData([
      { period: '2024-01', revenue: 5000, orders: 10, growth_pct: 5 },
    ])
    expect(result[0].label).toBe('2024-01')
    expect(result[0].value).toBe(5000)
    expect(result[0].secondary).toBe(10)
  })

  it('maps distribution buckets', () => {
    const result = distributionToChartData([{ label: 'A', count: 2, percentage: 50 }])
    expect(result[0].value).toBe(50)
  })

  it('maps kpi metrics', () => {
    const result = kpiToChartData([{ label: 'Revenue', value: 100, unit: 'JPY' }])
    expect(result[0].label).toBe('Revenue')
    expect(result[0].unit).toBe('JPY')
  })
})
