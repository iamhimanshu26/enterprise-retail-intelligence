import type { ReactNode } from 'react'
import { ChartSkeleton } from '@/components/design-system/LoadingSkeleton'
import { EmptyState } from '@/components/design-system/EmptyState'
import { cn } from '@/lib/cn'
import { ChartToolbar } from './ChartToolbar'
import { DEFAULT_CHART_HEIGHT } from '../charts/types'

export interface ChartCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  loading?: boolean
  empty?: boolean
  emptyTitle?: string
  emptyDescription?: string
  height?: string
  className?: string
  onRefresh?: () => void
  footer?: ReactNode
}

export function ChartCard({
  title,
  subtitle,
  children,
  loading = false,
  empty = false,
  emptyTitle = 'No chart data',
  emptyDescription = 'Adjust filters or load analytics data from the data service.',
  height = DEFAULT_CHART_HEIGHT,
  className,
  onRefresh,
  footer,
}: ChartCardProps) {
  return (
    <article
      className={cn(
        'rounded-xl border border-border/80 bg-card shadow-sm transition-all hover:border-primary/10',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3 border-b border-border/60 px-5 py-4">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold tracking-tight text-foreground">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <ChartToolbar onRefresh={onRefresh} />
      </div>

      <div className={cn('px-4 py-4', height)}>
        {loading ? (
          <ChartSkeleton />
        ) : empty ? (
          <EmptyState title={emptyTitle} description={emptyDescription} compact className="h-full border-0 bg-transparent shadow-none" />
        ) : (
          children
        )}
      </div>

      {footer && !loading && !empty && (
        <div className="border-t border-border/60 px-5 py-3">{footer}</div>
      )}
    </article>
  )
}
