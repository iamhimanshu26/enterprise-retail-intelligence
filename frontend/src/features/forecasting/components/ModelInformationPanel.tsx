import { SectionContainer } from '@/components/design-system'
import type { ForecastingOverview } from '@/types/forecasting'

const MODEL_DESCRIPTIONS: Record<string, string> = {
  moving_average: 'Rolling mean baseline for stable weekly sales and product demand.',
  linear_regression: 'Trend extrapolation for monthly revenue and category demand.',
  seasonal_naive: 'Prior seasonal period anchor for quarterly revenue cycles.',
  exponential_smoothing: 'Recency-weighted smoothing for daily revenue and sales volume.',
}

interface ModelInformationPanelProps {
  overview: ForecastingOverview
  loading?: boolean
}

export function ModelInformationPanel({ overview, loading }: ModelInformationPanelProps) {
  return (
    <SectionContainer
      title="Model Information"
      description="Active forecasting models in the Phase 7 engine — explainable baselines without black-box ensembles."
    >
      {loading ? (
        <div className="h-32 animate-pulse rounded-xl bg-muted" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {overview.supported_models.map((model) => (
            <article key={model} className="rounded-xl border border-border/80 bg-card p-4 shadow-sm">
              <h3 className="text-sm font-semibold text-foreground capitalize">
                {model.replace(/_/g, ' ')}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {MODEL_DESCRIPTIONS[model] ?? 'Enterprise baseline forecasting model.'}
              </p>
            </article>
          ))}
          <article className="rounded-xl border border-border/80 bg-muted/20 p-4">
            <h3 className="text-sm font-semibold text-foreground">Data modules</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              {overview.modules.join(' · ')} · source: {overview.data_source}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Sprint {overview.sprint} · {overview.status.replace(/_/g, ' ')}
            </p>
          </article>
        </div>
      )}
    </SectionContainer>
  )
}
