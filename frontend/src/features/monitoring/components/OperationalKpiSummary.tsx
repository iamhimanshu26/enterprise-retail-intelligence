import { MetricCard, SectionContainer } from '@/components/design-system'
import type { OperationalKpis } from '@/types/monitoring'

interface OperationalKpiSummaryProps {
  kpis: OperationalKpis
  loading?: boolean
}

export function OperationalKpiSummary({ kpis, loading }: OperationalKpiSummaryProps) {
  return (
    <SectionContainer
      title="Executive Monitoring Overview"
      description="Operational KPI summary for pipeline runs, quality, and platform health."
    >
      {loading ? (
        <div className="h-24 animate-pulse rounded-xl bg-muted" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Total Pipeline Runs" value={String(kpis.total_runs)} />
          <MetricCard label="Successful Runs" value={String(kpis.successful_runs)} trend="up" />
          <MetricCard label="Failed Runs" value={String(kpis.failed_runs)} trend="down" />
          <MetricCard label="Platform Health" value={`${kpis.platform_health_score.toFixed(1)}%`} trend="up" />
          <MetricCard label="Avg Quality Score" value={`${kpis.average_quality_score.toFixed(1)}%`} />
          <MetricCard label="Avg Runtime" value={`${kpis.average_runtime.toFixed(1)}s`} />
          <MetricCard label="Processed Records" value={kpis.total_processed_records.toLocaleString()} />
        </div>
      )}
    </SectionContainer>
  )
}
