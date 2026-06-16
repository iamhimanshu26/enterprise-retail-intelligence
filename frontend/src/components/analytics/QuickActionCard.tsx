import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import type { QuickAction } from '@/types/dashboard'

interface QuickActionCardProps {
  action: QuickAction
  description?: string
  className?: string
}

export function QuickActionCard({ action, description, className }: QuickActionCardProps) {
  return (
    <Link
      to={action.path}
      className={cn(
        'group flex flex-col rounded-xl border border-border/80 bg-card p-5 shadow-sm transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
        className,
      )}
      aria-label={action.label}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-semibold text-foreground">{action.label}</span>
        <ArrowRight
          className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
        />
      </div>
      {description && (
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{description}</p>
      )}
    </Link>
  )
}

interface QuickActionPanelProps {
  actions: QuickAction[]
  className?: string
}

const ACTION_HINTS: Record<string, string> = {
  qa1: 'Generate synthetic retail datasets for testing.',
  qa2: 'Design and monitor ETL pipelines.',
  qa3: 'Statistical modeling and hypothesis testing.',
  qa4: 'Demand forecasting and scenario planning.',
  qa5: 'Real-time pipeline health and metrics.',
  qa6: 'System architecture and engineering documentation.',
}

export function QuickActionPanel({ actions, className }: QuickActionPanelProps) {
  return (
    <div
      className={cn('grid gap-3 sm:grid-cols-2 lg:grid-cols-3', className)}
      role="toolbar"
      aria-label="Quick actions"
    >
      {actions.map((action) => (
        <QuickActionCard
          key={action.id}
          action={action}
          description={ACTION_HINTS[action.id]}
        />
      ))}
    </div>
  )
}
