import { MetricCard, SectionContainer } from '@/components/design-system'
import { EnterpriseBarChart } from '@/features/visualization/charts'
import { TrendChartCard } from '@/features/visualization/containers/TrendChartCard'
import type { ChartSeriesPoint } from '@/features/visualization/adapters/chartAdapters'
import type { PipelineMetrics } from '@/types/monitoring'

interface PipelineMetricsDashboardProps {
  metrics: PipelineMetrics
  chartData: ChartSeriesPoint[]
  loading?: boolean
}

export function PipelineMetricsDashboard({
  metrics,
  chartData,
  loading,
}: PipelineMetricsDashboardProps) {
  return (
    <SectionContainer
      title="Pipeline Metrics"
      description="Success rate, throughput, duration, and quality aggregates."
    >
      {loading ? (
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard label="Success Rate" value={`${metrics.success_rate.toFixed(1)}%`} trend="up" />
            <MetricCard label="Failure Rate" value={`${metrics.failure_rate.toFixed(1)}%`} trend="down" />
            <MetricCard label="Avg Duration" value={`${metrics.average_duration.toFixed(1)}s`} />
            <MetricCard label="Throughput" value={`${metrics.throughput.toFixed(0)} r/s`} />
            <MetricCard label="Rows Processed" value={metrics.rows_processed.toLocaleString()} />
            <MetricCard label="Avg Quality" value={`${metrics.average_quality_score.toFixed(1)}%`} />
            <MetricCard label="Slowest Stage" value={metrics.slowest_stage.replace(/_/g, ' ')} />
            <MetricCard label="Top Failure" value={metrics.most_common_failure.replace(/_/g, ' ')} />
          </div>
          <TrendChartCard title="Pipeline Metrics Overview" data={chartData}>
            <EnterpriseBarChart data={chartData} showLegend={false} />
          </TrendChartCard>
        </div>
      )}
    </SectionContainer>
  )
}
