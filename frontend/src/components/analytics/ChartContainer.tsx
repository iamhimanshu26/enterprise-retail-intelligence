import { Download, MoreHorizontal, RefreshCw } from 'lucide-react'
import { CardSkeleton } from '@/components/design-system/LoadingSkeleton'
import { EmptyState } from '@/components/design-system/EmptyState'
import { cn } from '@/lib/cn'

export type ChartContainerProps = {
  title: string
  description?: string
  height?: string
  className?: string
  children?: React.ReactNode
  loading?: boolean
  empty?: boolean
  emptyMessage?: string
  onRefresh?: () => void
  onExport?: () => void
  showActions?: boolean
}

interface ChartContainerComponentProps extends ChartContainerProps {}

export function ChartContainer({
  title,
  description,
  height = 'h-64',
  className,
  children,
  loading = false,
  empty = false,
  emptyMessage = 'No chart data available',
  onRefresh,
  onExport,
  showActions = true,
}: ChartContainerComponentProps) {
  return (
    <div className={cn('rounded-xl border border-border/80 bg-card shadow-sm', className)}>
      <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
        {showActions && (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={onRefresh}
              disabled={!onRefresh}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
              aria-label="Refresh chart"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onExport}
              disabled={!onExport}
              className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
              aria-label="Export chart"
              title="Export"
            >
              <Download className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled
              className="rounded-md p-1.5 text-muted-foreground opacity-40"
              aria-label="Chart actions"
              title="More actions"
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      <div className={cn('p-6', height)}>
        {loading ? (
          <CardSkeleton className="h-full border-0 shadow-none" />
        ) : empty ? (
          <EmptyState title={emptyMessage} description="Data will appear when APIs are connected." className="border-0 bg-transparent py-8" />
        ) : (
          <div className={cn('flex h-full w-full items-center justify-center')}>{children}</div>
        )}
      </div>
    </div>
  )
}
