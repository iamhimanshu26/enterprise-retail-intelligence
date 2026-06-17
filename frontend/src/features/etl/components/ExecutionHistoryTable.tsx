import { GeneratorCard } from '@/features/generator/components/GeneratorCard'
import { StatusBadge } from '@/components/design-system'
import type { ExecutionRecord } from '@/types/etl'

interface ExecutionHistoryTableProps {
  executions: ExecutionRecord[]
}

export function ExecutionHistoryTable({ executions }: ExecutionHistoryTableProps) {
  return (
    <GeneratorCard title="Execution History" description="Recent ETL pipeline runs">
      {executions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No executions yet. Run a sample pipeline to populate history.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-xs text-muted-foreground">
                <th className="pb-2 pr-4">Pipeline</th>
                <th className="pb-2 pr-4">Entity</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2 pr-4">Rows</th>
                <th className="pb-2 pr-4">Quality</th>
                <th className="pb-2">Duration</th>
              </tr>
            </thead>
            <tbody>
              {executions.map((exec) => (
                <tr key={exec.pipeline_id} className="border-b border-border/40">
                  <td className="py-2.5 pr-4 font-medium">{exec.pipeline_name}</td>
                  <td className="py-2.5 pr-4">{exec.entity}</td>
                  <td className="py-2.5 pr-4">
                    <StatusBadge
                      status={exec.status === 'success' ? 'completed' : 'in-progress'}
                      label={exec.status}
                    />
                  </td>
                  <td className="py-2.5 pr-4 tabular-nums">{exec.processed_rows.toLocaleString()}</td>
                  <td className="py-2.5 pr-4 tabular-nums">{exec.quality_score.toFixed(1)}%</td>
                  <td className="py-2.5 tabular-nums">{exec.duration_seconds.toFixed(2)}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </GeneratorCard>
  )
}
