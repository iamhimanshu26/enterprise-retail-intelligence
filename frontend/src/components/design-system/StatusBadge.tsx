import { cn } from '@/lib/cn'
import type { StatusVariant } from '@/types'

const variants: Record<StatusVariant, string> = {
  foundation: 'bg-success/10 text-success border-success/20',
  'in-progress': 'bg-warning/10 text-warning border-warning/20',
  planned: 'bg-info/10 text-info border-info/20',
  future: 'bg-muted text-muted-foreground border-border',
}

const labels: Record<StatusVariant, string> = {
  foundation: 'Foundation',
  'in-progress': 'In Progress',
  planned: 'Planned',
  future: 'Future Phase',
}

interface StatusBadgeProps {
  status: StatusVariant
  label?: string
  className?: string
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variants[status],
        className,
      )}
    >
      {label ?? labels[status]}
    </span>
  )
}
