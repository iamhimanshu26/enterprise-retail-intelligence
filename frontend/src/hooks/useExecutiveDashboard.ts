import { useQuery } from '@tanstack/react-query'
import { fetchExecutiveDashboard } from '@/data/mock/dashboard'
import { useDashboardStore } from '@/stores/dashboardStore'
import { useWorkspaceStore } from '@/stores/workspaceStore'

export function useExecutiveDashboard() {
  const workspaceId = useWorkspaceStore((s) => s.currentWorkspaceId)
  const dateRange = useDashboardStore((s) => s.dateRange)
  const region = useDashboardStore((s) => s.region)
  const store = useDashboardStore((s) => s.store)
  const category = useDashboardStore((s) => s.category)

  return useQuery({
    queryKey: ['executive-dashboard', workspaceId, dateRange, region, store, category],
    queryFn: () =>
      fetchExecutiveDashboard({
        workspaceId,
        dateRange,
        region,
        store,
        category,
      }),
    staleTime: 30_000,
    placeholderData: (previous) => previous,
  })
}
