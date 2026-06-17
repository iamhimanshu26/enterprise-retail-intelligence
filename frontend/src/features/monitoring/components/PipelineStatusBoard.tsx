import { SectionContainer, StatusBadge } from '@/components/design-system'
import type { PipelineModuleStatus } from '@/types/monitoring'
import { statusToBadge } from '../adapters/operationsAdapter'

interface PipelineStatusBoardProps {
  modules: PipelineModuleStatus[]
  loading?: boolean
}

function formatStatus(status: string): string {
  return status.replace(/_/g, ' ')
}

export function PipelineStatusBoard({ modules, loading }: PipelineStatusBoardProps) {
  return (
    <SectionContainer
      title="Pipeline Status Board"
      description="Health of every platform module — generator, ETL, warehouse, analytics, and forecasting."
    >
      {loading ? (
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {modules.map((module) => (
            <article
              key={module.module_id}
              className="rounded-xl border border-border/80 bg-card p-4 shadow-sm transition-all hover:border-primary/15"
            >
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold text-foreground">{module.module_name}</h3>
                <StatusBadge status={statusToBadge(module.status)} label={formatStatus(module.status)} />
              </div>
              <dl className="mt-3 space-y-1 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <dt>Last run</dt>
                  <dd className="font-mono text-foreground">{new Date(module.last_run).toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Duration</dt>
                  <dd>{module.duration_seconds.toFixed(1)}s</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Quality</dt>
                  <dd>{module.quality_score.toFixed(1)}%</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Rows</dt>
                  <dd>{module.processed_rows.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Trend</dt>
                  <dd className="capitalize">{module.trend}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </SectionContainer>
  )
}
