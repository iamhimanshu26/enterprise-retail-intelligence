import { SectionContainer } from '@/components/design-system'
import { cn } from '@/lib/cn'
import type { ServiceHealthItem } from '@/types/monitoring'
import { healthColor } from '../adapters/operationsAdapter'

interface ServiceHealthDashboardProps {
  services: ServiceHealthItem[]
  loading?: boolean
}

function statusDot(status: string): string {
  if (status === 'healthy') return 'bg-success'
  if (status === 'degraded') return 'bg-amber-500'
  return 'bg-destructive'
}

export function ServiceHealthDashboard({ services, loading }: ServiceHealthDashboardProps) {
  return (
    <SectionContainer
      title="Service Health"
      description="Frontend, API gateway, data service, database, and engine health indicators."
    >
      {loading ? (
        <div className="h-32 animate-pulse rounded-xl bg-muted" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.service_id}
              className="rounded-xl border border-border/80 bg-card p-4 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <span className={cn('h-3 w-3 rounded-full', statusDot(service.status))} />
                <h3 className="text-sm font-semibold text-foreground">{service.service_name}</h3>
              </div>
              <p className={cn('mt-2 text-sm font-medium capitalize', healthColor(service.status))}>
                {service.status}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{service.message}</p>
              {service.latency_ms != null && (
                <p className="mt-2 text-xs font-mono text-muted-foreground">
                  {service.latency_ms.toFixed(0)} ms
                </p>
              )}
            </article>
          ))}
        </div>
      )}
    </SectionContainer>
  )
}
