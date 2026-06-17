import { describe, expect, it } from 'vitest'
import { buildExecutiveVisualizationBundle } from './executiveStudioAdapters'
import {
  mockAnalyticsReport,
  mockIntelligenceReport,
  mockStatisticsReport,
} from '../adapters/dashboardFixtures'

describe('executiveStudioAdapters', () => {
  it('builds KPI performance board with eight metrics', () => {
    const bundle = buildExecutiveVisualizationBundle(
      mockAnalyticsReport,
      mockStatisticsReport,
      mockIntelligenceReport,
    )
    expect(bundle.kpiBoard.length).toBe(8)
    expect(bundle.kpiBoard.map((k) => k.id)).toContain('revenue')
    expect(bundle.kpiBoard.map((k) => k.id)).toContain('business-health')
  })

  it('maps target vs actual metrics', () => {
    const bundle = buildExecutiveVisualizationBundle(
      mockAnalyticsReport,
      mockStatisticsReport,
      mockIntelligenceReport,
    )
    expect(bundle.targetVsActual.length).toBe(5)
    expect(bundle.targetVsActual[0].label).toBe('Revenue')
  })

  it('includes business health and intelligence outputs', () => {
    const bundle = buildExecutiveVisualizationBundle(
      mockAnalyticsReport,
      mockStatisticsReport,
      mockIntelligenceReport,
    )
    expect(bundle.businessHealth.overallScore).toBe(82)
    expect(bundle.anomalies.length).toBeGreaterThan(0)
    expect(bundle.recommendations.length).toBeGreaterThan(0)
    expect(bundle.trendComparison.length).toBeGreaterThan(0)
    expect(bundle.source).toBe('live')
  })
})
