import { describe, expect, it } from 'vitest'
import { formatChartValue, shortenLabel } from '../utils/chartFormatter'

describe('chartFormatter', () => {
  it('formats currency values', () => {
    expect(formatChartValue(1250000, 'currency')).toMatch(/\$|¥/)
  })

  it('formats percent values', () => {
    expect(formatChartValue(14.2, 'percent')).toContain('%')
  })

  it('shortens long labels', () => {
    expect(shortenLabel('Very Long Label Name', 10)).toHaveLength(10)
  })
})
