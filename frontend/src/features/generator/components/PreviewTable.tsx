import { DataTable } from '@/components/design-system'
import type { PreviewData } from '@/types/generator'
import { GeneratorCard } from './GeneratorCard'

interface PreviewTableProps {
  preview: PreviewData | null
  entities: string[]
  selectedEntity: string
  onEntityChange: (entity: string) => void
}

export function PreviewTable({ preview, entities, selectedEntity, onEntityChange }: PreviewTableProps) {
  const columns =
    preview?.columns.map((col) => ({
      key: col,
      header: col.replace(/_/g, ' '),
    })) ?? []

  const rows = (preview?.rows ?? []) as Record<string, unknown>[]

  return (
    <GeneratorCard
      title="Data Preview"
      description="Sample rows before export"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {entities.map((entity) => (
            <button
              key={entity}
              type="button"
              onClick={() => onEntityChange(entity)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                selectedEntity === entity
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {entity.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
        {preview && (
          <p className="text-xs text-muted-foreground">
            Showing {rows.length} of {preview.row_count.toLocaleString()} rows
          </p>
        )}
        <DataTable columns={columns} data={rows} emptyMessage="Generate a dataset to preview sample rows" />
      </div>
    </GeneratorCard>
  )
}
