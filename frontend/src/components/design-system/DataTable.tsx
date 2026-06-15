import { cn } from '@/lib/cn'
import type { TableColumn } from '@/types'

interface DataTableProps<T extends Record<string, unknown>> {
  columns: TableColumn<T>[]
  data: T[]
  className?: string
  emptyMessage?: string
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  className,
  emptyMessage = 'No data available',
}: DataTableProps<T>) {
  return (
    <div className={cn('glass-panel overflow-hidden rounded-xl', className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className={cn(
                    'px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground',
                    col.className,
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-border/60 transition-colors last:border-0 hover:bg-muted/20"
                >
                  {columns.map((col) => (
                    <td key={String(col.key)} className={cn('px-6 py-4', col.className)}>
                      {col.render
                        ? col.render(row)
                        : String(row[col.key as keyof T] ?? '—')}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
