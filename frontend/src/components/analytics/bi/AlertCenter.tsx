import { useMemo, useState } from 'react'
import { cn } from '@/lib/cn'
import type { AlertSeverity, BusinessAlert } from '@/types/dashboard'
import { AlertCard } from '../AlertCard'

const FILTER_OPTIONS: { value: AlertSeverity | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'critical', label: 'Critical' },
  { value: 'warning', label: 'Warning' },
  { value: 'info', label: 'Information' },
  { value: 'success', label: 'Success' },
]

interface AlertCenterProps {
  alerts: BusinessAlert[]
  className?: string
}

export function AlertCenter({ alerts, className }: AlertCenterProps) {
  const [severity, setSeverity] = useState<AlertSeverity | 'all'>('all')

  const filtered = useMemo(() => {
    if (severity === 'all') return alerts
    return alerts.filter((a) => a.severity === severity)
  }, [alerts, severity])

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter alerts by priority">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={severity === opt.value}
            onClick={() => setSeverity(opt.value)}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30',
              severity === opt.value
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border text-muted-foreground hover:bg-muted',
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
      <div className="space-y-3" role="list" aria-label="Filtered business alerts">
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">No alerts match this filter.</p>
        ) : (
          filtered.map((alert) => <AlertCard key={alert.id} alert={alert} />)
        )}
      </div>
    </div>
  )
}
