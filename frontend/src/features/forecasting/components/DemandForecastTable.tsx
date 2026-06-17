import { DataTable, SectionContainer } from '@/components/design-system'
import { EnterpriseBarChart } from '@/features/visualization/charts'
import { TrendChartCard } from '@/features/visualization/containers/TrendChartCard'
import type { ChartSeriesPoint } from '@/features/visualization/adapters/chartAdapters'
import type { DemandForecast, DemandForecastRow } from '@/types/forecasting'
import type { TableColumn } from '@/types'

interface DemandForecastTableProps {
  demand: DemandForecast
  categoryChart: ChartSeriesPoint[]
  growthChart: ChartSeriesPoint[]
  loading?: boolean
}

function trendBadge(trend: string): string {
  return trend.replace(/_/g, ' ')
}

export function DemandForecastTable({
  demand,
  categoryChart,
  growthChart,
  loading,
}: DemandForecastTableProps) {
  const productColumns: TableColumn<DemandForecastRow>[] = [
    { key: 'dimension', header: 'Product' },
    { key: 'predicted_demand', header: 'Predicted Demand' },
    {
      key: 'trend_direction',
      header: 'Trend',
      render: (row: DemandForecastRow) => trendBadge(row.trend_direction),
    },
    {
      key: 'model_name',
      header: 'Model',
      render: (row: DemandForecastRow) => row.model_name.replace(/_/g, ' '),
    },
  ]

  const categoryColumns: TableColumn<DemandForecastRow>[] = [
    { key: 'dimension', header: 'Category' },
    { key: 'predicted_demand', header: 'Predicted Demand' },
    {
      key: 'trend_direction',
      header: 'Trend',
      render: (row: DemandForecastRow) => trendBadge(row.trend_direction),
    },
  ]

  return (
    <SectionContainer
      title="Demand Forecast"
      description="Product and category demand forecasts, fast/slow movers, and expected demand growth."
    >
      {loading ? (
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-2">
            <TrendChartCard title="Category Demand" data={categoryChart}>
              <EnterpriseBarChart data={categoryChart} showLegend={false} />
            </TrendChartCard>
            <TrendChartCard title="Demand Growth Mix" data={growthChart}>
              <EnterpriseBarChart data={growthChart} showLegend={false} />
            </TrendChartCard>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Product Demand Forecast</h3>
            <DataTable columns={productColumns} data={demand.product_demand} />
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">Category Demand Forecast</h3>
            <DataTable columns={categoryColumns} data={demand.category_demand} />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-foreground">Fast-moving Products</h3>
              <DataTable
                columns={productColumns}
                data={demand.fast_moving}
                emptyMessage="No fast-moving products identified"
              />
            </div>
            <div>
              <h3 className="mb-3 text-sm font-semibold text-foreground">Slow-moving Products</h3>
              <DataTable
                columns={productColumns}
                data={demand.slow_moving}
                emptyMessage="No slow-moving products identified"
              />
            </div>
          </div>
        </div>
      )}
    </SectionContainer>
  )
}
