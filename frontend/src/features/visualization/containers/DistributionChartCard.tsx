import type { ReactNode } from 'react'
import { ChartCard } from './ChartCard'
import type { ChartSeriesPoint } from '../adapters/chartAdapters'

interface DistributionChartCardProps {
  title: string
  subtitle?: string
  data: ChartSeriesPoint[]
  children: ReactNode
  loading?: boolean
}

export function DistributionChartCard({ title, subtitle, data, children, loading }: DistributionChartCardProps) {
  return (
    <ChartCard
      title={title}
      subtitle={subtitle ?? 'Distribution breakdown'}
      loading={loading}
      empty={!data.length}
      height="h-72"
    >
      {children}
    </ChartCard>
  )
}
