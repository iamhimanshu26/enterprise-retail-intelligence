import { cn } from '@/lib/cn'

interface LoadingSkeletonProps {
  className?: string
  lines?: number
}

export function LoadingSkeleton({ className, lines = 3 }: LoadingSkeletonProps) {
  return (
    <div className={cn('animate-pulse space-y-3', className)}>
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
    <div className={cn('glass-panel animate-pulse rounded-xl p-6', className)}>
      <div className="h-4 w-1/3 rounded bg-muted" />
      <div className="mt-4 h-8 w-1/2 rounded bg-muted" />
      <div className="mt-6 h-3 w-2/3 rounded bg-muted" />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="glass-panel overflow-hidden rounded-xl">
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
