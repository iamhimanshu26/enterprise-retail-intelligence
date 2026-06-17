import { describe, expect, it } from 'vitest'
import { buildOperationsCenterBundle } from '../adapters/operationsAdapter'
import { MONITORING_MOCK_REPORT } from '../mock/monitoringMock'

describe('operationsAdapter', () => {
  it('builds operations center bundle from mock report', () => {
    const bundle = buildOperationsCenterBundle(MONITORING_MOCK_REPORT, 'mock')
    expect(bundle.source).toBe('mock')
    expect(bundle.report.pipeline_modules.length).toBe(8)
    expect(bundle.qualityHistoryChart.length).toBeGreaterThan(0)
    expect(bundle.failureByCategoryChart.length).toBeGreaterThan(0)
  })

  it('builds failure charts from failure records', () => {
    const bundle = buildOperationsCenterBundle(MONITORING_MOCK_REPORT, 'mock')
    expect(bundle.failureBySeverityChart[0].label).toBeTruthy()
    expect(bundle.metricsChart.length).toBe(4)
  })
})
