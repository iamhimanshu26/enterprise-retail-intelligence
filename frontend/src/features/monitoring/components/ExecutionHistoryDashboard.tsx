import { useMemo, useState } from 'react'
import { DataTable, SectionContainer } from '@/components/design-system'
import type { ExecutionHistoryRow } from '@/types/monitoring'
import type { TableColumn } from '@/types'

interface ExecutionHistoryDashboardProps {
  executions: ExecutionHistoryRow[]
  loading?: boolean
}

export function ExecutionHistoryDashboard({ executions, loading }: ExecutionHistoryDashboardProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filtered = useMemo(() => {
    if (statusFilter === 'all') return executions
    return executions.filter((e) => e.status === statusFilter)
  }, [executions, statusFilter])

  const columns: TableColumn<ExecutionHistoryRow & Record<string, unknown>>[] = [
    { key: 'run_id', header: 'Run ID' },
    { key: 'pipeline', header: 'Pipeline' },
    {
      key: 'start_time',
      header: 'Start Time',
      render: (row) => new Date(row.start_time).toLocaleString(),
    },
    {
      key: 'end_time',
      header: 'End Time',
      render: (row) => new Date(row.end_time).toLocaleString(),
    },
    {
      key: 'duration_seconds',
      header: 'Duration',
      render: (row) => `${row.duration_seconds.toFixed(2)}s`,
    },
    { key: 'status', header: 'Status' },
    { key: 'rows_processed', header: 'Rows Processed' },
    { key: 'failed_rows', header: 'Failed Rows' },
    { key: 'trigger_source', header: 'Trigger Source' },
  ]

  return (
    <SectionContainer
      title="Execution History"
      description="Pipeline run history with filtering placeholder — sorting and pagination ready for Airflow Phase 9."
    >
      {loading ? (
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
      ) : (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            {['all', 'success', 'warning', 'failed', 'running', 'queued'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium capitalize ${
                  statusFilter === status
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
          <DataTable
            columns={columns}
            data={filtered as Array<ExecutionHistoryRow & Record<string, unknown>>}
            emptyMessage="No executions match the selected filter"
          />
          <p className="mt-3 text-xs text-muted-foreground">
            Pagination placeholder — full paging integrates with workflow orchestration in Phase 9.
          </p>
        </>
      )}
    </SectionContainer>
  )
}
