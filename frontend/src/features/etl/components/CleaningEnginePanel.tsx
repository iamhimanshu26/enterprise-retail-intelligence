import { Activity } from 'lucide-react'
import { StatusBadge } from '@/components/design-system'
import { GeneratorCard } from '@/features/generator/components/GeneratorCard'

interface CleaningEnginePanelProps {
  status: string
  sprint: string
  flow: string[]
}

export function CleaningEnginePanel({ status, sprint, flow }: CleaningEnginePanelProps) {
  return (
    <GeneratorCard
      title="Cleaning Engine Execution Flow"
      description="Profile → Validate → Clean → Transform → Quality Score → Analytics Ready"
      icon={<Activity className="h-5 w-5" />}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status="in-progress" label={`Sprint ${sprint}`} />
          <StatusBadge status="foundation" label={status.replace(/_/g, ' ')} />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1 py-2 text-xs font-medium text-muted-foreground">
          {flow.map((stage, i) => (
            <span key={stage} className="flex items-center gap-1">
              <span className="rounded-md bg-primary/10 px-2 py-1 text-primary">{stage}</span>
              {i < flow.length - 1 && <span>↓</span>}
            </span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Run via API: <code className="rounded bg-muted px-1">POST /api/v1/etl/run/sample</code> returns quality score, audit log, and JSON report.
        </p>
      </div>
    </GeneratorCard>
  )
}
