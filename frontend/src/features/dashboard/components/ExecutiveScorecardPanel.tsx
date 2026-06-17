import { SectionContainer } from '@/components/design-system'
import type { ExecutiveScorecard } from '@/types/intelligence'

export function ExecutiveScorecardPanel({ scorecard }: { scorecard: ExecutiveScorecard }) {
  return (
    <SectionContainer
      title="Executive Scorecard"
      description={`Overall: ${scorecard.overall_score.toFixed(0)} / 100 — ${scorecard.overall_status}`}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {scorecard.dimensions.map((dim) => (
          <div key={dim.name} className="rounded-xl border border-border/80 bg-card p-4 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">{dim.name}</p>
            <p className="mt-2 text-xl font-semibold">{dim.score.toFixed(1)}</p>
            <p className="mt-1 text-xs font-medium text-primary">{dim.status}</p>
            <p className="mt-2 text-xs text-muted-foreground">{dim.explanation}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-muted-foreground">{scorecard.methodology}</p>
    </SectionContainer>
  )
}
