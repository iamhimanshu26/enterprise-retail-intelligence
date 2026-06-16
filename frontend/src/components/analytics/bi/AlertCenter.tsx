import { memo, useMemo, useState } from 'react'
import { Bell } from 'lucide-react'
import { AlertListSkeleton } from '@/components/design-system/LoadingSkeleton'
import { EmptyState } from '@/components/design-system/EmptyState'
import { DASHBOARD_EMPTY } from '@/lib/dashboard-empty-messages'
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
  loading?: boolean
  className?: string
}

export const AlertCenter = memo(function AlertCenter({ alerts, loading, className }: AlertCenterProps) {
  const [severity, setSeverity] = useState<AlertSeverity | 'all'>('all')

  const filtered = useMemo(() => {
    if (severity === 'all') return alerts
    return alerts.filter((a) => a.severity === severity)
  }, [alerts, severity])

  if (loading) {
    return <AlertListSkeleton className={className} />
  }

  if (alerts.length === 0) {
    return (
      <EmptyState
        icon={Bell}
        title={DASHBOARD_EMPTY.alerts.title}
        description={DASHBOARD_EMPTY.alerts.description}
        compact
      />
    )
  }

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
          <EmptyState
            icon={Bell}
            title="No alerts match this filter."
            description="Try a different severity filter or reset dashboard filters."
            compact
            className="border-solid bg-card"
          />
        ) : (
          filtered.map((alert) => <AlertCard key={alert.id} alert={alert} />)
        )}
      </div>
    </div>
  )
})
