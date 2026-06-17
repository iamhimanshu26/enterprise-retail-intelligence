import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChartCard } from '../containers/ChartCard'

describe('ChartCard', () => {
  it('renders loading state', () => {
    render(
      <ChartCard title="Revenue" subtitle="Daily" loading>
        <div>Chart</div>
      </ChartCard>,
    )
    expect(screen.getByText('Revenue')).toBeInTheDocument()
  })

  it('renders empty state', () => {
    render(
      <ChartCard title="Revenue" empty emptyTitle="No data">
        <div>Chart</div>
      </ChartCard>,
    )
    expect(screen.getByText('No data')).toBeInTheDocument()
  })

  it('renders chart content', () => {
    render(
      <ChartCard title="Revenue">
        <div>Chart content</div>
      </ChartCard>,
    )
    expect(screen.getByText('Chart content')).toBeInTheDocument()
  })
})
