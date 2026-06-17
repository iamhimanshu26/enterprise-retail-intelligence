import {
  BarChart3,
  Database,
  FileText,
  Layers,
  Settings2,
  ShieldCheck,
  Sparkles,
  Upload,
  Workflow,
} from 'lucide-react'
import { MetricCard, StatusBadge } from '@/components/design-system'
import { DEFAULT_PIPELINE_FLOW } from '@/types/etl'
import { GeneratorCard } from '@/features/generator/components/GeneratorCard'

const ICON_MAP = {
  upload: Upload,
  shield: ShieldCheck,
  sparkles: Sparkles,
  settings: Settings2,
  layers: Layers,
  'bar-chart': BarChart3,
  database: Database,
  'file-text': FileText,
}

interface PipelineStatusPanelProps {
  status: string
  sprint: string
  sources: string[]
  targets: string[]
}

export function PipelineStatusPanel({ status, sprint, sources, targets }: PipelineStatusPanelProps) {
  return (
    <GeneratorCard title="Pipeline Status" description="Enterprise ETL foundation — Sprint 4.1" icon={<Workflow className="h-5 w-5" />}>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status="in-progress" label={`Sprint ${sprint}`} />
          <StatusBadge status="foundation" label={status.replace(/_/g, ' ')} />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-1 py-2 text-xs font-medium text-muted-foreground">
          {DEFAULT_PIPELINE_FLOW.map((stage, i) => (
            <span key={stage} className="flex items-center gap-1">
              <span className="rounded-md bg-muted px-2 py-1">{stage}</span>
              {i < DEFAULT_PIPELINE_FLOW.length - 1 && <span className="text-primary">↓</span>}
            </span>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg bg-muted/30 px-3 py-2 text-sm">
            <p className="text-xs text-muted-foreground">Input sources</p>
            <p className="mt-1 font-medium">{sources.join(', ')}</p>
          </div>
          <div className="rounded-lg bg-muted/30 px-3 py-2 text-sm">
            <p className="text-xs text-muted-foreground">Load targets</p>
            <p className="mt-1 font-medium">{targets.join(', ')}</p>
          </div>
        </div>
      </div>
    </GeneratorCard>
  )
}

export function StageIcon({ id }: { id: string }) {
  const key = id === 'validate' ? 'shield' : id === 'aggregate' ? 'bar-chart' : id === 'load' ? 'database' : id === 'report' ? 'file-text' : id === 'transform' ? 'settings' : id === 'normalize' ? 'layers' : id === 'clean' ? 'sparkles' : 'upload'
  const Icon = ICON_MAP[key] ?? Workflow
  return <Icon className="h-5 w-5" />
}

export function PipelineMetrics({ sprint = '4.2' }: { sprint?: string }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard label="Cleaning stages" value="10" />
      <MetricCard label="ETL foundation stages" value="8" />
      <MetricCard label="Quality dimensions" value="5" />
      <MetricCard label="Sprint" value={sprint} />
    </div>
  )
}
