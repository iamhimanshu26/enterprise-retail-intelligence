import { describe, expect, it } from 'vitest'
import { CHART_COLORS, CHART_THEME, getChartColor } from '../utils/chartTheme'

describe('chartTheme', () => {
  it('provides enterprise color palette', () => {
    expect(CHART_COLORS.length).toBeGreaterThanOrEqual(5)
  })

  it('cycles chart colors', () => {
    expect(getChartColor(0)).toBe(CHART_COLORS[0])
    expect(getChartColor(CHART_COLORS.length)).toBe(CHART_COLORS[0])
  })

  it('defines axis and grid theme tokens', () => {
    expect(CHART_THEME.margin).toBeDefined()
    expect(CHART_THEME.axis.tick.fontSize).toBe(11)
  })
})
