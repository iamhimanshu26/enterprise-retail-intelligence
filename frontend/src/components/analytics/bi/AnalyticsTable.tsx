import { RankingTable } from '../RankingTable'
import type { TableColumn } from '@/types'

interface AnalyticsTableProps<T extends object> {
  columns: TableColumn<T>[]
  data: T[]
  sortKey?: keyof T & string
  className?: string
  searchKeys?: (keyof T & string)[]
  searchPlaceholder?: string
  emptyMessage?: string
  paginationPlaceholder?: boolean
}

export function AnalyticsTable<T extends object>({
  paginationPlaceholder = true,
  data,
  ...props
}: AnalyticsTableProps<T>) {
  return (
    <div>
      <RankingTable data={data} {...props} />
      {paginationPlaceholder && data.length > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          Showing {data.length} records — server pagination available in future API integration.
        </p>
      )}
    </div>
  )
}
