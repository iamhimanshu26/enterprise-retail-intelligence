import { useState } from 'react'
import { ArrowDown } from 'lucide-react'
import { SectionContainer } from '@/components/design-system'
import type { LineageNode } from '@/types/monitoring'

interface LineageVisualizationProps {
  nodes: LineageNode[]
  loading?: boolean
}

export function LineageVisualization({ nodes, loading }: LineageVisualizationProps) {
  const [selected, setSelected] = useState<LineageNode | null>(nodes[0] ?? null)

  return (
    <SectionContainer
      title="Data Lineage Visualization"
      description="Platform data flow from synthetic generation through forecasting."
    >
      {loading ? (
        <div className="h-32 animate-pulse rounded-xl bg-muted" />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-2">
            {nodes.map((node, index) => (
              <button
                key={node.id}
                type="button"
                onClick={() => setSelected(node)}
                className={`w-full rounded-xl border p-4 text-left transition-all ${
                  selected?.id === node.id
                    ? 'border-primary bg-primary/5 shadow-sm'
                    : 'border-border/80 bg-card hover:border-primary/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{node.label}</p>
                    <p className="text-xs text-muted-foreground">{node.description}</p>
                  </div>
                </div>
                {index < nodes.length - 1 && (
                  <ArrowDown className="mx-auto mt-2 h-4 w-4 text-muted-foreground/60" aria-hidden="true" />
                )}
              </button>
            ))}
          </div>
          <div className="rounded-xl border border-border/80 bg-muted/20 p-6">
            <h3 className="text-sm font-semibold text-foreground">Node Details</h3>
            {selected ? (
              <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                <p><span className="font-medium text-foreground">Stage:</span> {selected.label}</p>
                <p><span className="font-medium text-foreground">ID:</span> {selected.id}</p>
                <p>{selected.description}</p>
                <p className="text-xs">Select a node to inspect lineage metadata and downstream dependencies.</p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">Select a lineage node to view details.</p>
            )}
          </div>
        </div>
      )}
    </SectionContainer>
  )
}
