import { DataTable, MetricCard, SectionContainer } from '@/components/design-system'
import type { StoreForecast, StoreForecastRow } from '@/types/forecasting'
import type { TableColumn } from '@/types'

interface StoreForecastTableProps {
  stores: StoreForecast
  loading?: boolean
}

export function StoreForecastTable({ stores, loading }: StoreForecastTableProps) {
  const columns: TableColumn<StoreForecastRow>[] = [
    { key: 'store_code', header: 'Store' },
    {
      key: 'predicted_revenue',
      header: 'Revenue Forecast',
      render: (row: StoreForecastRow) =>
        `¥${row.predicted_revenue.toLocaleString()}`,
    },
    {
      key: 'predicted_orders',
      header: 'Order Forecast',
      render: (row: StoreForecastRow) => row.predicted_orders.toLocaleString(),
    },
    {
      key: 'revenue_trend',
      header: 'Revenue Trend',
      render: (row: StoreForecastRow) => row.revenue_trend.replace(/_/g, ' '),
    },
    {
      key: 'performance_risk_score',
      header: 'Risk Score',
      render: (row: StoreForecastRow) =>
        `${(row.performance_risk_score * 100).toFixed(0)}%`,
    },
    {
      key: 'classification',
      header: 'Classification',
      render: (row: StoreForecastRow) => row.classification.replace(/_/g, ' '),
    },
  ]

  return (
    <SectionContainer
      title="Store Performance Forecast"
      description="High-growth and declining stores with revenue, order, and risk forecasts."
    >
      {loading ? (
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
      ) : (
        <>
          <div className="mb-4 grid gap-4 sm:grid-cols-3">
            <MetricCard
              label="High-growth Stores"
              value={stores.high_growth_stores.join(', ') || '—'}
              trend="up"
            />
            <MetricCard
              label="Declining Stores"
              value={stores.declining_stores.join(', ') || '—'}
              trend="down"
            />
            <MetricCard label="Stores Forecasted" value={String(stores.stores.length)} />
          </div>
          <DataTable columns={columns} data={stores.stores} emptyMessage="No store forecast data" />
        </>
      )}
    </SectionContainer>
  )
}
