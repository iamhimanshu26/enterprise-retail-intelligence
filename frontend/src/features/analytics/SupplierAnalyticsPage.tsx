import { Loader2, Play } from 'lucide-react'
import {
  Breadcrumb,
  ErrorState,
  MetricCard,
  PageHeader,
  TableSkeleton,
} from '@/components/design-system'
import { useBusinessAnalytics } from '@/hooks/useBusinessAnalytics'
import { ANALYTICS_FORMULAS } from '@/types/analytics'
import { AnalyticsFormulaPanel } from './components/AnalyticsFormulaPanel'
import { BreakdownTable } from './components/BreakdownTable'
import { PerformanceScorePanel } from './components/PerformanceScorePanel'
import { RankingsTable, percentCell } from './components/RankingsTable'

export function SupplierAnalyticsPage() {
  const { report, isLoading, isFetching, error, refetch } = useBusinessAnalytics()

  if (error) {
    return (
      <ErrorState
        title="Analytics service unavailable"
        message={error instanceof Error ? error.message : 'Failed to load supplier analytics'}
        onRetry={() => refetch()}
      />
    )
  }

  const suppliers = report?.suppliers
  const promotions = report?.promotions

  return (
    <div className="space-y-8">
      <PageHeader
        title="Supplier Analytics"
        description="Supplier reliability, contribution ranking, risk scores, and promotion impact."
        badge={{ status: 'completed', label: 'Sprint 5.2' }}
      />
      <Breadcrumb items={[{ label: 'Supplier Analytics' }]} />

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

          {suppliers && promotions && report && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard label="Suppliers Ranked" value={String(suppliers.rankings.length)} />
                <MetricCard
                  label="Delayed Suppliers (placeholder)"
                  value={suppliers.delayed_suppliers.slice(0, 3).join(', ') || 'None'}
                />
                <MetricCard label="Promotional Revenue" value={`¥${promotions.promotional_revenue.toLocaleString()}`} />
                <MetricCard
                  label="Promotion ROI (placeholder)"
                  value={
                    promotions.promotion_roi_placeholder != null
                      ? percentCell(promotions.promotion_roi_placeholder)
                      : '—'
                  }
                />
              </div>

              <RankingsTable
                title="Supplier Ranking"
                description="Ranked by revenue contribution and reliability"
                rows={suppliers.rankings}
                rowKey="supplier_id"
                columns={[
                  { key: 'rank', header: 'Rank' },
                  { key: 'supplier_name', header: 'Supplier' },
                  { key: 'product_count', header: 'Products' },
                  {
                    key: 'revenue_contribution',
                    header: 'Contribution',
                    render: (r) => percentCell(r.revenue_contribution),
                  },
                  {
                    key: 'reliability_score',
                    header: 'Reliability',
                    render: (r) => r.reliability_score.toFixed(1),
                  },
                  { key: 'risk_score', header: 'Risk', render: (r) => r.risk_score.toFixed(1) },
                ]}
              />

              <div className="grid gap-6 lg:grid-cols-2">
                <BreakdownTable title="Promotion by Category" rows={promotions.category_performance} />
                <BreakdownTable title="Promotion by Region" rows={promotions.region_performance} />
              </div>

              <PerformanceScorePanel scores={report.performance} />
              <AnalyticsFormulaPanel
                formulas={ANALYTICS_FORMULAS.filter((f) => f.name.includes('Supplier') || f.name.includes('Gross'))}
              />
            </>
          )}
        </>
      )}
    </div>
  )
}
