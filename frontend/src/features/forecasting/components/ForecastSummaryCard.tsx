import type { ForecastOverviewKpi } from '@/types/forecasting'
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { cn } from '@/lib/cn'

interface ForecastSummaryCardProps {
  kpi: ForecastOverviewKpi
  loading?: boolean
}

function formatValue(kpi: ForecastOverviewKpi, value: number): string {
  if (kpi.unit === '¥') return `¥${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
  if (kpi.unit === '%') return `${value.toFixed(1)}%`
  if (kpi.unit === 'units') return `${value.toLocaleString()} units`
  if (kpi.unit === 'stores') return `${value} net`
  return value.toLocaleString(undefined, { maximumFractionDigits: 0 })
}

export function ForecastSummaryCard({ kpi, loading }: ForecastSummaryCardProps) {
  const TrendIcon = kpi.trend === 'up' ? ArrowUpRight : kpi.trend === 'down' ? ArrowDownRight : Minus

  if (loading) {
    return (
      <div className="rounded-xl border border-border/80 bg-card p-5 shadow-sm">
        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
        <div className="mt-4 h-8 w-32 animate-pulse rounded bg-muted" />
      </div>
    )
  }

  const changePct =
    kpi.currentValue > 0
      ? ((kpi.forecastValue - kpi.currentValue) / kpi.currentValue) * 100
      : 0

  return (
    <article className="rounded-xl border border-border/80 bg-card p-5 shadow-sm transition-all hover:border-primary/15 hover:shadow-md">
      <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
        {formatValue(kpi, kpi.forecastValue)}
      </p>
      <div className="mt-2 flex items-center gap-1 text-xs">
        <TrendIcon
          className={cn(
            'h-3.5 w-3.5',
            kpi.trend === 'up' && 'text-success',
            kpi.trend === 'down' && 'text-destructive',
            kpi.trend === 'neutral' && 'text-muted-foreground',
          )}
        />
        <span
          className={cn(
            'font-medium',
            changePct >= 0 ? 'text-success' : 'text-destructive',
          )}
        >
          {changePct >= 0 ? '+' : ''}{changePct.toFixed(1)}%
        </span>
        <span className="text-muted-foreground">vs current</span>
      </div>
      <div className="mt-4 space-y-1 border-t border-border/60 pt-3 text-xs text-muted-foreground">
        <p>Current: {formatValue(kpi, kpi.currentValue)}</p>
        <p>Confidence: {kpi.confidencePlaceholder}</p>
        <p>Model: {kpi.modelName.replace(/_/g, ' ')}</p>
        <p>Horizon: {kpi.horizon}</p>
      </div>
    </article>
  )
}
