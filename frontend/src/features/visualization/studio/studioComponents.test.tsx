import { cleanup, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { afterEach, describe, expect, it } from 'vitest'
import { DashboardGallery } from './DashboardGallery'
import { KpiPerformanceBoard } from './KpiPerformanceBoard'
import {
  mockAnalyticsReport,
  mockIntelligenceReport,
  mockStatisticsReport,
} from '../adapters/dashboardFixtures'
import { buildExecutiveVisualizationBundle } from './executiveStudioAdapters'

const bundle = buildExecutiveVisualizationBundle(
  mockAnalyticsReport,
  mockStatisticsReport,
  mockIntelligenceReport,
)

afterEach(() => cleanup())

describe('DashboardGallery', () => {
  it('renders gallery cards with open dashboard links', () => {
    render(
      <MemoryRouter>
        <DashboardGallery />
      </MemoryRouter>,
    )
    expect(screen.getByText('Executive Overview')).toBeInTheDocument()
    expect(screen.getByText('Sales Intelligence')).toBeInTheDocument()
    expect(screen.getAllByText('Open dashboard').length).toBeGreaterThan(0)
  })
})

describe('KpiPerformanceBoard', () => {
  it('renders loading skeleton', () => {
    render(<KpiPerformanceBoard items={[]} loading />)
    expect(screen.queryByText('Revenue')).not.toBeInTheDocument()
  })

  it('renders KPI cards with values', () => {
    const { container } = render(<KpiPerformanceBoard items={bundle.kpiBoard} />)
    expect(container.textContent).toContain('Revenue')
    expect(container.textContent).toContain('Orders')
    expect(container.querySelectorAll('article').length).toBe(8)
  })

  it('renders empty state when no items', () => {
    render(<KpiPerformanceBoard items={[]} />)
    expect(screen.getByText(/KPI performance data unavailable/)).toBeInTheDocument()
  })
})
