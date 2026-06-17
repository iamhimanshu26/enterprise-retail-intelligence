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

export function CustomerAnalyticsPage() {
  const { report, isLoading, isFetching, error, refetch } = useBusinessAnalytics()

  if (error) {
    return (
      <ErrorState
        title="Analytics service unavailable"
        message={error instanceof Error ? error.message : 'Failed to load customer analytics'}
        onRetry={() => refetch()}
      />
    )
  }

  const customers = report?.customers

  return (
    <div className="space-y-8">
      <PageHeader
        title="Customer Analytics"
        description="Segmentation, membership tiers, revenue contribution, and CLV placeholder."
        badge={{ status: 'completed', label: 'Sprint 5.2' }}
      />
      <Breadcrumb items={[{ label: 'Customer Analytics' }]} />

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

          {customers && report && (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard label="New Customers" value={String(customers.new_customers)} />
                <MetricCard label="Returning Customers" value={String(customers.returning_customers)} />
                <MetricCard label="Average Spend" value={`¥${customers.average_spend.toLocaleString()}`} />
                <MetricCard label="CLV Placeholder" value={`¥${(customers.clv_placeholder ?? 0).toLocaleString()}`} />
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <BreakdownTable title="Customer Segments (Age Group)" rows={customers.segments} />
                <BreakdownTable
                  title="Membership Tier Distribution"
                  rows={customers.membership_distribution}
                  valueFormat="percent"
                />
              </div>

              <BreakdownTable title="Top Customer Revenue Contribution" rows={customers.revenue_contribution} />

              <SectionContainer title="Behavior Metrics">
                <div className="grid gap-4 sm:grid-cols-3">
                  <MetricCard label="Purchase Frequency" value={customers.purchase_frequency.toFixed(2)} />
                  <MetricCard label="Segment Score" value={customers.segment_score.toFixed(1)} />
                  <MetricCard label="Returning Ratio" value={`${((customers.returning_customers / Math.max(customers.new_customers + customers.returning_customers, 1)) * 100).toFixed(1)}%`} />
                </div>
              </SectionContainer>

              <PerformanceScorePanel scores={report.performance} />
              <AnalyticsFormulaPanel formulas={ANALYTICS_FORMULAS.filter((f) => f.name.includes('Average'))} />
            </>
          )}
        </>
      )}
    </div>
  )
}
