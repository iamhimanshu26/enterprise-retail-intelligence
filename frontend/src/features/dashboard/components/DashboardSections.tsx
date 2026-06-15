import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { BusinessSummaryItem, QuickAction, RegionalHighlight } from '@/types/dashboard'

interface BusinessSummaryGridProps {
  items: BusinessSummaryItem[]
  className?: string
}

export function BusinessSummaryGrid({ items, className }: BusinessSummaryGridProps) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 xl:grid-cols-4', className)}>
      {items.map((item) => (
        <article
          key={item.id}
          className="rounded-xl border border-border/80 bg-card p-5 shadow-sm transition-all hover:border-primary/15 hover:shadow-md"
        >
          <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
          <p className="mt-2 text-xl font-semibold tracking-tight">{item.value}</p>
          <div className="mt-2 flex items-center gap-1 text-xs">
            <ArrowUpRight
              className={cn(
                'h-3.5 w-3.5',
                item.trend === 'up' ? 'text-success' : 'text-destructive',
              )}
            />
            <span className={cn('font-medium', item.trend === 'up' ? 'text-success' : 'text-destructive')}>
              {item.change}
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{item.description}</p>
        </article>
      ))}
    </div>
  )
}

interface RegionalPerformanceGridProps {
  highlights: RegionalHighlight[]
  className?: string
}

export function RegionalPerformanceGrid({ highlights, className }: RegionalPerformanceGridProps) {
  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 xl:grid-cols-4', className)}>
      {highlights.map((item) => (
        <article
          key={item.id}
          className="rounded-xl border border-border/80 bg-gradient-to-br from-card to-muted/20 p-5 shadow-sm"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {item.label}
          </p>
          <p className="mt-2 text-lg font-semibold text-foreground">{item.region}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-primary">{item.value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{item.metric}</p>
        </article>
      ))}
    </div>
  )
}

interface QuickActionsBarProps {
  actions: QuickAction[]
  className?: string
}

export function QuickActionsBar({ actions, className }: QuickActionsBarProps) {
  return (
    <div className={cn('flex flex-wrap gap-3', className)} role="toolbar" aria-label="Quick actions">
      {actions.map((action) => (
        <Link
          key={action.id}
          to={action.path}
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground shadow-sm transition-all hover:border-primary/30 hover:bg-primary/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          {action.label}
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      ))}
    </div>
  )
}
