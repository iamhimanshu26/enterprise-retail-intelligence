import { ArrowDown } from 'lucide-react'
import { SectionContainer } from '@/components/design-system'

const METHODOLOGY_ITEMS = [
  {
    title: 'Moving Average',
    formula: 'F_t = (Y_{t-1} + Y_{t-2} + … + Y_{t-n}) / n',
    description:
      'Smooths short-term noise using rolling windows — baseline for stable demand and weekly sales patterns.',
  },
  {
    title: 'Linear Regression',
    formula: 'Y = β₀ + β₁X + ε',
    description:
      'Fits a trend line to monthly revenue and category demand — explainable slope for growth outlook.',
  },
  {
    title: 'Exponential Smoothing',
    formula: 'S_t = α·Y_t + (1-α)·S_{t-1}',
    description:
      'Weights recent observations more heavily — responsive daily revenue and sales volume forecasts.',
  },
  {
    title: 'Seasonal Naive Baseline',
    formula: 'F_t = Y_{t-m} (seasonal period m)',
    description:
      'Uses prior seasonal periods as forecast anchors — strong baseline for quarterly revenue cycles.',
  },
  {
    title: 'Feature Engineering',
    formula: 'X = [date_features, region, category, promotion_flag, aggregates]',
    description:
      'Date features, promotion flags, region/category dummies, and warehouse-derived aggregates feed models.',
  },
  {
    title: 'Lag Features',
    formula: 'lag_k = Y_{t-k}',
    description:
      'Prior-period lags capture momentum and autocorrelation without black-box complexity.',
  },
  {
    title: 'Rolling Average',
    formula: 'roll_n = mean(Y_{t-n+1}…Y_t)',
    description:
      'Rolling means stabilize volatile series before model fitting and scenario planning.',
  },
  {
    title: 'Scenario Planning',
    formula: 'Adjusted = Base × (1 + scenario_band + control_delta)',
    description:
      'Optimistic, expected, and pessimistic branches adjust base forecasts for executive what-if analysis.',
  },
]

export function ForecastMethodologyPanel() {
  return (
    <SectionContainer
      title="Forecast Methodology"
      description="Formulas and business explanations for interview-ready predictive analytics."
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
                <p className="mt-1 font-mono text-xs text-primary">{item.formula}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
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
