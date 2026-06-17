import { MetricCard } from '@/components/design-system'
import type { AnalyticsKpiMetric } from '@/types/analytics'

function formatKpiValue(metric: AnalyticsKpiMetric): string {
  if (metric.unit === 'JPY') {
    return `¥${metric.value.toLocaleString()}`
  }
  if (metric.unit === '%') {
    return `${metric.value.toFixed(1)}%`
  }
  return `${metric.value.toLocaleString()}${metric.unit ? ` ${metric.unit}` : ''}`
}

export function AnalyticsKpiGrid({ metrics, loading }: { metrics: AnalyticsKpiMetric[]; loading?: boolean }) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <MetricCard key={i} label="Loading" value="—" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <MetricCard key={metric.id} label={metric.label} value={formatKpiValue(metric)} />
      ))}
    </div>
  )
}
