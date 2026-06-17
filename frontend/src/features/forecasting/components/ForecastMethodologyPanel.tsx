import { ArrowDown } from 'lucide-react'
import { SectionContainer } from '@/components/design-system'

const METHODOLOGY_ITEMS = [
  {
    title: 'Moving Average',
    description:
      'Smooths short-term noise using rolling windows — baseline for stable demand and weekly sales patterns.',
  },
  {
    title: 'Linear Regression',
    description:
      'Fits a trend line to monthly revenue and category demand — explainable slope for growth outlook.',
  },
  {
    title: 'Seasonal Naive Baseline',
    description:
      'Uses prior seasonal periods as forecast anchors — strong baseline for quarterly revenue cycles.',
  },
  {
    title: 'Exponential Smoothing',
    description:
      'Weights recent observations more heavily — responsive daily revenue and sales volume forecasts.',
  },
  {
    title: 'Feature Engineering',
    description:
      'Date features, promotion flags, region/category dummies, and warehouse-derived aggregates feed models.',
  },
  {
    title: 'Lag Features & Rolling Averages',
    description:
      'Prior-period lags and rolling means capture momentum without black-box complexity.',
  },
  {
    title: 'Scenario Planning',
    description:
      'Optimistic, realistic, and pessimistic branches adjust base forecasts for executive what-if analysis.',
  },
]

export function ForecastMethodologyPanel() {
  return (
    <SectionContainer
      title="Forecast Methodology"
      description="Explainable model strategy for interviews and executive trust — no black-box ensembles in Phase 7."
    >
      <div className="space-y-3">
        {METHODOLOGY_ITEMS.map((item, index) => (
          <div key={item.title} className="relative rounded-xl border border-border/80 bg-card p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                {index + 1}
              </span>
              <div>
                <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </div>
            </div>
            {index < METHODOLOGY_ITEMS.length - 1 && (
              <ArrowDown
                className="absolute -bottom-3 left-6 h-4 w-4 text-muted-foreground/60"
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>
    </SectionContainer>
  )
}
