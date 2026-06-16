import { Database } from 'lucide-react'
import { ENTITY_LABELS } from '@/types/generator'
import { GeneratorCard } from './GeneratorCard'

interface DatasetCardProps {
  entityCounts: Record<string, number>
  totalRecords: number
  estimatedSizeMb: number
}

export function DatasetCard({ entityCounts, totalRecords, estimatedSizeMb }: DatasetCardProps) {
  return (
    <GeneratorCard
      title="Dataset Summary"
      description="Record counts and size estimates per entity"
      icon={<Database className="h-5 w-5" />}
    >
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
            <p className="text-xs text-muted-foreground">Total records</p>
            <p className="text-lg font-semibold">{totalRecords.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
            <p className="text-xs text-muted-foreground">Est. size</p>
            <p className="text-lg font-semibold">{estimatedSizeMb.toFixed(2)} MB</p>
          </div>
        </div>
        <div className="space-y-1.5">
          {Object.entries(entityCounts).map(([entity, count]) => (
            <div key={entity} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{ENTITY_LABELS[entity] ?? entity}</span>
              <span className="font-medium tabular-nums">{count.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </GeneratorCard>
  )
}
