import { MetricCard } from '@/components/design-system'
import { cn } from '@/lib/cn'

interface VisualizationMetricCardProps {
  label: string
  value: string
  className?: string
}

export function VisualizationMetricCard({ label, value, className }: VisualizationMetricCardProps) {
  return <MetricCard label={label} value={value} className={cn(className)} />
}
