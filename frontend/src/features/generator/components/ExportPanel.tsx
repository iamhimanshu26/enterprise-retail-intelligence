import { Download } from 'lucide-react'
import { getExportUrl } from '@/lib/dataServiceApi'
import type { ExportFormat } from '@/types/generator'
import { addGenerationHistory } from '@/lib/generatorHistory'
import { GeneratorCard } from './GeneratorCard'

const EXPORT_FORMATS: { format: ExportFormat; label: string; available: boolean }[] = [
  { format: 'csv', label: 'CSV', available: true },
  { format: 'json', label: 'JSON', available: true },
  { format: 'xlsx', label: 'Excel (XLSX)', available: true },
  { format: 'parquet', label: 'Parquet', available: false },
]

interface ExportPanelProps {
  jobId: string
  datasetName: string
  entities: string[]
  selectedEntity: string
  onEntityChange: (entity: string) => void
  recordCount: number
  durationSeconds: number
}

export function ExportPanel({
  jobId,
  datasetName,
  entities,
  selectedEntity,
  onEntityChange,
  recordCount,
  durationSeconds,
}: ExportPanelProps) {
  const handleDownload = (format: ExportFormat) => {
    if (format === 'parquet') return
    const url = getExportUrl(jobId, selectedEntity, format)
    const link = document.createElement('a')
    link.href = url
    link.download = `${datasetName}_${selectedEntity}.${format === 'xlsx' ? 'xlsx' : format}`
    link.click()

    addGenerationHistory({
      id: `${jobId}-${format}`,
      job_id: jobId,
      dataset_name: datasetName,
      timestamp: new Date().toISOString(),
      record_count: recordCount,
      export_format: format,
      duration_seconds: durationSeconds,
    })
  }

  return (
    <GeneratorCard
      title="Download Dataset"
      description="Export generated data locally in multiple formats"
      icon={<Download className="h-5 w-5" />}
    >
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-muted-foreground">Entity</label>
          <select
            value={selectedEntity}
            onChange={(e) => onEntityChange(e.target.value)}
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            {entities.map((entity) => (
              <option key={entity} value={entity}>{entity.replace(/_/g, ' ')}</option>
            ))}
            <option value="all">All entities (combined)</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {EXPORT_FORMATS.map(({ format, label, available }) => (
            <button
              key={format}
              type="button"
              disabled={!available}
              onClick={() => handleDownload(format)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                available
                  ? 'border-border hover:border-primary hover:bg-primary/5'
                  : 'border-border/50 text-muted-foreground opacity-60 cursor-not-allowed'
              }`}
            >
              {label}
              {!available && <span className="block text-[10px]">Phase 4</span>}
            </button>
          ))}
        </div>
      </div>
    </GeneratorCard>
  )
}
