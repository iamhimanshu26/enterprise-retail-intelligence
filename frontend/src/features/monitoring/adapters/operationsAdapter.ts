import type { ChartSeriesPoint } from '@/features/visualization/adapters/chartAdapters'
import type {
  FailureRecord,
  MonitoringReport,
  OperationsCenterBundle,
} from '@/types/monitoring'

function countByField(
  failures: FailureRecord[],
  field: 'category' | 'severity' | 'pipeline',
): ChartSeriesPoint[] {
  const counts = new Map<string, number>()
  for (const failure of failures) {
    const key = failure[field]
    counts.set(key, (counts.get(key) ?? 0) + failure.frequency || 1)
  }
  return Array.from(counts.entries()).map(([label, value]) => ({ label, value }))
}

export function buildQualityHistoryChart(report: MonitoringReport): ChartSeriesPoint[] {
  return report.quality.history.map((point) => ({
    label: point.label,
    value: point.value,
  }))
}

export function buildMetricsChart(metrics: MonitoringReport['metrics']): ChartSeriesPoint[] {
  return [
    { label: 'Success Rate', value: metrics.success_rate },
    { label: 'Failure Rate', value: metrics.failure_rate },
    { label: 'Avg Quality', value: metrics.average_quality_score },
    { label: 'Throughput', value: metrics.throughput / 100 },
  ]
}

export function buildOperationsCenterBundle(
  report: MonitoringReport,
  source: 'api' | 'mock',
): OperationsCenterBundle {
  return {
    report,
    source,
    failureByCategoryChart: countByField(report.failures, 'category'),
    failureBySeverityChart: countByField(report.failures, 'severity'),
    failureByPipelineChart: countByField(report.failures, 'pipeline'),
    qualityHistoryChart: buildQualityHistoryChart(report),
    metricsChart: buildMetricsChart(report.metrics),
  }
}

export function statusToBadge(status: string): 'planned' | 'in-progress' | 'completed' {
  if (status === 'success' || status === 'healthy') return 'completed'
  if (status === 'failed' || status === 'down') return 'planned'
  return 'in-progress'
}

export function healthColor(status: string): string {
  if (status === 'healthy' || status === 'success') return 'text-success'
  if (status === 'degraded' || status === 'warning') return 'text-amber-500'
  return 'text-destructive'
}
