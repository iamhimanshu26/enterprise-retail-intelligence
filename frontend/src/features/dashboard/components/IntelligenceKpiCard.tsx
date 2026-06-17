import { StatusBadge } from '@/components/design-system'
import { cn } from '@/lib/cn'
import { formatPercent } from '@/lib/formatters'
import type { KpiIntelligenceItem } from '@/types/intelligence'

const STATUS_MAP = {
  excellent: { status: 'completed' as const, label: 'Excellent' },
  good: { status: 'foundation' as const, label: 'Good' },
  warning: { status: 'in-progress' as const, label: 'Warning' },
  critical: { status: 'planned' as const, label: 'Critical' },
}

function formatValue(item: KpiIntelligenceItem): string {
  if (item.unit === 'JPY') return `¥${item.value.toLocaleString()}`
  if (item.unit === '%') return `${item.value.toFixed(1)}%`
  return `${item.value.toLocaleString()}${item.unit ? ` ${item.unit}` : ''}`
}

export function IntelligenceKpiCard({ item }: { item: KpiIntelligenceItem }) {
  const config = STATUS_MAP[item.status] ?? STATUS_MAP.good
  return (
    <article className="rounded-xl border border-border/80 bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
        <StatusBadge status={config.status} label={config.label} />
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight">{formatValue(item)}</p>
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
        <span
          className={cn(
            'rounded-full px-2 py-0.5 font-medium',
            item.health_indicator === 'healthy' && 'bg-success/10 text-success',
            item.health_indicator === 'at_risk' && 'bg-warning/10 text-warning',
            item.health_indicator === 'critical' && 'bg-destructive/10 text-destructive',
          )}
        >
          {item.health_indicator.replace('_', ' ')}
        </span>
        <span>Trend: {item.trend}</span>
        {item.benchmark_pct != null && <span>Benchmark: {formatPercent(item.benchmark_pct)}</span>}
        {item.change_pct != null && <span>Change: {formatPercent(item.change_pct)}</span>}
      </div>
    </article>
  )
}
