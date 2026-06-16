import { Play, Sparkles } from 'lucide-react'
import {
  ActionToolbar,
  Breadcrumb,
  ErrorState,
  PageHeader,
  SectionContainer,
  TableSkeleton,
} from '@/components/design-system'
import { useGenerator } from '@/hooks/useGenerator'
import { ConfigurationPanel } from './components/ConfigurationPanel'
import { DatasetCard } from './components/DatasetCard'
import { ExportPanel } from './components/ExportPanel'
import { GenerationHistoryPanel } from './components/GenerationHistoryPanel'
import { PreviewTable } from './components/PreviewTable'
import { ProgressCard } from './components/ProgressCard'
import { SummaryCard } from './components/SummaryCard'

export function SyntheticDataGenerator() {
  const {
    defaults,
    config,
    job,
    preview,
    previewEntity,
    loadingDefaults,
    error,
    inventoryEstimate,
    runGeneration,
    loadPreview,
    updateConfig,
    setPreviewEntity,
  } = useGenerator()

  const isRunning = job?.status === 'running' || job?.status === 'pending'
  const isComplete = job?.status === 'completed'
  const entities = defaults?.entities ?? []

  const handleEntityChange = (entity: string) => {
    setPreviewEntity(entity)
    loadPreview(entity)
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Synthetic Retail Data Generator"
        description="Generate realistic enterprise retail datasets with configurable business rules, regional distribution, and data quality simulation for ETL, analytics, and forecasting pipelines."
        badge={{ status: 'completed', label: 'Phase 3 Complete' }}
      />

      <Breadcrumb items={[{ label: 'Synthetic Data Generator' }]} />

      {error && (
        <ErrorState
          title="Generator error"
          message={error}
          onRetry={() => window.location.reload()}
        />
      )}

      <ActionToolbar>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          Configure volumes and simulation rules, then generate in the background
        </div>
        <button
          type="button"
          disabled={!config || isRunning || loadingDefaults}
          onClick={() => runGeneration()}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          <Play className="h-4 w-4" />
          {isRunning ? 'Generating…' : 'Generate Dataset'}
        </button>
      </ActionToolbar>

      {loadingDefaults ? (
        <TableSkeleton rows={6} />
      ) : config ? (
        <div className="grid gap-6 lg:grid-cols-2">
          <ConfigurationPanel
            config={config}
            inventoryEstimate={inventoryEstimate}
            onChange={(c) => updateConfig(c)}
          />

          <div className="space-y-6">
            {job && (
              <ProgressCard
                progress={job.progress}
                currentStep={job.current_step}
                elapsedSeconds={job.elapsed_seconds}
                estimatedRemainingSeconds={job.estimated_remaining_seconds}
                status={job.status}
              />
            )}

            {isComplete && job.summary && (
              <>
                <DatasetCard
                  entityCounts={job.summary.entity_counts}
                  totalRecords={job.summary.total_records}
                  estimatedSizeMb={job.summary.estimated_size_mb}
                />
                <SummaryCard
                  regionBreakdown={job.summary.region_breakdown}
                  durationSeconds={job.summary.generation_duration_seconds}
                  seed={job.summary.seed}
                />
              </>
            )}
          </div>
        </div>
      ) : null}

      {isComplete && job && job.summary && (
        <SectionContainer title="Preview & Export" description="Review sample rows and download datasets locally">
          <div className="grid gap-6 lg:grid-cols-2">
            <PreviewTable
              preview={preview}
              entities={entities}
              selectedEntity={previewEntity}
              onEntityChange={handleEntityChange}
            />
            <ExportPanel
              jobId={job.job_id}
              datasetName={job.dataset_name}
              entities={entities}
              selectedEntity={previewEntity}
              onEntityChange={handleEntityChange}
              recordCount={job.summary.total_records}
              durationSeconds={job.summary.generation_duration_seconds}
            />
          </div>
        </SectionContainer>
      )}

      <SectionContainer title="History" description="Recent generation runs stored locally in the browser">
        <GenerationHistoryPanel />
      </SectionContainer>
    </div>
  )
}
