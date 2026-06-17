import { MetricCard, SectionContainer, StatusBadge } from '@/components/design-system'
import { EnterpriseLineChart } from '@/features/visualization/charts'
import { TrendChartCard } from '@/features/visualization/containers/TrendChartCard'
import type { ChartSeriesPoint } from '@/features/visualization/adapters/chartAdapters'
import type { QualityCenter } from '@/types/monitoring'

interface DataQualityCenterProps {
  quality: QualityCenter
  historyChart: ChartSeriesPoint[]
  loading?: boolean
}

export function DataQualityCenter({ quality, historyChart, loading }: DataQualityCenterProps) {
  return (
    <SectionContainer
      title="Data Quality Operations Center"
      description="Six quality dimensions with overall index and score history trend."
    >
      {loading ? (
        <div className="h-40 animate-pulse rounded-xl bg-muted" />
      ) : (
        <div className="space-y-6">
          <MetricCard
            label="Overall Quality Index"
            value={`${quality.overall_quality_index.toFixed(1)}%`}
            trend="up"
            className="max-w-sm"
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {quality.dimensions.map((dim) => (
              <article
                key={dim.name}
                className="rounded-xl border border-border/80 bg-card p-4 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold">{dim.name}</h3>
                  <StatusBadge
                    status={dim.trend === 'up' ? 'completed' : 'in-progress'}
                    label={dim.trend}
                  />
                </div>
                <p className="mt-2 text-2xl font-semibold">{dim.score.toFixed(1)}%</p>
                <div className="mt-2 h-2 rounded-full bg-muted">
                  <div
                    className="h-2 rounded-full bg-primary"
                    style={{ width: `${Math.min(100, dim.score)}%` }}
                  />
                </div>
              </article>
            ))}
          </div>
          <TrendChartCard title="Quality Score History" data={historyChart}>
            <EnterpriseLineChart data={historyChart} valueFormat="percent" showLegend={false} />
          </TrendChartCard>
        </div>
      )}
    </SectionContainer>
  )
}
