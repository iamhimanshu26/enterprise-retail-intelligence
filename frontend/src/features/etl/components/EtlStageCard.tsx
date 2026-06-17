import { cn } from '@/lib/cn'
import { StatusBadge } from '@/components/design-system'

interface EtlStageCardProps {
  title: string
  description: string
  order: number
  status: string
  icon?: React.ReactNode
  className?: string
  sprintLabel?: string
}

export function EtlStageCard({
  title,
  description,
  order,
  status,
  icon,
  className,
  sprintLabel = '4.1',
}: EtlStageCardProps) {
  return (
    <div className={cn('rounded-xl border border-border/80 bg-card shadow-sm', className)}>
      <div className="border-b border-border/60 px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {icon && <div className="text-primary">{icon}</div>}
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Stage {order}
              </p>
              <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            </div>
          </div>
          <StatusBadge
            status={status === 'foundation_ready' ? 'foundation' : 'in-progress'}
            label={status === 'foundation_ready' ? 'Ready' : status}
            className="shrink-0"
          />
        </div>
      </div>
      <div className="p-5">
        <p className="text-sm text-muted-foreground">{description}</p>
        <p className="mt-3 text-xs text-muted-foreground">
          Sprint {sprintLabel} — engine modules implemented; interactive run UI in future sprints
        </p>
      </div>
    </div>
  )
}
