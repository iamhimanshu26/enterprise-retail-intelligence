import { useQuery } from '@tanstack/react-query'
import { Activity, CheckCircle2, Clock, XCircle } from 'lucide-react'
import { API_BASE_URL, DATA_SERVICE_URL } from '@/lib/constants'
import { cn } from '@/lib/cn'

type ServiceStatus = 'operational' | 'degraded' | 'future'

interface ServiceItem {
  name: string
  status: ServiceStatus
  detail: string
  phase?: number
}

async function pingHealth(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(3000) })
    return response.ok
  } catch {
    return false
  }
}

function StatusIcon({ status }: { status: ServiceStatus }) {
  if (status === 'operational') return <CheckCircle2 className="h-4 w-4 text-success" />
  if (status === 'degraded') return <XCircle className="h-4 w-4 text-warning" />
  return <Clock className="h-4 w-4 text-muted-foreground" />
}

export function SystemHealthWidget() {
  const { data: backendUp } = useQuery({
    queryKey: ['health', 'backend'],
    queryFn: () => pingHealth(`${API_BASE_URL}/api/v1/health`),
    refetchInterval: 60_000,
    retry: false,
  })

  const { data: pythonUp } = useQuery({
    queryKey: ['health', 'python'],
    queryFn: () => pingHealth(`${DATA_SERVICE_URL}/api/v1/health`),
    refetchInterval: 60_000,
    retry: false,
  })

  const services: ServiceItem[] = [
    { name: 'Frontend', status: 'operational', detail: 'Vercel / local nginx' },
    {
      name: 'Backend',
      status: backendUp ? 'operational' : 'degraded',
      detail: backendUp ? 'Spring Boot health check passed' : 'Unavailable — start Docker backend',
    },
    {
      name: 'Python Service',
      status: pythonUp ? 'operational' : 'degraded',
      detail: pythonUp ? 'FastAPI health check passed' : 'Unavailable — start Docker service',
    },
    {
      name: 'PostgreSQL',
      status: backendUp ? 'operational' : 'degraded',
      detail: backendUp ? 'Connected via backend' : 'Requires Docker Compose',
    },
    { name: 'ETL Engine', status: 'future', detail: 'Available in future phase.', phase: 3 },
    { name: 'Forecast Engine', status: 'future', detail: 'Available in future phase.', phase: 6 },
  ]

  const operational = services.filter((s) => s.status === 'operational').length

  return (
    <div className="rounded-xl border border-border/80 bg-card shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">System Health</h3>
        </div>
        <span className="text-xs text-muted-foreground">
          {operational}/{services.filter((s) => s.status !== 'future').length} core services
        </span>
      </div>
      <ul className="divide-y divide-border/60">
        {services.map((service) => (
          <li key={service.name} className="flex items-start gap-3 px-5 py-3.5">
            <StatusIcon status={service.status} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground">{service.name}</p>
              <p className="text-xs text-muted-foreground">{service.detail}</p>
            </div>
            <span
              className={cn(
                'shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium',
                service.status === 'operational' && 'bg-success/10 text-success',
                service.status === 'degraded' && 'bg-warning/10 text-warning',
                service.status === 'future' && 'bg-muted text-muted-foreground',
              )}
            >
              {service.status === 'future' ? `Phase ${service.phase}` : service.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
