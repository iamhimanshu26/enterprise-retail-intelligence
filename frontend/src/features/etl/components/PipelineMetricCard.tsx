import { Activity } from 'lucide-react'
import { MetricCard } from '@/components/design-system'
import { GeneratorCard } from '@/features/generator/components/GeneratorCard'
import type { EtlMetrics } from '@/types/etl'

interface PipelineMetricCardProps {
  metrics: EtlMetrics | null
}

export function PipelineMetricCard({ metrics }: PipelineMetricCardProps) {
  if (!metrics) {
    return (
      <GeneratorCard title="Pipeline Metrics" description="Throughput and resource utilization" icon={<Activity className="h-5 w-5" />}>
        <p className="text-sm text-muted-foreground">Run a pipeline to see execution metrics.</p>
      </GeneratorCard>
    )
  }

  return (
    <GeneratorCard title="Pipeline Metrics" description="Throughput and resource utilization" icon={<Activity className="h-5 w-5" />}>
      <div className="grid gap-3 sm:grid-cols-2">
        <MetricCard label="Throughput" value={`${metrics.throughput_rows_per_second.toFixed(1)} rows/s`} />
        <MetricCard label="Execution time" value={`${metrics.execution_time_seconds.toFixed(2)}s`} />
        <MetricCard label="Successful" value={metrics.successful_records.toLocaleString()} />
        <MetricCard label="Failed" value={metrics.failed_records.toLocaleString()} />
        <MetricCard label="Memory (est.)" value={`${metrics.memory_usage_mb.toFixed(1)} MB`} />
        <MetricCard label="CPU (est.)" value={`${metrics.cpu_usage_percent.toFixed(1)}%`} />
      </div>
    </GeneratorCard>
  )
}
