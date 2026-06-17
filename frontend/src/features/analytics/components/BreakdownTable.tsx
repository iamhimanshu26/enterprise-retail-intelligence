import { SectionContainer } from '@/components/design-system'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatters'
import type { AnalyticsBreakdownRow } from '@/types/analytics'

interface BreakdownTableProps {
  title: string
  description?: string
  rows: AnalyticsBreakdownRow[]
  valueFormat?: 'currency' | 'number' | 'percent'
}

function formatValue(value: number, format: BreakdownTableProps['valueFormat']): string {
  switch (format) {
    case 'currency':
      return formatCurrency(value, true)
    case 'percent':
      return formatPercent(value)
    default:
      return formatNumber(value)
  }
}

export function BreakdownTable({
  title,
  description,
  rows,
  valueFormat = 'currency',
}: BreakdownTableProps) {
  return (
    <SectionContainer title={title} description={description}>
      <div className="overflow-x-auto rounded-xl border border-border/80">
        <table className="w-full min-w-[320px] text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3 font-semibold">Dimension</th>
              <th className="px-4 py-3 font-semibold">Value</th>
              <th className="px-4 py-3 font-semibold">Count</th>
              <th className="px-4 py-3 font-semibold">Share</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">
                  No data available
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.dimension} className="border-b border-border/40 last:border-0">
                  <td className="px-4 py-3 font-medium">{row.dimension}</td>
                  <td className="px-4 py-3">{formatValue(row.value, valueFormat)}</td>
                  <td className="px-4 py-3">{row.count ?? '—'}</td>
                  <td className="px-4 py-3">
                    {row.percentage != null ? formatPercent(row.percentage) : '—'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </SectionContainer>
  )
}
