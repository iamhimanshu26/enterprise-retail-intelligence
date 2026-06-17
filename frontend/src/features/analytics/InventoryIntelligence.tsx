import { Loader2, Play } from 'lucide-react'
import {
  Breadcrumb,
  ErrorState,
  MetricCard,
  PageHeader,
  SectionContainer,
  TableSkeleton,
} from '@/components/design-system'
import { useBusinessAnalytics } from '@/hooks/useBusinessAnalytics'
import { ANALYTICS_FORMULAS } from '@/types/analytics'
import { AnalyticsFormulaPanel } from './components/AnalyticsFormulaPanel'
import { BreakdownTable } from './components/BreakdownTable'
import { PerformanceScorePanel } from './components/PerformanceScorePanel'
import { RankingsTable, currencyCell } from './components/RankingsTable'

export function InventoryIntelligence() {
  const { report, isLoading, isFetching, error, refetch } = useBusinessAnalytics()

  if (error) {
    return (
      <ErrorState
        title="Analytics service unavailable"
        message={error instanceof Error ? error.message : 'Failed to load inventory analytics'}
        onRetry={() => refetch()}
      />
    )
  }

  const inventory = report?.inventory

  return (
    <div className="space-y-8">
      <PageHeader
        title="Inventory Intelligence"
        description="Stock risk, reorder candidates, and inventory value analytics."
        badge={{ status: 'completed', label: 'Phase 5 Complete' }}
      />
      <Breadcrumb items={[{ label: 'Inventory Intelligence' }]} />

      {isLoading ? (
        <TableSkeleton rows={4} />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
            >
              {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              Refresh analytics
            </button>
          </div>

          {inventory && report && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                <MetricCard label="Inventory Value" value={currencyCell(inventory.inventory_value)} />
                <MetricCard label="Low Stock" value={String(inventory.low_stock_count)} />
                <MetricCard label="Overstock" value={String(inventory.overstock_count)} />
                <MetricCard label="Out of Stock" value={String(inventory.out_of_stock_count)} />
                <MetricCard label="Stock Risk Score" value={inventory.stock_risk_score.toFixed(1)} />
              </div>

              <SectionContainer title="Movement Analysis" description="Fast and slow-moving product codes">
                <div className="grid gap-4 md:grid-cols-2">
                  <MetricCard label="Fast Moving" value={inventory.fast_moving.slice(0, 5).join(', ') || '—'} />
                  <MetricCard label="Slow Moving" value={inventory.slow_moving.slice(0, 5).join(', ') || '—'} />
                </div>
              </SectionContainer>

              <RankingsTable
                title="Reorder Candidates"
                description="Products at or below reorder level"
                rows={inventory.reorder_candidates}
                rowKey="product_code"
                columns={[
                  { key: 'product_code', header: 'Product' },
                  { key: 'stock_on_hand', header: 'On Hand' },
                  { key: 'reorder_level', header: 'Reorder Level' },
                  { key: 'inventory_value', header: 'Value', render: (r) => currencyCell(r.inventory_value) },
                  { key: 'status', header: 'Status' },
                  { key: 'risk_score', header: 'Risk', render: (r) => r.risk_score.toFixed(1) },
                ]}
              />

              <BreakdownTable
                title="Category Stock Exposure"
                rows={report.products.category_performance.slice(0, 8)}
              />

              <PerformanceScorePanel scores={report.performance} />
              <AnalyticsFormulaPanel formulas={ANALYTICS_FORMULAS.filter((f) => f.name.includes('Inventory'))} />
            </>
          )}
        </>
      )}
    </div>
  )
}
