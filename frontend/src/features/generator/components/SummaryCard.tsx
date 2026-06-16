import { BarChart3 } from 'lucide-react'
import { GeneratorCard } from './GeneratorCard'

interface SummaryCardProps {
  regionBreakdown: Record<string, number>
  durationSeconds: number
  seed: number
}

export function SummaryCard({ regionBreakdown, durationSeconds, seed }: SummaryCardProps) {
  const maxCount = Math.max(...Object.values(regionBreakdown), 1)

  return (
    <GeneratorCard
      title="Generation Statistics"
      description="Regional distribution and simulation metadata"
      icon={<BarChart3 className="h-5 w-5" />}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Duration</p>
            <p className="font-medium">{durationSeconds.toFixed(2)}s</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Seed</p>
            <p className="font-medium">{seed}</p>
          </div>
        </div>
        {Object.keys(regionBreakdown).length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Store regional distribution
            </p>
            {Object.entries(regionBreakdown).map(([region, count]) => (
              <div key={region} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>{region}</span>
                  <span className="text-muted-foreground">{count}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary/70"
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </GeneratorCard>
  )
}
