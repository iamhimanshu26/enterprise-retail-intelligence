import { Info } from 'lucide-react'
import { StatusBadge } from '@/components/design-system'
import { formatChartValue } from '../utils/chartFormatter'
import { EnterpriseLineChart } from '../charts'
import type { KpiPerformanceItem, KpiStudioStatus } from './executiveStudioAdapters'

const STATUS_VARIANT: Record<KpiStudioStatus, 'completed' | 'in-progress' | 'planned' | 'future'> = {
  excellent: 'completed',
  good: 'completed',
  warning: 'in-progress',
  critical: 'planned',
}

function formatKpiValue(value: number, unit: string): string {
  if (unit === 'JPY') return formatChartValue(value, 'currency')
  if (unit === '%') return `${value.toFixed(1)}%`
  if (unit === 'score') return `${value.toFixed(0)} / 100`
  return formatChartValue(value, 'number')
}

interface KpiPerformanceCardProps {
  kpi: KpiPerformanceItem
}

export function KpiPerformanceCard({ kpi }: KpiPerformanceCardProps) {
  return (
    <article className="rounded-xl border border-border/80 bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{kpi.label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">{formatKpiValue(kpi.currentValue, kpi.unit)}</p>
        </div>
        <StatusBadge status={STATUS_VARIANT[kpi.status]} label={kpi.status} />
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div>
          <p className="text-muted-foreground">Target</p>
          <p className="font-medium">{formatKpiValue(kpi.targetValue, kpi.unit)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Achievement</p>
          <p className="font-medium">{kpi.achievementPct.toFixed(0)}%</p>
        </div>
      </div>

      <div className="mt-3 h-14">
        {kpi.trend.length > 0 ? (
          <EnterpriseLineChart data={kpi.trend.slice(-6)} height="h-14" showLegend={false} />
        ) : null}
      </div>

      <p className="mt-3 flex items-start gap-1.5 text-xs leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        {kpi.explanation}
      </p>
    </article>
  )
}

interface KpiPerformanceBoardProps {
  items: KpiPerformanceItem[]
  loading?: boolean
}

export function KpiPerformanceBoard({ items, loading }: KpiPerformanceBoardProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-48 animate-pulse rounded-xl border border-border/60 bg-muted/40" />
        ))}
      </div>
    )
  }

  if (!items.length) {
    return (
      <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        KPI performance data unavailable. Start the data service to load metrics.
      </p>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((kpi) => (
        <KpiPerformanceCard key={kpi.id} kpi={kpi} />
      ))}
    </div>
  )
}
