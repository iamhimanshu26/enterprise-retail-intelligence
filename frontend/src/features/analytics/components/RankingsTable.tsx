import { SectionContainer } from '@/components/design-system'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatters'

interface Column<T> {
  key: string
  header: string
  render?: (row: T) => React.ReactNode
}

interface RankingsTableProps<T> {
  title: string
  description?: string
  rows: T[]
  columns: Column<T>[]
  rowKey: keyof T & string
}

export function RankingsTable<T>({
  title,
  description,
  rows,
  columns,
  rowKey,
}: RankingsTableProps<T>) {
  return (
    <SectionContainer title={title} description={description}>
      <div className="overflow-x-auto rounded-xl border border-border/80">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-muted/30 text-left text-xs uppercase tracking-wide text-muted-foreground">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-3 font-semibold">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-6 text-center text-muted-foreground">
                  No rankings available
                </td>
              </tr>
            ) : (
              rows.map((row, index) => (
                <tr key={String(row[rowKey])} className="border-b border-border/40 last:border-0">
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-3">
                      {col.render
                        ? col.render(row)
                        : col.key === 'rank'
                          ? index + 1
                          : String((row as Record<string, unknown>)[col.key] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </SectionContainer>
  )
}

export const currencyCell = (value: number) => formatCurrency(value, true)
export const numberCell = (value: number) => formatNumber(value)
export const percentCell = (value: number) => formatPercent(value)
