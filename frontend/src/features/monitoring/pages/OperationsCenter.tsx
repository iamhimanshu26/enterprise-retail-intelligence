import { Loader2, RefreshCw } from 'lucide-react'
import {
  Breadcrumb,
  MetricCard,
  PageHeader,
  SectionContainer,
  StatusBadge,
} from '@/components/design-system'
import { DataQualityCenter } from '../components/DataQualityCenter'
import { ExecutionHistoryDashboard } from '../components/ExecutionHistoryDashboard'
import { FailureAnalysisCenter } from '../components/FailureAnalysisCenter'
import { LineageVisualization } from '../components/LineageVisualization'
import { OperationalKpiSummary } from '../components/OperationalKpiSummary'
import { PipelineMetricsDashboard } from '../components/PipelineMetricsDashboard'
import { PipelineStatusBoard } from '../components/PipelineStatusBoard'
import { RetryManagementDashboard } from '../components/RetryManagementDashboard'
import { ServiceHealthDashboard } from '../components/ServiceHealthDashboard'
import { useOperationsData } from '../hooks/useOperationsData'

export function OperationsCenter() {
  const { data, isLoading, isFetching, refetch } = useOperationsData()
  const loading = isLoading || isFetching
  const report = data?.report

  return (
    <div className="space-y-8">
      <PageHeader
        title="Pipeline Operations Center"
        description="Enterprise monitoring console — pipeline health, execution history, data quality, failures, retries, lineage, and service health."
        badge={{ status: 'completed', label: 'Phase 8 · Complete' }}
        actions={
          <button
            type="button"
            onClick={() => refetch()}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Refresh operations
          </button>
        }
      />
      <Breadcrumb items={[{ label: 'Pipeline Operations Center' }]} />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Data source" value={report?.overview.data_source ?? '—'} />
        <MetricCard
          label="Report time"
          value={report ? `${report.execution_time_seconds}s` : '—'}
        />
        <MetricCard label="Modules" value={String(report?.overview.modules.length ?? 8)} />
        <div className="flex items-center gap-2 rounded-xl border border-border/80 bg-card p-5 shadow-sm">
          <StatusBadge
            status={data?.source === 'api' ? 'completed' : 'in-progress'}
            label={data?.source === 'api' ? 'Live API' : 'Mock fallback'}
          />
          <span className="text-sm text-muted-foreground">Operations data source</span>
        </div>
      </div>

      {report && (
        <>
          <OperationalKpiSummary kpis={report.operational_kpis} loading={isLoading} />
          <PipelineStatusBoard modules={report.pipeline_modules} loading={isLoading} />
          <ExecutionHistoryDashboard executions={report.executions} loading={isLoading} />
          <DataQualityCenter
            quality={report.quality}
            historyChart={data?.qualityHistoryChart ?? []}
            loading={isLoading}
          />
          <PipelineMetricsDashboard
            metrics={report.metrics}
            chartData={data?.metricsChart ?? []}
            loading={isLoading}
          />
          <FailureAnalysisCenter
            failures={report.failures}
            byCategory={data?.failureByCategoryChart ?? []}
            bySeverity={data?.failureBySeverityChart ?? []}
            byPipeline={data?.failureByPipelineChart ?? []}
            loading={isLoading}
          />
          <RetryManagementDashboard retries={report.retries} loading={isLoading} />
          <LineageVisualization nodes={report.lineage} loading={isLoading} />
          <ServiceHealthDashboard services={report.service_health} loading={isLoading} />
        </>
      )}

      <SectionContainer
        title="Operational Summary"
        description="Phase 8 monitoring foundation — ready for Airflow workflow orchestration in Phase 9."
      >
        <p className="text-sm text-muted-foreground">
          The Operations Center centralizes pipeline execution tracking, quality monitoring, failure analysis,
          retry recommendations, lineage visibility, and service health. Scheduled orchestration and automatic
          retries arrive with Apache Airflow in Phase 9.
        </p>
      </SectionContainer>
    </div>
  )
}
