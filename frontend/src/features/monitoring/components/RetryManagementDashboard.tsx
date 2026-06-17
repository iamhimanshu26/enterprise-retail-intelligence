import { DataTable, SectionContainer } from '@/components/design-system'
import type { RetryRecord } from '@/types/monitoring'
import type { TableColumn } from '@/types'

interface RetryManagementDashboardProps {
  retries: RetryRecord[]
  loading?: boolean
}

export function RetryManagementDashboard({ retries, loading }: RetryManagementDashboardProps) {
  const columns: TableColumn<RetryRecord>[] = [
    { key: 'pipeline', header: 'Pipeline' },
    { key: 'retry_count', header: 'Retry Count' },
    { key: 'retry_recommendation', header: 'Recommendation' },
    {
      key: 'retryable',
      header: 'Retryable',
      render: (row) => (row.retryable ? 'Yes' : 'No'),
    },
    { key: 'next_retry_placeholder', header: 'Next Retry' },
    { key: 'status', header: 'Status' },
  ]

  return (
    <SectionContainer
      title="Retry Management"
      description="Retry queue, recommendations, and history — automatic execution arrives in Phase 9."
    >
      {loading ? (
        <div className="h-32 animate-pulse rounded-xl bg-muted" />
      ) : (
        <>
          <DataTable columns={columns} data={retries} emptyMessage="No retry queue items" />
          <p className="mt-3 text-xs text-muted-foreground">
            Automatic retry execution is not enabled — manual and orchestrated retries integrate with Airflow in Phase 9.
          </p>
        </>
      )}
    </SectionContainer>
  )
}
