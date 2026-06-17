import { GeneratorCard } from '@/features/generator/components/GeneratorCard'
import { MetricCard } from '@/components/design-system'
import type { TimeSeriesStats } from '@/types/statistics'

interface TimeSeriesStatsCardProps {
  timeSeries: TimeSeriesStats
}

export function TimeSeriesStatsCard({ timeSeries }: TimeSeriesStatsCardProps) {
  const latestMonth = timeSeries.monthly[timeSeries.monthly.length - 1]

  return (
    <GeneratorCard title="Time-Based Statistics" description="Revenue trends and growth placeholders">
      <div className="mb-4 grid gap-3 sm:grid-cols-3">
        <MetricCard
          label="Latest month revenue"
          value={latestMonth ? `¥${latestMonth.revenue.toLocaleString()}` : '—'}
        />
        <MetricCard
          label="MoM growth"
          value={
            timeSeries.month_over_month_growth_pct != null
              ? `${timeSeries.month_over_month_growth_pct.toFixed(1)}%`
              : '—'
          }
        />
        <MetricCard
          label="7-day rolling avg"
          value={
            timeSeries.rolling_average_7d != null
              ? `¥${timeSeries.rolling_average_7d.toLocaleString()}`
              : '—'
          }
        />
      </div>
      <div className="space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Monthly revenue (recent)</p>
        {timeSeries.monthly.slice(-6).map((p) => (
          <div key={p.period} className="flex items-center justify-between text-sm">
            <span>{p.period}</span>
            <span className="font-medium tabular-nums">¥{p.revenue.toLocaleString()}</span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        Year-over-year growth placeholder:{' '}
        {timeSeries.year_over_year_growth_pct != null
          ? `${timeSeries.year_over_year_growth_pct.toFixed(1)}%`
          : 'Requires multi-year data'}
      </p>
    </GeneratorCard>
  )
}
