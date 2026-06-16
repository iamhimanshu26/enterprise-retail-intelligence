import { memo } from 'react'
import { Download, MoreHorizontal, RefreshCw } from 'lucide-react'
import { ChartSkeleton } from '@/components/design-system/LoadingSkeleton'
import { EmptyState } from '@/components/design-system/EmptyState'
import { DASHBOARD_EMPTY } from '@/lib/dashboard-empty-messages'
import { showDashboardPlaceholder } from '@/stores/toastStore'
import { cn } from '@/lib/cn'

export type ChartContainerProps = {
  title: string
  description?: string
  height?: string
  className?: string
  children?: React.ReactNode
  loading?: boolean
  empty?: boolean
  emptyTitle?: string
  emptyDescription?: string
  onRefresh?: () => void
  onExport?: () => void
  showActions?: boolean
}

export const ChartContainer = memo(function ChartContainer({
  title,
  description,
  height = 'h-64',
  className,
  children,
  loading = false,
  empty = false,
  emptyTitle = DASHBOARD_EMPTY.chart.title,
  emptyDescription = DASHBOARD_EMPTY.chart.description,
  onRefresh,
  onExport,
  showActions = true,
}: ChartContainerProps) {
  function handleRefresh() {
    if (onRefresh) {
      onRefresh()
    } else {
      showDashboardPlaceholder('Chart refreshed', 'Live chart refresh will connect to analytics APIs in Phase 5.')
    }
  }

  function handleExport() {
    if (onExport) {
      onExport()
    } else {
      showDashboardPlaceholder('Chart export', 'Chart export to CSV/PDF will be enabled with the visualization platform.')
    }
  }

  return (
    <section
      className={cn('rounded-xl border border-border/80 bg-card shadow-sm transition-shadow hover:shadow-md', className)}
      aria-label={title}
    >
      <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
        {showActions && (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={handleRefresh}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              aria-label={`Refresh ${title}`}
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              aria-label={`Export ${title}`}
              title="Export"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              disabled
              className="rounded-md p-1.5 text-muted-foreground opacity-40"
              aria-label={`More actions for ${title}`}
              title="More actions"
            >
              <MoreHorizontal className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
      <div className={cn('p-4 sm:p-6', height)}>
        {loading ? (
          <ChartSkeleton className="h-full border-0 shadow-none" height="h-full min-h-[12rem]" />
        ) : empty ? (
          <EmptyState
            title={emptyTitle}
            description={emptyDescription}
            className="border-0 bg-transparent py-8"
            compact
          />
        ) : (
          <div className="flex h-full w-full min-h-[12rem] items-center justify-center">{children}</div>
        )}
      </div>
    </section>
  )
})
