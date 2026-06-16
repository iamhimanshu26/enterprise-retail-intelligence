import { memo } from 'react'
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react'
import { CardSkeleton } from '@/components/design-system/LoadingSkeleton'
import { cn } from '@/lib/cn'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatters'
import type { TrendDirection } from '@/types/dashboard'

interface MetricWidgetProps {
  label: string
  value: string | number
  change?: number
  trend?: TrendDirection
  comparisonLabel?: string
  format?: 'currency' | 'number' | 'percent' | 'text'
  loading?: boolean
  className?: string
}

function formatValue(value: string | number, format: MetricWidgetProps['format']): string {
  if (typeof value === 'string') return value
  switch (format) {
    case 'currency':
      return formatCurrency(value, true)
    case 'percent':
      return `${value.toFixed(1)}%`
    case 'number':
      return formatNumber(value, true)
    default:
      return String(value)
  }
}

export const MetricWidget = memo(function MetricWidget({
  label,
  value,
  change,
  trend = 'neutral',
  comparisonLabel,
  format = 'text',
  loading,
  className,
}: MetricWidgetProps) {
  if (loading) return <CardSkeleton className={className} />

  const TrendIcon =
    trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : Minus

  return (
    <article
      className={cn(
        'rounded-xl border border-border/80 bg-card p-5 shadow-sm transition-all hover:border-primary/15 hover:shadow-md',
        className,
      )}
    >
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-xl font-semibold tracking-tight">{formatValue(value, format)}</p>
      {change !== undefined && (
        <div className="mt-2 flex items-center gap-1 text-xs">
          <TrendIcon
            className={cn(
              'h-3.5 w-3.5',
              trend === 'up' && 'text-success',
              trend === 'down' && 'text-destructive',
              trend === 'neutral' && 'text-muted-foreground',
            )}
          />
          <span
            className={cn(
              'font-medium',
              trend === 'up' && 'text-success',
              trend === 'down' && 'text-destructive',
            )}
          >
            {formatPercent(change)}
          </span>
          {comparisonLabel && <span className="text-muted-foreground">{comparisonLabel}</span>}
        </div>
      )}
    </article>
  )
})
