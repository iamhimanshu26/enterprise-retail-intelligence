import { cn } from '@/lib/cn'

interface LoadingSkeletonProps {
  className?: string
  lines?: number
}

export function LoadingSkeleton({ className, lines = 3 }: LoadingSkeletonProps) {
  return (
    <div className={cn('animate-pulse space-y-3', className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 rounded-md bg-muted"
          style={{ width: `${100 - i * 15}%` }}
        />
      ))}
    </div>
  )
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('glass-panel animate-pulse rounded-xl p-6', className)}
      aria-hidden="true"
      role="presentation"
    >
      <div className="h-4 w-1/3 rounded bg-muted" />
      <div className="mt-4 h-8 w-1/2 rounded bg-muted" />
      <div className="mt-6 h-3 w-2/3 rounded bg-muted" />
    </div>
  )
}

export function KpiSkeleton({ className }: { className?: string }) {
  return <CardSkeleton className={className} />
}

export function ChartSkeleton({ className, height = 'h-64' }: { className?: string; height?: string }) {
  return (
    <div
      className={cn('animate-pulse rounded-xl border border-border/80 bg-card shadow-sm', className)}
      aria-hidden="true"
      role="presentation"
    >
      <div className="border-b border-border px-5 py-4">
        <div className="h-4 w-1/3 rounded bg-muted" />
        <div className="mt-2 h-3 w-1/2 rounded bg-muted" />
      </div>
      <div className={cn('p-6', height)}>
        <div className="flex h-full items-end gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-md bg-muted"
              style={{ height: `${35 + (i % 4) * 12}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div
      className={cn('glass-panel overflow-hidden rounded-xl', className)}
      aria-hidden="true"
      role="presentation"
    >
      <div className="border-b border-border bg-muted/30 px-6 py-4">
        <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 border-b border-border px-6 py-4 last:border-0">
          <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
          <div className="h-4 w-1/5 animate-pulse rounded bg-muted" />
        </div>
      ))}
    </div>
  )
}

export function TimelineSkeleton({ items = 4, className }: { items?: number; className?: string }) {
  return (
    <div className={cn('space-y-4 pt-1', className)} aria-hidden="true" role="presentation">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-6 w-6 shrink-0 animate-pulse rounded-full bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/4 animate-pulse rounded bg-muted" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function AlertListSkeleton({ items = 3, className }: { items?: number; className?: string }) {
  return (
    <div className={cn('space-y-3', className)} aria-hidden="true" role="presentation">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="animate-pulse rounded-xl border border-border/80 bg-card p-4">
          <div className="flex items-center gap-2">
            <div className="h-5 w-16 rounded-full bg-muted" />
            <div className="h-4 w-1/3 rounded bg-muted" />
          </div>
          <div className="mt-3 h-3 w-full rounded bg-muted" />
          <div className="mt-2 h-3 w-2/3 rounded bg-muted" />
        </div>
      ))}
    </div>
  )
}

export function RegionCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn('animate-pulse rounded-xl border border-border/80 bg-card p-5 shadow-sm', className)}
      aria-hidden="true"
      role="presentation"
    >
      <div className="flex justify-between">
        <div className="h-3 w-16 rounded bg-muted" />
        <div className="h-5 w-20 rounded-full bg-muted" />
      </div>
      <div className="mt-3 h-5 w-1/2 rounded bg-muted" />
      <div className="mt-4 grid grid-cols-2 gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-8 rounded bg-muted" />
        ))}
      </div>
    </div>
  )
}

export function RankingCardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex animate-pulse items-center gap-4 rounded-xl border border-border/80 bg-card p-4 shadow-sm',
        className,
      )}
      aria-hidden="true"
      role="presentation"
    >
      <div className="h-8 w-8 rounded-lg bg-muted" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-2/3 rounded bg-muted" />
        <div className="h-3 w-1/3 rounded bg-muted" />
      </div>
      <div className="h-4 w-16 rounded bg-muted" />
    </div>
  )
}

export function DashboardChartsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6" aria-hidden="true" role="presentation">
      {Array.from({ length: count }).map((_, i) => (
        <ChartSkeleton key={i} height="h-72" />
      ))}
    </div>
  )
}
