import { describe, expect, it } from 'vitest'
import {
  applyScenarioControls,
  buildForecastingCenterBundle,
  buildHistoricalVsForecastChart,
  buildOverviewKpis,
} from '../adapters/forecastingAdapter'
import { FORECASTING_MOCK_REPORT } from '../mock/forecastingMock'

describe('forecastingAdapter', () => {
  it('builds overview KPIs from report', () => {
    const kpis = buildOverviewKpis(FORECASTING_MOCK_REPORT)
    expect(kpis.length).toBe(6)
    expect(kpis[0].label).toBe('Predicted Revenue')
    expect(kpis[0].forecastValue).toBeGreaterThan(0)
  })

  it('builds historical vs forecast chart data', () => {
    const chart = buildHistoricalVsForecastChart(FORECASTING_MOCK_REPORT.revenue.monthly.points)
    expect(chart.length).toBeGreaterThan(0)
    expect(chart[0].value).toBeLessThan(chart[0].secondary as number)
  })

  it('builds center bundle with mock source', () => {
    const bundle = buildForecastingCenterBundle(FORECASTING_MOCK_REPORT, 'mock')
    expect(bundle.source).toBe('mock')
    expect(bundle.monthlyRevenueForecast.length).toBeGreaterThan(0)
    expect(bundle.categoryDemandChart.length).toBe(4)
  })

  it('applies scenario control adjustments', () => {
    const base = FORECASTING_MOCK_REPORT.scenarios.scenarios
    const adjusted = applyScenarioControls(base, {
      demandIncreasePct: 10,
      discountImpactPct: 0,
      seasonalBoostPct: 5,
      inventoryConstraintPct: 0,
    })
    const realistic = adjusted.find((s) => s.scenario === 'realistic')
    expect(realistic?.adjusted_value).toBeGreaterThan(realistic?.base_value ?? 0)
  })
})
