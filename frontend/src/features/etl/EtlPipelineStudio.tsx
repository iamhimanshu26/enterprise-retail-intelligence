import { useEffect, useState } from 'react'
import {
  Breadcrumb,
  ErrorState,
  PageHeader,
  SectionContainer,
  TableSkeleton,
} from '@/components/design-system'
import { getEtlOverview } from '@/lib/dataServiceApi'
import type { EtlOverview } from '@/types/etl'
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

  return (
    <div className="space-y-8">
      <PageHeader
        title="ETL Pipeline Studio"
        description="Enterprise extract, validate, clean, transform, normalize, aggregate, and load framework for retail intelligence pipelines."
        badge={{ status: 'in-progress', label: 'Sprint 4.1' }}
      />

      <Breadcrumb items={[{ label: 'ETL Pipeline Studio' }]} />

      {error && (
        <ErrorState title="ETL service unavailable" message={error} onRetry={() => window.location.reload()} />
      )}

      {loading ? (
        <TableSkeleton rows={4} />
      ) : overview ? (
        <>
          <PipelineMetrics />

          <SectionContainer
            title="Pipeline Architecture"
            description="Modular stages designed for independent reuse across analytics, statistics, and forecasting"
          >
            <PipelineStatusPanel
              status={overview.status}
              sprint={overview.sprint}
              sources={overview.supported_sources}
              targets={overview.supported_load_targets}
            />
          </SectionContainer>

          <SectionContainer
            title="Pipeline Stages"
            description="Each stage is independently implemented in the Python ETL module — execution UI expands in future sprints"
          >
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {overview.stages.map((stage) => (
                <EtlStageCard
                  key={stage.id}
                  title={stage.title}
                  description={stage.description}
                  order={stage.order}
                  status={stage.status}
                  icon={<StageIcon id={stage.id} />}
                />
              ))}
            </div>
          </SectionContainer>

          <SectionContainer
            title="Data Flow"
            description="Synthetic generator exports feed the ETL pipeline in Phase 4"
          >
            <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 p-6 text-center text-sm text-muted-foreground">
              Synthetic Data → Upload/API → Validate → Clean → Transform → Normalize → Aggregate → Load → Analytics Layer → Success Report
            </div>
          </SectionContainer>
        </>
      ) : null}
    </div>
  )
}
