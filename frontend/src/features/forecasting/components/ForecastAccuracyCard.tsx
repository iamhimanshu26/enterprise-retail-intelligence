import { MetricCard, SectionContainer } from '@/components/design-system'
import type { AccuracyMetrics } from '@/types/forecasting'
import {
  ACCURACY_METHODOLOGY,
  formatAccuracyMetric,
} from '../adapters/forecastingAdapter'

interface ForecastAccuracyCardProps {
  metric: AccuracyMetrics
}

function MetricTooltip({ label, description }: { label: string; description: string }) {
  return (
    <span className="group relative">
      <span className="cursor-help underline decoration-dotted underline-offset-2">{label}</span>
      <span
        className="pointer-events-none absolute bottom-full left-0 z-10 mb-2 hidden w-48 rounded-md border border-border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md group-hover:block"
        role="tooltip"
      >
        {description}
      </span>
    </span>
  )
}

export function ForecastAccuracyCard({ metric }: ForecastAccuracyCardProps) {
  const methodology = ACCURACY_METHODOLOGY.find((m) => m.name === 'MAE')

  return (
    <article className="rounded-xl border border-border/80 bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-foreground capitalize">
            {metric.metric_name.replace(/_/g, ' ')}
          </h3>
          <p className="text-xs text-muted-foreground">Model: {metric.model_name.replace(/_/g, ' ')}</p>
        </div>
        <MetricCard
          label="Accuracy Score"
          value={formatAccuracyMetric(metric, 'accuracy_score')}
          trend="up"
          className="border-0 p-0 shadow-none"
        />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
          <p className="text-xs text-muted-foreground">
            <MetricTooltip label="MAE" description={methodology?.description ?? ''} />
          </p>
          <p className="text-sm font-semibold">{formatAccuracyMetric(metric, 'mae')}</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
          <p className="text-xs text-muted-foreground">
            <MetricTooltip
              label="RMSE"
              description={ACCURACY_METHODOLOGY.find((m) => m.name === 'RMSE')?.description ?? ''}
            />
          </p>
          <p className="text-sm font-semibold">{formatAccuracyMetric(metric, 'rmse')}</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
          <p className="text-xs text-muted-foreground">
            <MetricTooltip
              label="MAPE"
              description={ACCURACY_METHODOLOGY.find((m) => m.name === 'MAPE')?.description ?? ''}
            />
          </p>
          <p className="text-sm font-semibold">{formatAccuracyMetric(metric, 'mape')}</p>
        </div>
        <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
          <p className="text-xs text-muted-foreground">
            <MetricTooltip
              label="Bias"
              description={ACCURACY_METHODOLOGY.find((m) => m.name === 'Bias')?.description ?? ''}
            />
          </p>
          <p className="text-sm font-semibold">{formatAccuracyMetric(metric, 'bias')}</p>
        </div>
      </div>
    </article>
  )
}

interface ForecastAccuracyDashboardProps {
  metrics: AccuracyMetrics[]
  overallScore: number
  loading?: boolean
}

export function ForecastAccuracyDashboard({
  metrics,
  overallScore,
  loading,
}: ForecastAccuracyDashboardProps) {
  return (
    <SectionContainer
      title="Forecast Accuracy Dashboard"
      description="Backtest accuracy metrics with methodology tooltips for MAE, RMSE, MAPE, and bias."
    >
      {loading ? (
        <div className="h-32 animate-pulse rounded-xl bg-muted" />
      ) : (
        <>
          <MetricCard
            label="Overall Accuracy Score"
            value={`${overallScore.toFixed(1)}%`}
            trend="up"
            change="Holdout validation"
            className="mb-4"
          />
          <div className="grid gap-4 lg:grid-cols-2">
            {metrics.map((metric) => (
              <ForecastAccuracyCard key={`${metric.metric_name}-${metric.model_name}`} metric={metric} />
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            MAE measures average absolute error. RMSE penalizes larger errors. MAPE shows percentage error.
            Bias shows over/under prediction tendency.
          </p>
        </>
      )}
    </SectionContainer>
  )
}
