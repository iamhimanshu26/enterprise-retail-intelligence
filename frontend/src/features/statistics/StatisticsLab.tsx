import { useCallback, useEffect, useState } from 'react'
import { Loader2, Play } from 'lucide-react'
import {
  Breadcrumb,
  ErrorState,
  MetricCard,
  PageHeader,
  SectionContainer,
  TableSkeleton,
} from '@/components/design-system'
import { getStatisticsOverview, runStatisticsSample } from '@/lib/dataServiceApi'
import {
  STATISTICS_FORMULAS,
  type StatisticsOverview,
  type UnifiedStatisticsReport,
} from '@/types/statistics'
import { DatasetHealthCard } from './components/DatasetHealthCard'
import { DistributionSummaryPanel } from './components/DistributionSummaryCard'
import { MetricFormulaPanel } from './components/MetricFormulaPanel'
import { RegionalStatsCard } from './components/RegionalStatsCard'
import { StatsMetricGrid } from './components/StatsMetricCard'
import { TimeSeriesStatsCard } from './components/TimeSeriesStatsCard'

export function StatisticsLab() {
  const [overview, setOverview] = useState<StatisticsOverview | null>(null)
  const [report, setReport] = useState<UnifiedStatisticsReport | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)

  const loadReport = useCallback(async () => {
    const data = await runStatisticsSample()
    setReport(data)
  }, [])

  useEffect(() => {
    Promise.all([getStatisticsOverview(), runStatisticsSample()])
      .then(([ov, rep]) => {
        setOverview(ov)
        setReport(rep)
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load statistics')
      })
      .finally(() => setLoading(false))
  }, [])

  const handleRun = async () => {
    setRunning(true)
    try {
      await loadReport()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Statistics run failed')
    } finally {
      setRunning(false)
    }
  }

  const business = report?.business

  return (
    <div className="space-y-8">
      <PageHeader
        title="Statistics Lab"
        description="Enterprise statistics engine — descriptive, business, distribution, time-based, regional, and dataset health metrics from warehouse-ready retail data."
        badge={{ status: 'completed', label: 'Phase 5 · Sprint 5.1' }}
      />

      <Breadcrumb items={[{ label: 'Statistics Lab' }]} />

      {error && (
        <ErrorState title="Statistics service unavailable" message={error} onRetry={() => window.location.reload()} />
      )}

      {loading ? (
        <TableSkeleton rows={4} />
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Engine modules" value={String(overview?.modules.length ?? 6)} />
            <MetricCard label="Data source" value={report?.overview.data_source ?? 'sample'} />
            <MetricCard
              label="Execution time"
              value={report ? `${report.execution_time_seconds}s` : '—'}
            />
            <MetricCard label="Sprint" value={overview?.sprint ?? '5.1'} />
          </div>

          <SectionContainer title="Statistics Engine" description="Run sample analysis on retail transaction data">
            <button
              type="button"
              onClick={handleRun}
              disabled={running}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
            >
              {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              {running ? 'Computing statistics...' : 'Run Sample Statistics'}
            </button>
          </SectionContainer>

          {report && business && (
            <>
              <SectionContainer title="Statistical Summary" description="Descriptive statistics for numeric columns">
                <StatsMetricGrid
                  title="Business Metrics"
                  description="Retail KPIs computed from transaction data"
                  metrics={[
                    { label: 'Total Revenue', value: `¥${business.total_revenue.toLocaleString()}` },
                    { label: 'Average Order Value', value: `¥${business.average_order_value.toLocaleString()}` },
                    { label: 'Profit Margin', value: `${business.profit_margin_pct.toFixed(1)}%` },
                    { label: 'Gross Profit', value: `¥${business.gross_profit.toLocaleString()}` },
                    { label: 'Return Rate', value: `${business.return_rate_pct.toFixed(1)}%` },
                    { label: 'Units / Transaction', value: business.units_per_transaction.toFixed(2) },
                  ]}
                />
                <div className="mt-5 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {report.descriptive.slice(0, 6).map((s) => (
                    <div key={s.column} className="rounded-lg border border-border/60 bg-muted/20 px-4 py-3">
                      <p className="text-sm font-medium capitalize">{s.column}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        mean {s.mean?.toFixed(2)} · median {s.median?.toFixed(2)} · std {s.std?.toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </SectionContainer>

              <SectionContainer title="Analytics Panels" description="Distribution, regional, time-series, and health">
                <div className="grid gap-5 lg:grid-cols-2">
                  <DistributionSummaryPanel distributions={report.distributions} />
                  <RegionalStatsCard regional={report.regional} />
                  <TimeSeriesStatsCard timeSeries={report.time_series} />
                  <DatasetHealthCard health={report.health} />
                </div>
              </SectionContainer>

              <SectionContainer title="Formula Reference" description="Professional metric definitions">
                <MetricFormulaPanel formulas={STATISTICS_FORMULAS} />
              </SectionContainer>
            </>
          )}
        </>
      )}
    </div>
  )
}
