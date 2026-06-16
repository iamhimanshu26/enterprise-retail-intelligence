import { TableSkeleton } from '@/components/design-system/LoadingSkeleton'
import { RankingTable } from '../RankingTable'
import type { TableColumn } from '@/types'

interface AnalyticsTableProps<T extends object> {
  columns: TableColumn<T>[]
  data: T[]
  sortKey?: keyof T & string
  className?: string
  searchKeys?: (keyof T & string)[]
  searchPlaceholder?: string
  emptyTitle?: string
  emptyDescription?: string
  loading?: boolean
  paginationPlaceholder?: boolean
}

export function AnalyticsTable<T extends object>({
  paginationPlaceholder = true,
  data,
  loading,
  ...props
}: AnalyticsTableProps<T>) {
  if (loading) {
    return <TableSkeleton rows={6} className={props.className} />
  }

  return (
    <div>
      <RankingTable data={data} loading={loading} {...props} />
      {paginationPlaceholder && data.length > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          Showing {data.length} records — server pagination available in future API integration.
        </p>
      )}
    </div>
  )
}
