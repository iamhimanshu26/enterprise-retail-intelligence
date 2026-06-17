import { MetricCard, SectionContainer } from '@/components/design-system'
import type { BusinessHealthCenter } from '@/types/intelligence'

export function BusinessHealthCenterCard({ health }: { health: BusinessHealthCenter }) {
  return (
    <SectionContainer
      title="Business Health Center"
      description="Executive overview — strongest area, weakest area, risk, and opportunity."
    >
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/10 to-card p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Overall Business Health</p>
          <p className="mt-2 text-4xl font-semibold tracking-tight">
            {health.overall_score.toFixed(0)}
            <span className="text-lg text-muted-foreground"> / 100</span>
          </p>
          <p className="mt-2 text-sm font-semibold text-primary">{health.overall_status}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
          <MetricCard label="Strongest Area" value={health.strongest_area} />
          <MetricCard label="Weakest Area" value={health.weakest_area} />
          <MetricCard label="Highest Risk" value={health.highest_risk} />
          <MetricCard label="Biggest Opportunity" value={health.biggest_opportunity} />
        </div>
      </div>
    </SectionContainer>
  )
}
