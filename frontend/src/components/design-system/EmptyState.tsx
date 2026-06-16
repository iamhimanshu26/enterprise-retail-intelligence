import { cn } from '@/lib/cn'
import type { LucideIcon } from 'lucide-react'
import { Inbox } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
  className?: string
  compact?: boolean
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  className,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-center',
        compact ? 'px-4 py-10' : 'px-6 py-16',
        className,
      )}
      role="status"
    >
      <div
        className={cn(
          'mb-4 flex items-center justify-center rounded-2xl bg-primary/10 text-primary',
          compact ? 'h-12 w-12' : 'h-14 w-14',
        )}
      >
        <Icon className={cn(compact ? 'h-6 w-6' : 'h-7 w-7')} aria-hidden="true" />
      </div>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
