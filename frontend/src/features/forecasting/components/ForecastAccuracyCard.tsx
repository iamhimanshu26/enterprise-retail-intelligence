import { MetricCard, SectionContainer } from '@/components/design-system'
import { cn } from '@/lib/cn'
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
        className="pointer-events-none absolute bottom-full left-0 z-10 mb-2 hidden w-52 rounded-md border border-border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md group-hover:block"
        role="tooltip"
      >
        {description}
      </span>
    </span>
  )
}

function AccuracyGauge({
  label,
  value,
  percent,
  tone = 'primary',
}: {
  label: string
  value: string
  percent: number
  tone?: 'primary' | 'success' | 'warning'
}) {
  const width = Math.min(100, Math.max(0, percent))
  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-3">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <MetricTooltip
          label={label}
          description={ACCURACY_METHODOLOGY.find((m) => m.name === label)?.description ?? ''}
        />
        <span className="font-semibold text-foreground">{value}</span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-muted">
        <div
          className={cn(
            'h-2 rounded-full transition-all',
            tone === 'success' && 'bg-success',
            tone === 'warning' && 'bg-amber-500',
            tone === 'primary' && 'bg-primary',
          )}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

export function ForecastAccuracyCard({ metric }: ForecastAccuracyCardProps) {
  const accuracyScore = metric.accuracy_score
  const mapeInverse = Math.max(0, 100 - metric.mape)
  const smapeValue = metric.smape ?? metric.mape
  const smapeInverse = Math.max(0, 100 - smapeValue)

  return (
    <article className="rounded-xl border border-border/80 bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-foreground capitalize">
            {metric.metric_name.replace(/_/g, ' ')}
          </h3>
          <p className="text-xs text-muted-foreground">Model: {metric.model_name.replace(/_/g, ' ')}</p>
        </div>
        <AccuracyGauge
          label="Accuracy Score"
          value={formatAccuracyMetric(metric, 'accuracy_score')}
          percent={accuracyScore}
          tone="success"
        />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <AccuracyGauge
          label="MAE"
          value={formatAccuracyMetric(metric, 'mae')}
          percent={Math.min(100, (metric.mae / 200000) * 100)}
          tone="warning"
        />
        <AccuracyGauge
          label="RMSE"
          value={formatAccuracyMetric(metric, 'rmse')}
          percent={Math.min(100, (metric.rmse / 250000) * 100)}
          tone="warning"
        />
        <AccuracyGauge
          label="MAPE"
          value={formatAccuracyMetric(metric, 'mape')}
          percent={mapeInverse}
          tone="primary"
        />
        <AccuracyGauge
          label="SMAPE"
          value={formatAccuracyMetric(metric, 'smape')}
          percent={smapeInverse}
          tone="primary"
        />
        <AccuracyGauge
          label="Bias"
          value={formatAccuracyMetric(metric, 'bias')}
          percent={Math.min(100, Math.abs(metric.bias) * 10)}
          tone="warning"
        />
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
      title="Forecast Accuracy"
      description="Backtest accuracy metrics with visual gauges and methodology explanations."
    >
      {loading ? (
        <div className="h-32 animate-pulse rounded-xl bg-muted" />
      ) : (
        <>
          <div className="mb-4 rounded-xl border border-border/80 bg-card p-5 shadow-sm">
            <MetricCard
              label="Overall Accuracy Score"
              value={`${overallScore.toFixed(1)}%`}
              trend="up"
              change="Holdout validation"
              className="border-0 p-0 shadow-none"
            />
            <div className="mt-3 h-3 rounded-full bg-muted">
              <div
                className="h-3 rounded-full bg-success transition-all"
                style={{ width: `${Math.min(100, overallScore)}%` }}
              />
            </div>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {metrics.map((metric) => (
              <ForecastAccuracyCard key={`${metric.metric_name}-${metric.model_name}`} metric={metric} />
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            MAE measures average absolute error. RMSE penalizes larger errors. MAPE shows percentage error.
            SMAPE balances percentage error for low-volume series. Bias shows over/under prediction tendency.
          </p>
        </>
      )}
    </SectionContainer>
  )
}
