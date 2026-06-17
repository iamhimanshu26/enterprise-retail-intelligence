import { useCallback, useEffect, useState } from 'react'
import {
  Breadcrumb,
  ErrorState,
  MetricCard,
  PageHeader,
  SectionContainer,
  TableSkeleton,
} from '@/components/design-system'
import {
  getEtlOverview,
  getExecutionHistory,
  getQualityDashboard,
  getSampleLineage,
  getWarehouseSummary,
  runEtlSample,
} from '@/lib/dataServiceApi'
import {
  CLEANING_ENGINE_FLOW,
  CLEANING_UI_STAGES,
  FINAL_ETL_FLOW,
  type EtlOverview,
  type EtlRunResult,
  type ExecutionRecord,
  type LineageData,
  type QualityScore,
  type WarehouseSummary,
  type EtlMetrics,
} from '@/types/etl'
import { CleaningEnginePanel } from './components/CleaningEnginePanel'
import { EtlStageCard } from './components/EtlStageCard'
import { ETLRunCard } from './components/ETLRunCard'
import { ExecutionHistoryTable } from './components/ExecutionHistoryTable'
import { LineageCard } from './components/LineageCard'
import { PipelineMetricCard } from './components/PipelineMetricCard'
import { PipelineStatusPanel, StageIcon } from './components/PipelineStatusPanel'
import { QualityScoreCard } from './components/QualityScoreCard'
import { WarehouseCard } from './components/WarehouseCard'
import { WarehouseSummaryCard } from './components/WarehouseSummaryCard'

export function EtlPipelineStudio() {
  const [overview, setOverview] = useState<EtlOverview | null>(null)
  const [qualityScore, setQualityScore] = useState<QualityScore | null>(null)
  const [warehouseSummary, setWarehouseSummary] = useState<WarehouseSummary | null>(null)
  const [lineage, setLineage] = useState<LineageData | null>(null)
  const [executions, setExecutions] = useState<ExecutionRecord[]>([])
  const [lastRun, setLastRun] = useState<EtlRunResult | null>(null)
  const [lastMetrics, setLastMetrics] = useState<EtlMetrics | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)

  const loadDashboardData = useCallback(async () => {
    const [overviewData, quality, summary, lineageData, history] = await Promise.all([
      getEtlOverview(),
      getQualityDashboard(),
      getWarehouseSummary(),
      getSampleLineage(),
      getExecutionHistory(),
    ])
    setOverview(overviewData)
    setQualityScore(quality)
    setWarehouseSummary(summary)
    setLineage(lineageData)
    setExecutions(history.executions)
  }, [])

  useEffect(() => {
    loadDashboardData()
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load ETL dashboard')
      })
      .finally(() => setLoading(false))
  }, [loadDashboardData])

  const handleRunPipeline = async () => {
    setRunning(true)
    try {
      const result = await runEtlSample()
      setLastRun(result)
      if (result.metrics) setLastMetrics(result.metrics)
      if (result.quality_score) setQualityScore(result.quality_score)
      if (result.warehouse_summary) setWarehouseSummary(result.warehouse_summary)
      if (result.lineage) setLineage(result.lineage)
      const history = await getExecutionHistory()
      setExecutions(history.executions)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Pipeline run failed')
    } finally {
      setRunning(false)
    }
  }

  const cleaningStages = overview?.cleaning_stages ?? CLEANING_UI_STAGES.map((s, i) => ({
    ...s,
    status: 'engine_ready',
    order: i + 1,
  }))

  const pipelineFlow = overview?.pipeline_flow ?? FINAL_ETL_FLOW

  return (
    <div className="space-y-8">
      <PageHeader
        title="ETL Pipeline Studio"
        description="Enterprise analytics warehouse — profile, validate, clean, transform, load, and score retail datasets with full lineage and quality tracking."
        badge={{ status: 'completed', label: 'Phase 4 Complete' }}
      />

      <Breadcrumb items={[{ label: 'ETL Pipeline Studio' }]} />

      {error && (
        <ErrorState title="ETL service unavailable" message={error} onRetry={() => window.location.reload()} />
      )}

      {loading ? (
        <TableSkeleton rows={4} />
      ) : overview ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <MetricCard label="Pipeline stages" value={String(pipelineFlow.length)} />
            <MetricCard label="Warehouse tables" value={String(overview.warehouse_tables?.length ?? 7)} />
            <MetricCard label="Quality dimensions" value="6" />
            <MetricCard label="Sprint" value={overview.sprint} />
          </div>

          <SectionContainer
            title="Enterprise ETL Flow"
            description="Complete Phase 4 pipeline — synthetic data through analytics warehouse"
          >
            <div className="flex flex-wrap items-center justify-center gap-1 py-3 text-xs font-medium text-muted-foreground">
              {pipelineFlow.map((stage, i) => (
                <span key={stage} className="flex items-center gap-1">
                  <span className="rounded-md bg-muted px-2 py-1">{stage}</span>
                  {i < pipelineFlow.length - 1 && <span className="text-primary">↓</span>}
                </span>
              ))}
            </div>
          </SectionContainer>

          <SectionContainer
            title="Enterprise Dashboard"
            description="Quality metrics, warehouse summary, lineage, execution history, and pipeline metrics"
          >
            <div className="grid gap-5 lg:grid-cols-2">
              <ETLRunCard lastRun={lastRun} running={running} onRun={handleRunPipeline} />
              <QualityScoreCard score={qualityScore} />
              <WarehouseSummaryCard summary={warehouseSummary} />
              <PipelineMetricCard metrics={lastMetrics} />
              <WarehouseCard overview={overview} />
              <LineageCard lineage={lineage} />
            </div>
          </SectionContainer>

          <SectionContainer title="Execution History" description="Recent pipeline runs with quality scores and timing">
            <ExecutionHistoryTable executions={executions} />
          </SectionContainer>

          <SectionContainer
            title="Data Cleaning & Transformation Engine"
            description="Sprint 4.2 production pipeline — every stage generates metadata and execution statistics"
          >
            <CleaningEnginePanel
              status={overview.status}
              sprint={overview.sprint}
              flow={overview.cleaning_flow ?? CLEANING_ENGINE_FLOW}
            />
          </SectionContainer>

          <SectionContainer
            title="Cleaning Engine Stages"
            description="Profiling, missing values, duplicates, standardization, transformation, validation, quality scoring, and audit logging"
          >
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {cleaningStages.map((stage) => (
                <EtlStageCard
                  key={stage.id}
                  title={stage.title}
                  description={stage.description}
                  order={stage.order}
                  status={stage.status}
                  icon={<StageIcon id={stage.id} />}
                  sprintLabel="4.2"
                />
              ))}
            </div>
          </SectionContainer>

          <SectionContainer
            title="ETL Foundation (Sprint 4.1)"
            description="Original extract-load pipeline stages — preserved for backward compatibility"
          >
            <PipelineStatusPanel
              status={overview.status}
              sprint={overview.sprint}
              sources={overview.supported_sources}
              targets={overview.supported_load_targets}
            />
            <div className="mt-5 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {overview.stages.map((stage) => (
                <EtlStageCard
                  key={stage.id}
                  title={stage.title}
                  description={stage.description}
                  order={stage.order}
                  status={stage.status}
                  icon={<StageIcon id={stage.id} />}
                  sprintLabel="4.1"
                />
              ))}
            </div>
          </SectionContainer>
        </>
      ) : null}
    </div>
  )
}
