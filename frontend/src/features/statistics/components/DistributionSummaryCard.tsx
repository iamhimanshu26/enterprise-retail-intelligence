import { GeneratorCard } from '@/features/generator/components/GeneratorCard'
import type { DistributionSummary } from '@/types/statistics'

interface DistributionSummaryCardProps {
  distribution: DistributionSummary
}

export function DistributionSummaryCard({ distribution }: DistributionSummaryCardProps) {
  return (
    <div className="rounded-lg border border-border/60 bg-card p-4">
      <p className="text-sm font-medium capitalize">{distribution.name.replace(/_/g, ' ')}</p>
      <div className="mt-3 space-y-2">
        {distribution.buckets.slice(0, 6).map((b) => (
          <div key={b.label} className="flex items-center justify-between text-xs">
            <span className="truncate text-muted-foreground">{b.label}</span>
            <span className="font-medium tabular-nums">{b.percentage.toFixed(1)}%</span>
          </div>
        ))}
      </div>
    </div>
  )
}

interface DistributionSummaryPanelProps {
  distributions: DistributionSummary[]
}

export function DistributionSummaryPanel({ distributions }: DistributionSummaryPanelProps) {
  return (
    <GeneratorCard title="Distribution Metrics" description="Chart-ready distribution summaries">
      <div className="grid gap-4 md:grid-cols-2">
        {distributions.slice(0, 6).map((d) => (
          <DistributionSummaryCard key={d.name} distribution={d} />
        ))}
      </div>
    </GeneratorCard>
  )
}
