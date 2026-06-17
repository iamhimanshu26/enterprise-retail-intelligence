import type { ReactNode } from 'react'
import { DashboardGrid } from '@/components/analytics'
import { cn } from '@/lib/cn'

interface ChartGridProps {
  children: ReactNode
  columns?: 1 | 2 | 3 | 4
  className?: string
}

export function ChartGrid({ children, columns = 2, className }: ChartGridProps) {
  return (
    <DashboardGrid columns={columns} className={cn(className)}>
      {children}
    </DashboardGrid>
  )
}
