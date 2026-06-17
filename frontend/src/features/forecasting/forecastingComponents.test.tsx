import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { ForecastSummaryCard } from './components/ForecastSummaryCard'
import { ScenarioPlanner } from './components/ScenarioPlanner'
import { ForecastAccuracyDashboard } from './components/ForecastAccuracyCard'
import { FORECASTING_MOCK_REPORT } from './mock/forecastingMock'
import { buildOverviewKpis } from './adapters/forecastingAdapter'

afterEach(() => cleanup())

describe('ForecastSummaryCard', () => {
  it('renders KPI values and model metadata', () => {
    const kpi = buildOverviewKpis(FORECASTING_MOCK_REPORT)[0]
    render(<ForecastSummaryCard kpi={kpi} />)
    expect(screen.getByText('Predicted Revenue')).toBeInTheDocument()
    expect(screen.getByText(/Model:/)).toBeInTheDocument()
  })

  it('renders loading skeleton', () => {
    const kpi = buildOverviewKpis(FORECASTING_MOCK_REPORT)[0]
    render(<ForecastSummaryCard kpi={kpi} loading />)
    expect(screen.queryByText('Predicted Revenue')).not.toBeInTheDocument()
  })
})

describe('ScenarioPlanner', () => {
  it('renders scenario comparison cards', () => {
    render(<ScenarioPlanner baseScenarios={FORECASTING_MOCK_REPORT.scenarios.scenarios} />)
    expect(screen.getByText('Optimistic')).toBeInTheDocument()
    expect(screen.getByText('Expected')).toBeInTheDocument()
    expect(screen.getByText('Pessimistic')).toBeInTheDocument()
  })

  it('renders loading state', () => {
    render(<ScenarioPlanner baseScenarios={[]} loading />)
    expect(screen.queryByText('Optimistic')).not.toBeInTheDocument()
  })
})

describe('ForecastAccuracyDashboard', () => {
  it('renders accuracy metrics with tooltips', () => {
    render(
      <ForecastAccuracyDashboard
        metrics={FORECASTING_MOCK_REPORT.accuracy.metrics}
        overallScore={FORECASTING_MOCK_REPORT.accuracy.overall_accuracy_score}
      />,
    )
    expect(screen.getByText('Forecast Accuracy')).toBeInTheDocument()
    expect(screen.getByText('Overall Accuracy Score')).toBeInTheDocument()
    expect(screen.getAllByText('MAE').length).toBeGreaterThan(0)
    expect(screen.getAllByText('RMSE').length).toBeGreaterThan(0)
  })

  it('renders loading state', () => {
    render(
      <ForecastAccuracyDashboard metrics={[]} overallScore={0} loading />,
    )
    expect(screen.queryByText('Overall Accuracy Score')).not.toBeInTheDocument()
  })
})
