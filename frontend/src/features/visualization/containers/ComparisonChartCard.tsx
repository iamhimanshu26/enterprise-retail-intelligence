import type { ReactNode } from 'react'
import { ChartCard } from './ChartCard'
import type { ChartSeriesPoint } from '../adapters/chartAdapters'

interface ComparisonChartCardProps {
  title: string
  subtitle?: string
  data: ChartSeriesPoint[]
  children: ReactNode
  loading?: boolean
}

export function ComparisonChartCard({ title, subtitle, data, children, loading }: ComparisonChartCardProps) {
  return (
    <ChartCard
      title={title}
      subtitle={subtitle ?? 'Comparative analysis'}
      loading={loading}
      empty={!data.length}
      height="h-72"
    >
      {children}
    </ChartCard>
  )
}
