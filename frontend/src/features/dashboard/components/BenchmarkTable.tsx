import { SectionContainer } from '@/components/design-system'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatters'
import type { BenchmarkItem } from '@/types/intelligence'

function formatActual(item: BenchmarkItem): string {
  if (item.unit === 'JPY') return formatCurrency(item.actual, true)
  if (item.unit === '%') return `${item.actual.toFixed(1)}%`
  return formatNumber(item.actual)
}

function formatTarget(item: BenchmarkItem): string {
  if (item.unit === 'JPY') return formatCurrency(item.target, true)
  if (item.unit === '%') return `${item.target.toFixed(1)}%`
  return formatNumber(item.target)
}

export function BenchmarkTable({ benchmarks }: { benchmarks: BenchmarkItem[] }) {
  return (
    <SectionContainer title="Target vs Actual" description="Business benchmark achievement by metric.">
      <div className="overflow-x-auto rounded-xl border border-border/80">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-semibold">Metric</th>
              <th className="px-4 py-3 font-semibold">Actual</th>
              <th className="px-4 py-3 font-semibold">Target</th>
              <th className="px-4 py-3 font-semibold">Achievement</th>
            </tr>
          </thead>
          <tbody>
            {benchmarks.map((row) => (
              <tr key={row.metric} className="border-b border-border/40 last:border-0">
                <td className="px-4 py-3 font-medium">{row.metric}</td>
                <td className="px-4 py-3">{formatActual(row)}</td>
                <td className="px-4 py-3">{formatTarget(row)}</td>
                <td className="px-4 py-3 font-semibold text-primary">
                  {formatPercent(row.achievement_pct)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SectionContainer>
  )
}
