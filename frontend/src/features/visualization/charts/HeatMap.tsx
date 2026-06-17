import { memo } from 'react'
import { cn } from '@/lib/cn'
import type { ChartSeriesPoint } from '../adapters/chartAdapters'

interface HeatMapProps {
  data: ChartSeriesPoint[]
  className?: string
}

/** Grid-based heat map — Recharts-compatible enterprise visualization. */
export const EnterpriseHeatMap = memo(function EnterpriseHeatMap({ data, className }: HeatMapProps) {
  if (!data.length) return null

  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className={cn('grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4', className)}>
      {data.map((cell, index) => {
        const intensity = cell.value / max
        return (
          <div
            key={`${cell.label}-${index}`}
            className="rounded-lg border border-border/60 bg-primary/10 p-3 text-center"
            style={{ opacity: 0.4 + intensity * 0.6 }}
            title={`${cell.label}: ${cell.value}`}
          >
            <p className="text-xs font-medium text-muted-foreground">{cell.label}</p>
            <p className="mt-1 text-sm font-semibold">{cell.value.toLocaleString()}</p>
          </div>
        )
      })}
    </div>
  )
})
