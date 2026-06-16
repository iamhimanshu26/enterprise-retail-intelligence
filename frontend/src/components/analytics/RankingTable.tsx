import { useMemo, useState } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react'
import { DataTable } from '@/components/design-system/DataTable'
import { EmptyState } from '@/components/design-system/EmptyState'
import { TableSkeleton } from '@/components/design-system/LoadingSkeleton'
import { DASHBOARD_EMPTY } from '@/lib/dashboard-empty-messages'
import { cn } from '@/lib/cn'
import type { TableColumn } from '@/types'

type SortDirection = 'asc' | 'desc'

interface RankingTableProps<T extends object> {
  columns: TableColumn<T>[]
  data: T[]
  sortKey?: keyof T & string
  className?: string
  searchKeys?: (keyof T & string)[]
  searchPlaceholder?: string
  emptyTitle?: string
  emptyDescription?: string
  loading?: boolean
}

export function RankingTable<T extends object>({
  columns,
  data,
  sortKey: defaultSortKey,
  className,
  searchKeys = [],
  searchPlaceholder = 'Search...',
  emptyTitle = DASHBOARD_EMPTY.table.title,
  emptyDescription = DASHBOARD_EMPTY.table.description,
  loading = false,
}: RankingTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | undefined>(defaultSortKey)
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [search, setSearch] = useState('')

  const filteredData = useMemo(() => {
    let rows = [...data]

    if (search.trim() && searchKeys.length > 0) {
      const query = search.toLowerCase()
      rows = rows.filter((row) =>
        searchKeys.some((key) => String(row[key] ?? '').toLowerCase().includes(query)),
      )
    }

    if (sortKey) {
      rows.sort((a, b) => {
        const aVal = a[sortKey as keyof T]
        const bVal = b[sortKey as keyof T]
        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
        }
        return sortDirection === 'asc'
          ? String(aVal).localeCompare(String(bVal))
          : String(bVal).localeCompare(String(aVal))
      })
    }

    return rows
  }, [data, search, searchKeys, sortDirection, sortKey])

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDirection('desc')
    }
  }

  const SortIcon =
    sortDirection === 'asc' ? ArrowUp : sortDirection === 'desc' ? ArrowDown : ArrowUpDown

  if (loading) {
    return <TableSkeleton rows={6} className={className} />
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        compact
        className={className}
      />
    )
  }

  return (
    <div className={cn('space-y-3', className)}>
      {searchKeys.length > 0 && (
        <label className="block">
          <span className="sr-only">Search table</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full max-w-sm rounded-lg border border-input bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label={searchPlaceholder}
          />
        </label>
      )}

      <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm" aria-label="Sortable analytics table">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {columns.map((col) => {
                  const key = String(col.key)
                  const isSortable = sortKey !== undefined || defaultSortKey !== undefined

                  return (
                    <th
                      key={key}
                      className={cn(
                        'px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground',
                        col.className,
                      )}
                    >
                      {isSortable ? (
                        <button
                          type="button"
                          onClick={() => handleSort(key)}
                          className="inline-flex items-center gap-1 transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                          aria-label={`Sort by ${col.header}`}
                        >
                          {col.header}
                          {sortKey === key && <SortIcon className="h-3.5 w-3.5" />}
                        </button>
                      ) : (
                        col.header
                      )}
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-8">
                    <EmptyState
                      title="No matching records"
                      description="Try adjusting your search or reset dashboard filters."
                      compact
                      className="border-0 bg-transparent"
                    />
                  </td>
                </tr>
              ) : (
                filteredData.map((row, rowIndex) => (
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
    </div>
  )
}

// Re-export DataTable for simple cases
export { DataTable }
