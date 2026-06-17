import { SectionContainer, StatusBadge } from '@/components/design-system'
import type { RecommendationImpact } from './executiveStudioAdapters'

const PRIORITY_STATUS: Record<string, 'completed' | 'in-progress' | 'planned'> = {
  high: 'planned',
  medium: 'in-progress',
  low: 'completed',
}

interface RecommendationImpactSectionProps {
  recommendations: RecommendationImpact[]
}

export function RecommendationImpactSection({ recommendations }: RecommendationImpactSectionProps) {
  return (
    <SectionContainer
      title="Recommendation Impact"
      description="Rule-based recommendation categories with priority, expected impact, and affected metrics."
    >
      {recommendations.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          No recommendations in the current intelligence sample.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {recommendations.map((rec) => (
            <article
              key={rec.id}
              className="rounded-xl border border-border/80 bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground capitalize">
                    {rec.category}
                  </p>
                  <h3 className="mt-1 text-sm font-semibold text-foreground">{rec.title}</h3>
                </div>
                <StatusBadge status={PRIORITY_STATUS[rec.priority] ?? 'in-progress'} label={rec.priority} />
              </div>
              <dl className="mt-3 grid gap-2 text-xs">
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Expected impact</dt>
                  <dd className="font-medium">{rec.expectedImpact}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Affected metric</dt>
                  <dd className="font-medium">{rec.affectedMetric}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">Status</dt>
                  <dd className="font-medium capitalize">{rec.status}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}
    </SectionContainer>
  )
}
