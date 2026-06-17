import type { ReactNode } from 'react'
import { MetricCard } from '@/components/design-system'
import { ChartCard } from './ChartCard'
import type { ChartSeriesPoint } from '../adapters/chartAdapters'

interface MetricChartCardProps {
  title: string
  subtitle?: string
  metricLabel: string
  metricValue: string
  data: ChartSeriesPoint[]
  children: ReactNode
  loading?: boolean
}

export function MetricChartCard({
  title,
  subtitle,
  metricLabel,
  metricValue,
  data,
  children,
  loading,
}: MetricChartCardProps) {
  return (
    <ChartCard title={title} subtitle={subtitle} loading={loading} empty={!data.length}>
      <div className="mb-4">
        <MetricCard label={metricLabel} value={metricValue} />
      </div>
      {children}
    </ChartCard>
  )
}
