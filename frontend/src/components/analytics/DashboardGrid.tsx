import { cn } from '@/lib/cn'

type DashboardGridColumns = 1 | 2 | 3 | 4

interface DashboardGridProps {
  columns?: DashboardGridColumns
  children: React.ReactNode
  className?: string
}

const columnClasses: Record<DashboardGridColumns, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-4',
}

export function DashboardGrid({ columns = 2, children, className }: DashboardGridProps) {
  return (
    <div className={cn('grid gap-4 md:gap-6', columnClasses[columns], className)}>{children}</div>
  )
}
