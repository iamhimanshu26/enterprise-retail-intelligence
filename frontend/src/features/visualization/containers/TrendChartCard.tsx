import type { ReactNode } from 'react'
import { ChartCard } from './ChartCard'
import type { ChartSeriesPoint } from '../adapters/chartAdapters'

interface TrendChartCardProps {
  title: string
  subtitle?: string
  data: ChartSeriesPoint[]
  children: ReactNode
  loading?: boolean
  onRefresh?: () => void
}

export function TrendChartCard({ title, subtitle, data, children, loading, onRefresh }: TrendChartCardProps) {
  return (
    <ChartCard
      title={title}
      subtitle={subtitle ?? 'Time-series trend visualization'}
      loading={loading}
      empty={!data.length}
      onRefresh={onRefresh}
      height="h-72"
    >
      {children}
    </ChartCard>
  )
}
