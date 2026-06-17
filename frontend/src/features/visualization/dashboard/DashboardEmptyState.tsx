import { EmptyState } from '@/components/design-system/EmptyState'
import { BarChart3 } from 'lucide-react'

interface DashboardEmptyStateProps {
  title?: string
  description?: string
}

export function DashboardEmptyState({
  title = 'No dashboard data',
  description = 'Adjust filters or start the data service to load analytics charts.',
}: DashboardEmptyStateProps) {
  return <EmptyState icon={BarChart3} title={title} description={description} compact />
}
