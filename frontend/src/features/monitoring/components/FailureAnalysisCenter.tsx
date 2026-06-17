import { DataTable, SectionContainer } from '@/components/design-system'
import { EnterpriseBarChart } from '@/features/visualization/charts'
import { TrendChartCard } from '@/features/visualization/containers/TrendChartCard'
import type { ChartSeriesPoint } from '@/features/visualization/adapters/chartAdapters'
import type { FailureRecord } from '@/types/monitoring'
import type { TableColumn } from '@/types'

interface FailureAnalysisCenterProps {
  failures: FailureRecord[]
  byCategory: ChartSeriesPoint[]
  bySeverity: ChartSeriesPoint[]
  byPipeline: ChartSeriesPoint[]
  loading?: boolean
}

export function FailureAnalysisCenter({
  failures,
  byCategory,
  bySeverity,
  byPipeline,
  loading,
}: FailureAnalysisCenterProps) {
  const columns: TableColumn<FailureRecord>[] = [
    { key: 'category', header: 'Category' },
    { key: 'severity', header: 'Severity' },
    { key: 'pipeline', header: 'Pipeline' },
    { key: 'root_cause_placeholder', header: 'Root Cause' },
    { key: 'suggested_action', header: 'Suggested Action' },
    { key: 'retry_recommendation', header: 'Retry Recommendation' },
    { key: 'frequency', header: 'Frequency' },
  ]

  return (
    <SectionContainer
      title="Failure Analysis Center"
      description="Failure categories, severity, root cause placeholders, and retry guidance."
    >
      {loading ? (
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 lg:grid-cols-3">
            <TrendChartCard title="Failures by Category" data={byCategory}>
              <EnterpriseBarChart data={byCategory} />
            </TrendChartCard>
            <TrendChartCard title="Failures by Severity" data={bySeverity}>
              <EnterpriseBarChart data={bySeverity} />
            </TrendChartCard>
            <TrendChartCard title="Failures by Pipeline" data={byPipeline}>
              <EnterpriseBarChart data={byPipeline} />
            </TrendChartCard>
          </div>
          <DataTable columns={columns} data={failures} emptyMessage="No failures recorded" />
        </div>
      )}
    </SectionContainer>
  )
}
