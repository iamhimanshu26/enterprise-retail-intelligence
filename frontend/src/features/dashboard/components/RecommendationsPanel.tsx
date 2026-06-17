import { SectionContainer } from '@/components/design-system'
import type { RecommendationItem } from '@/types/intelligence'

const PRIORITY_STYLES: Record<string, string> = {
  high: 'border-destructive/30 bg-destructive/5',
  critical: 'border-destructive/30 bg-destructive/5',
  medium: 'border-warning/30 bg-warning/5',
  warning: 'border-warning/30 bg-warning/5',
  low: 'border-border/80 bg-card',
}

export function RecommendationsPanel({ recommendations }: { recommendations: RecommendationItem[] }) {
  return (
    <SectionContainer title="Business Recommendations" description="Rule-based executive actions.">
      <div className="space-y-3">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className={`rounded-xl border p-4 shadow-sm ${PRIORITY_STYLES[rec.priority] ?? PRIORITY_STYLES.low}`}
          >
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold">{rec.title}</p>
              <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase">
                {rec.priority}
              </span>
              <span className="text-xs text-muted-foreground">{rec.area}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{rec.description}</p>
            <p className="mt-2 text-sm font-medium text-primary">Recommendation: {rec.action}</p>
          </div>
        ))}
      </div>
    </SectionContainer>
  )
}
