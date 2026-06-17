import { GitBranch } from 'lucide-react'
import { GeneratorCard } from '@/features/generator/components/GeneratorCard'
import type { LineageData } from '@/types/etl'

interface LineageCardProps {
  lineage: LineageData | null
}

export function LineageCard({ lineage }: LineageCardProps) {
  const flow = lineage?.flow ?? [
    'sales.csv', 'validation', 'cleaning', 'normalization',
    'transformation', 'aggregation', 'fact_sales',
  ]

  return (
    <GeneratorCard
      title="Data Lineage"
      description="Dataset movement through the ETL pipeline"
      icon={<GitBranch className="h-5 w-5" />}
    >
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-1 py-2 text-xs font-medium text-muted-foreground">
          {flow.slice(0, 8).map((step, i) => (
            <span key={`${step}-${i}`} className="flex items-center gap-1">
              <span className="rounded-md bg-muted px-2 py-1">{step}</span>
              {i < Math.min(flow.length, 8) - 1 && <span className="text-primary">↓</span>}
            </span>
          ))}
        </div>
        {lineage && (
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-muted/30 px-3 py-2">
              <p className="text-muted-foreground">Nodes</p>
              <p className="font-semibold">{lineage.nodes.length}</p>
            </div>
            <div className="rounded-lg bg-muted/30 px-3 py-2">
              <p className="text-muted-foreground">Edges</p>
              <p className="font-semibold">{lineage.edges.length}</p>
            </div>
          </div>
        )}
        <p className="text-xs text-muted-foreground">
          Interactive lineage graph — available in Phase 6 visualization platform.
        </p>
      </div>
    </GeneratorCard>
  )
}
