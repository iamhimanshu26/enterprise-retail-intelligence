import { describe, expect, it } from 'vitest'
import {
  buildExecutiveDashboard,
  buildInteractiveDashboardBundle,
  buildSalesDashboard,
} from './dashboardAdapters'
import {
  mockAnalyticsReport,
  mockExecutionHistory,
  mockIntelligenceReport,
  mockQualityScore,
  mockStatisticsReport,
} from './dashboardFixtures'

describe('dashboardAdapters', () => {
  it('maps sales analytics into chart-ready series', () => {
    const sales = buildSalesDashboard(mockAnalyticsReport)
    expect(sales.revenueTrend.length).toBeGreaterThan(0)
    expect(sales.revenueTrend[0]).toMatchObject({ label: '2024-01-01', value: 5000 })
    expect(sales.byRegion.some((p) => p.label === 'Tokyo')).toBe(true)
    expect(sales.storeComparison.length).toBe(2)
  })

  it('builds executive dashboard from intelligence output', () => {
    const executive = buildExecutiveDashboard(mockIntelligenceReport)
    expect(executive.businessHealth[0]?.value).toBe(82)
    expect(executive.kpiStatusDistribution.length).toBe(2)
    expect(executive.targetVsActual[0]?.secondary).toBe(95000)
  })

  it('assembles full interactive dashboard bundle', () => {
    const bundle = buildInteractiveDashboardBundle(
      mockAnalyticsReport,
      mockStatisticsReport,
      mockIntelligenceReport,
      mockQualityScore,
      mockExecutionHistory,
    )
    expect(bundle.source).toBe('live')
    expect(bundle.sales.byCategory.length).toBeGreaterThan(0)
    expect(bundle.inventory.reorderTable.length).toBe(1)
    expect(bundle.regional.revenue.length).toBe(2)
    expect(bundle.etlQuality.dimensions.length).toBe(5)
    expect(bundle.executive.scorecard.length).toBe(2)
  })
})
