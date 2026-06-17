import { ComparisonChartCard } from '../containers/ComparisonChartCard'
import { EnterpriseStackedBarChart } from '../charts'
import type { TargetVsActualMetric } from './executiveStudioAdapters'

interface TargetVsActualSectionProps {
  metrics: TargetVsActualMetric[]
}

export function TargetVsActualSection({ metrics }: TargetVsActualSectionProps) {
  const chartData = metrics.map((m) => ({
    label: m.label,
    value: m.actual,
    secondary: m.target,
    percentage: m.achievementPct,
  }))

  return (
    <ComparisonChartCard title="Target vs Actual" data={chartData} subtitle="Benchmark comparison across core metrics">
      <EnterpriseStackedBarChart data={chartData} valueFormat="number" />
    </ComparisonChartCard>
  )
}
