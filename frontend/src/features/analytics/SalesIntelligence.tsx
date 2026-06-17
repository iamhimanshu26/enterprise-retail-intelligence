import { Loader2, Play } from 'lucide-react'
import {
  Breadcrumb,
  ErrorState,
  MetricCard,
  PageHeader,
  SectionContainer,
  TableSkeleton,
} from '@/components/design-system'
import { ChartContainer } from '@/components/analytics'
import { useBusinessAnalytics } from '@/hooks/useBusinessAnalytics'
import { ANALYTICS_FORMULAS } from '@/types/analytics'
import { AnalyticsFormulaPanel } from './components/AnalyticsFormulaPanel'
import { AnalyticsKpiGrid } from './components/AnalyticsKpiGrid'
import { BreakdownTable } from './components/BreakdownTable'
import { PerformanceScorePanel } from './components/PerformanceScorePanel'
import { RankingsTable, currencyCell } from './components/RankingsTable'

export function SalesIntelligence() {
  const { overview, report, isLoading, isFetching, error, refetch } = useBusinessAnalytics()

  if (error) {
    return (
      <ErrorState
        title="Analytics service unavailable"
        message={error instanceof Error ? error.message : 'Failed to load sales analytics'}
        onRetry={() => refetch()}
      />
    )
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Sales Intelligence"
        description="Revenue analytics, growth trends, and dimensional breakdowns from the Business Analytics Engine."
        badge={{ status: 'completed', label: 'Phase 5 Complete' }}
      />
      <Breadcrumb items={[{ label: 'Sales Intelligence' }]} />

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
            <MetricCard label="Data source" value={overview?.data_source ?? 'sample'} />
            <MetricCard
              label="Growth trend"
              value={
                report?.sales.growth_trend_pct != null
                  ? `${report.sales.growth_trend_pct.toFixed(1)}%`
                  : '—'
              }
            />
          </div>

          {report && (
            <>
              <SectionContainer title="KPI Overview" description="Enterprise sales KPIs">
                <AnalyticsKpiGrid metrics={report.kpis.metrics.slice(0, 8)} />
              </SectionContainer>

              <div className="grid gap-6 lg:grid-cols-2">
                <BreakdownTable title="Revenue by Region" rows={report.sales.by_region} />
                <BreakdownTable title="Revenue by Category" rows={report.sales.by_category} />
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <BreakdownTable title="Revenue by Store" rows={report.sales.by_store} />
                <BreakdownTable title="Revenue by Payment Method" rows={report.sales.by_payment_method} />
              </div>

              <SectionContainer title="Sales Trends" description="Chart-ready time series outputs">
                <div className="grid gap-4 md:grid-cols-2">
                  <ChartContainer title="Daily Revenue" description="Last 7 days">
                    <BreakdownTable title="" rows={report.sales.by_day.slice(-7)} />
                  </ChartContainer>
                  <ChartContainer title="Monthly Revenue" description="Last 6 months">
                    <BreakdownTable title="" rows={report.sales.by_month.slice(-6)} />
                  </ChartContainer>
                </div>
              </SectionContainer>

              <div className="grid gap-6 lg:grid-cols-2">
                <BreakdownTable title="Top Sales Days" rows={report.sales.top_sales_days} />
                <BreakdownTable title="Low Sales Days" rows={report.sales.low_sales_days} />
              </div>

              <RankingsTable
                title="Store Rankings"
                description={`High performers: ${report.stores.high_performers.join(', ') || '—'}`}
                rows={report.stores.rankings}
                rowKey="store_code"
                columns={[
                  { key: 'rank', header: 'Rank' },
                  { key: 'store_code', header: 'Store' },
                  { key: 'revenue', header: 'Revenue', render: (r) => currencyCell(r.revenue) },
                  { key: 'orders', header: 'Orders' },
                  { key: 'average_order_value', header: 'AOV', render: (r) => currencyCell(r.average_order_value) },
                  {
                    key: 'performance_score',
                    header: 'Score',
                    render: (r) => r.performance_score.toFixed(1),
                  },
                ]}
              />

              <PerformanceScorePanel scores={report.performance} />
              <AnalyticsFormulaPanel formulas={ANALYTICS_FORMULAS.slice(0, 4)} />
            </>
          )}
        </>
      )}
    </div>
  )
}
