import { SectionContainer } from '@/components/design-system'
import type { ForecastOverviewKpi } from '@/types/forecasting'
import { ForecastSummaryCard } from './ForecastSummaryCard'

interface ForecastOverviewProps {
  kpis: ForecastOverviewKpi[]
  loading?: boolean
}

export function ForecastOverview({ kpis, loading }: ForecastOverviewProps) {
  return (
    <SectionContainer
      title="Executive Forecast Summary"
      description="KPI-style forecast cards for revenue, sales, demand, risk, accuracy, and growth outlook."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-xl border border-border/80 bg-card p-5 shadow-sm">
                <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                <div className="mt-4 h-8 w-32 animate-pulse rounded bg-muted" />
              </div>
            ))
          : kpis.map((kpi) => <ForecastSummaryCard key={kpi.id} kpi={kpi} />)}
      </div>
    </SectionContainer>
  )
}
