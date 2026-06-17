import { DataTable, MetricCard } from '@/components/design-system'
import type { InventoryForecast, InventoryForecastRow } from '@/types/forecasting'
import type { TableColumn } from '@/types'

interface InventoryRiskForecastProps {
  inventory: InventoryForecast
  loading?: boolean
  compact?: boolean
}

export function InventoryRiskForecast({ inventory, loading, compact }: InventoryRiskForecastProps) {
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

  const content = loading ? (
    <div className="h-40 animate-pulse rounded-xl bg-muted" />
  ) : (
    <>
      <div className="mb-4 grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="Aggregate Stock-out Risk"
          value={`${(inventory.aggregate_stock_out_risk * 100).toFixed(1)}%`}
          trend={inventory.aggregate_stock_out_risk > 0.5 ? 'down' : 'neutral'}
        />
        <MetricCard label="SKUs Monitored" value={String(inventory.items.length)} />
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
  )

  if (compact) return <div>{content}</div>

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">Inventory Risk Table</h3>
        <p className="text-xs text-muted-foreground">
          Stock-out risk, days until stock-out, and reorder recommendations.
        </p>
      </div>
      {content}
    </div>
  )
}
