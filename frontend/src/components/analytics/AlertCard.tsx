import { cn } from '@/lib/cn'
import { formatRelativeTime } from '@/lib/formatters'
import type { BusinessAlert } from '@/types/dashboard'
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react'

const SEVERITY_CONFIG = {
  info: { icon: Info, badge: 'bg-primary/10 text-primary', label: 'Info' },
  warning: { icon: AlertTriangle, badge: 'bg-amber-500/10 text-amber-600 dark:text-amber-400', label: 'Warning' },
  critical: { icon: AlertCircle, badge: 'bg-destructive/10 text-destructive', label: 'Critical' },
  success: { icon: CheckCircle2, badge: 'bg-success/10 text-success', label: 'Success' },
} as const

interface AlertCardProps {
  alert: BusinessAlert
  className?: string
}

export function AlertCard({ alert, className }: AlertCardProps) {
  const config = SEVERITY_CONFIG[alert.severity]
  const Icon = config.icon

  return (
    <article
      className={cn(
        'flex gap-3 rounded-xl border border-border/80 bg-card p-4 shadow-sm transition-colors hover:bg-muted/20',
        className,
      )}
      role="alert"
      aria-label={`${config.label}: ${alert.title}`}
    >
      <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', config.badge)}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-sm font-semibold text-foreground">{alert.title}</h4>
          <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide', config.badge)}>
            {config.label}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{alert.message}</p>
        <p className="mt-2 text-xs text-muted-foreground">{formatRelativeTime(alert.timestamp)}</p>
      </div>
    </article>
  )
}

interface AlertPanelProps {
  alerts: BusinessAlert[]
  className?: string
}

export function AlertPanel({ alerts, className }: AlertPanelProps) {
  return (
    <div className={cn('space-y-3', className)} role="list" aria-label="Business alerts">
      {alerts.map((alert) => (
        <AlertCard key={alert.id} alert={alert} />
      ))}
    </div>
  )
}
