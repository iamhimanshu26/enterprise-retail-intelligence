import { useEffect, useState } from 'react'
import {
  Breadcrumb,
  ErrorState,
  PageHeader,
  SectionContainer,
  TableSkeleton,
} from '@/components/design-system'
import { getEtlOverview } from '@/lib/dataServiceApi'
import { CLEANING_ENGINE_FLOW, CLEANING_UI_STAGES, type EtlOverview } from '@/types/etl'
import { CleaningEnginePanel } from './components/CleaningEnginePanel'
import { EtlStageCard } from './components/EtlStageCard'
import { PipelineMetrics, PipelineStatusPanel, StageIcon } from './components/PipelineStatusPanel'

export function EtlPipelineStudio() {
  const [overview, setOverview] = useState<EtlOverview | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getEtlOverview()
      .then(setOverview)
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Failed to load ETL overview')
      })
      .finally(() => setLoading(false))
  }, [])

  const cleaningStages = overview?.cleaning_stages ?? CLEANING_UI_STAGES.map((s, i) => ({
    ...s,
    status: 'engine_ready',
    order: i + 1,
  }))

  return (
    <div className="space-y-8">
      <PageHeader
        title="ETL Pipeline Studio"
        description="Enterprise data cleaning and transformation engine — profile, validate, clean, standardize, transform, and score retail datasets."
        badge={{ status: 'in-progress', label: 'Sprint 4.2' }}
      />

      <Breadcrumb items={[{ label: 'ETL Pipeline Studio' }]} />

      {error && (
        <ErrorState title="ETL service unavailable" message={error} onRetry={() => window.location.reload()} />
      )}

      {loading ? (
        <TableSkeleton rows={4} />
      ) : overview ? (
        <>
          <PipelineMetrics sprint={overview.sprint} />

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
