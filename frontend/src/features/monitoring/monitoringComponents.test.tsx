import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { DataQualityCenter } from './components/DataQualityCenter'
import { FailureAnalysisCenter } from './components/FailureAnalysisCenter'
import { OperationalKpiSummary } from './components/OperationalKpiSummary'
import { PipelineStatusBoard } from './components/PipelineStatusBoard'
import { RetryManagementDashboard } from './components/RetryManagementDashboard'
import { LineageVisualization } from './components/LineageVisualization'
import { MONITORING_MOCK_REPORT } from './mock/monitoringMock'
import { buildOperationsCenterBundle } from './adapters/operationsAdapter'

const bundle = buildOperationsCenterBundle(MONITORING_MOCK_REPORT, 'mock')

afterEach(() => cleanup())

describe('OperationalKpiSummary', () => {
  it('renders KPI cards', () => {
    render(<OperationalKpiSummary kpis={bundle.report.operational_kpis} />)
    expect(screen.getByText('Total Pipeline Runs')).toBeInTheDocument()
    expect(screen.getByText('Platform Health')).toBeInTheDocument()
  })

  it('renders loading state', () => {
    render(<OperationalKpiSummary kpis={bundle.report.operational_kpis} loading />)
    expect(screen.queryByText('Total Pipeline Runs')).not.toBeInTheDocument()
  })
})

describe('PipelineStatusBoard', () => {
  it('renders module cards', () => {
    render(<PipelineStatusBoard modules={bundle.report.pipeline_modules} />)
    expect(screen.getByText('Synthetic Data Generator')).toBeInTheDocument()
    expect(screen.getByText('Forecasting Engine')).toBeInTheDocument()
  })
})

describe('DataQualityCenter', () => {
  it('renders quality dimensions', () => {
    render(
      <DataQualityCenter
        quality={bundle.report.quality}
        historyChart={bundle.qualityHistoryChart}
      />,
    )
    expect(screen.getByText('Data Quality Operations Center')).toBeInTheDocument()
    expect(screen.getByText('Completeness')).toBeInTheDocument()
  })
})

describe('FailureAnalysisCenter', () => {
  it('renders failure table and charts section', () => {
    render(
      <FailureAnalysisCenter
        failures={bundle.report.failures}
        byCategory={bundle.failureByCategoryChart}
        bySeverity={bundle.failureBySeverityChart}
        byPipeline={bundle.failureByPipelineChart}
      />,
    )
    expect(screen.getByText('Failure Analysis Center')).toBeInTheDocument()
    expect(screen.getByText('validation')).toBeInTheDocument()
  })
})

describe('RetryManagementDashboard', () => {
  it('renders retry queue', () => {
    render(<RetryManagementDashboard retries={bundle.report.retries} />)
    expect(screen.getByText('Retry Management')).toBeInTheDocument()
    expect(screen.getByText('Warehouse Load')).toBeInTheDocument()
  })
})

describe('LineageVisualization', () => {
  it('renders lineage nodes', () => {
    render(<LineageVisualization nodes={bundle.report.lineage} />)
    expect(screen.getAllByText('Synthetic Data').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Forecasting').length).toBeGreaterThan(0)
  })
})
