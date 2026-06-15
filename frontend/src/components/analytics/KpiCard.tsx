import { memo } from 'react'
import { ArrowDownRight, ArrowUpRight, HelpCircle, Minus } from 'lucide-react'
import { cn } from '@/lib/cn'
import { formatKpiValue, formatPercent } from '@/lib/formatters'
import type { KpiMetric } from '@/types/dashboard'
import { CardSkeleton } from '@/components/design-system/LoadingSkeleton'

interface KpiCardProps {
  metric: KpiMetric
  icon: React.ReactNode
  loading?: boolean
  className?: string
}

export const KpiCard = memo(function KpiCard({ metric, icon, loading, className }: KpiCardProps) {
  if (loading) {
    return <CardSkeleton className={className} />
  }

  const TrendIcon =
    metric.trend === 'up' ? ArrowUpRight : metric.trend === 'down' ? ArrowDownRight : Minus

  return (
    <article
      className={cn(
        'rounded-xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-300 hover:border-primary/15 hover:shadow-md',
        className,
      )}
      aria-label={`${metric.label}: ${formatKpiValue(metric.value, metric.format)}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-medium text-muted-foreground">{metric.label}</p>
          <span
            className="group relative inline-flex"
            title={metric.tooltip}
            aria-label={metric.tooltip}
          >
            <HelpCircle className="h-3.5 w-3.5 text-muted-foreground/60" />
          </span>
        </div>
        <div className="text-muted-foreground" aria-hidden="true">
          {icon}
        </div>
      </div>

      <p className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
        {formatKpiValue(metric.value, metric.format)}
      </p>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
            metric.trend === 'up' && 'bg-success/10 text-success',
            metric.trend === 'down' && 'bg-destructive/10 text-destructive',
            metric.trend === 'neutral' && 'bg-muted text-muted-foreground',
          )}
        >
          <TrendIcon className="h-3 w-3" />
          {formatPercent(metric.change)}
        </span>
        <span className="text-xs text-muted-foreground">{metric.comparisonBadge}</span>
      </div>
    </article>
  )
})
