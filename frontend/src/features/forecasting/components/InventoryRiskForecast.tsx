import { DataTable, MetricCard, SectionContainer } from '@/components/design-system'
import type { InventoryForecast, InventoryForecastRow } from '@/types/forecasting'
import type { TableColumn } from '@/types'

interface InventoryRiskForecastProps {
  inventory: InventoryForecast
  loading?: boolean
}

export function InventoryRiskForecast({ inventory, loading }: InventoryRiskForecastProps) {
  const columns: TableColumn<InventoryForecastRow>[] = [
    { key: 'product_code', header: 'Product' },
    {
      key: 'stock_out_risk_score',
      header: 'Risk Score',
      render: (row: InventoryForecastRow) =>
        `${(row.stock_out_risk_score * 100).toFixed(0)}%`,
    },
    {
      key: 'days_until_stock_out',
      header: 'Days to Stock-out',
      render: (row: InventoryForecastRow) =>
        row.days_until_stock_out != null ? row.days_until_stock_out.toFixed(1) : '—',
    },
    { key: 'expected_usage', header: 'Expected Usage' },
    {
      key: 'reorder_recommendation',
      header: 'Reorder',
      render: (row: InventoryForecastRow) =>
        row.reorder_recommendation.replace(/_/g, ' '),
    },
    {
      key: 'reorder_quantity_placeholder',
      header: 'Reorder Qty',
      render: (row: InventoryForecastRow) =>
        row.reorder_quantity_placeholder != null
          ? row.reorder_quantity_placeholder.toLocaleString()
          : '—',
    },
    {
      key: 'current_stock',
      header: 'Current Stock',
      render: (row: InventoryForecastRow) => row.current_stock.toLocaleString(),
    },
  ]

  return (
    <SectionContainer
      title="Inventory Forecast"
      description="Stock-out risk, days until stock-out, reorder recommendations, and inventory risk scoring."
    >
      {loading ? (
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
      ) : (
        <>
          <div className="mb-4 grid gap-4 sm:grid-cols-3">
            <MetricCard
              label="Aggregate Stock-out Risk"
              value={`${(inventory.aggregate_stock_out_risk * 100).toFixed(1)}%`}
              trend={inventory.aggregate_stock_out_risk > 0.5 ? 'down' : 'neutral'}
            />
            <MetricCard
              label="SKUs Monitored"
              value={String(inventory.items.length)}
            />
            <MetricCard
              label="Urgent Reorders"
              value={String(
                inventory.items.filter((i) => i.reorder_recommendation.includes('urgent')).length,
              )}
              trend="down"
            />
          </div>
          <DataTable columns={columns} data={inventory.items} emptyMessage="No inventory forecast data" />
        </>
      )}
    </SectionContainer>
  )
}
