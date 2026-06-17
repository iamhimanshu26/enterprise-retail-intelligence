import { Play, Loader2 } from 'lucide-react'
import { StatusBadge } from '@/components/design-system'
import { GeneratorCard } from '@/features/generator/components/GeneratorCard'
import type { EtlRunResult } from '@/types/etl'

interface ETLRunCardProps {
  lastRun: EtlRunResult | null
  running: boolean
  onRun: () => void
}

export function ETLRunCard({ lastRun, running, onRun }: ETLRunCardProps) {
  return (
    <GeneratorCard title="Pipeline Execution" description="Run sample enterprise ETL pipeline">
      <div className="space-y-4">
        <button
          type="button"
          onClick={onRun}
          disabled={running}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          {running ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          {running ? 'Running pipeline...' : 'Run Sample Pipeline'}
        </button>

        {lastRun && (
          <div className="space-y-2 rounded-lg bg-muted/30 p-3 text-sm">
            <div className="flex items-center gap-2">
              <StatusBadge
                status={lastRun.success ? 'completed' : 'in-progress'}
                label={lastRun.success ? 'Success' : 'Failed'}
              />
              {lastRun.entity && <span className="text-muted-foreground">Entity: {lastRun.entity}</span>}
            </div>
            {lastRun.rows_in_output != null && (
              <p>Rows output: <span className="font-medium">{lastRun.rows_in_output}</span></p>
            )}
            {lastRun.quality_score && (
              <p>
                Quality index:{' '}
                <span className="font-medium">
                  {lastRun.quality_score.data_quality_index?.toFixed(1) ?? lastRun.quality_score.overall?.toFixed(1)}%
                </span>
              </p>
            )}
            {lastRun.pipeline_id && (
              <p className="text-xs text-muted-foreground truncate">ID: {lastRun.pipeline_id}</p>
            )}
            {lastRun.error && (
              <p className="text-destructive">{lastRun.error}</p>
            )}
          </div>
        )}
      </div>
    </GeneratorCard>
  )
}
