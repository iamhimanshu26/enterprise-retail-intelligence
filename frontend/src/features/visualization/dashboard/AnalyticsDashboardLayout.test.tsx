import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { AnalyticsDashboardLayout } from '../dashboard/AnalyticsDashboardLayout'
import { DashboardEmptyState } from '../dashboard/DashboardEmptyState'

function renderLayout(props: {
  loading?: boolean
  children?: React.ReactNode
}) {
  return render(
    <MemoryRouter>
      <AnalyticsDashboardLayout
        title="Sales Analytics"
        description="Revenue trends"
        breadcrumb="Sales"
        loading={props.loading}
      >
        {props.children ?? <div>Charts</div>}
      </AnalyticsDashboardLayout>
    </MemoryRouter>,
  )
}

describe('AnalyticsDashboardLayout', () => {
  it('renders loading skeleton when loading', () => {
    renderLayout({ loading: true })
    expect(screen.getByText('Sales Analytics')).toBeInTheDocument()
    expect(screen.queryByText('Charts')).not.toBeInTheDocument()
  })

  it('renders dashboard content when not loading', () => {
    renderLayout({})
    expect(screen.getByText('Charts')).toBeInTheDocument()
  })
})

describe('DashboardEmptyState', () => {
  it('renders default empty message', () => {
    render(<DashboardEmptyState />)
    expect(screen.getByText('No dashboard data')).toBeInTheDocument()
  })
})
