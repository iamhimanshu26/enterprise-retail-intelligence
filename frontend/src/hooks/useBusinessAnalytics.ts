import { useQuery } from '@tanstack/react-query'
import { getAnalyticsOverview, runAnalyticsSample } from '@/lib/dataServiceApi'

export function useBusinessAnalytics() {
  const overviewQuery = useQuery({
    queryKey: ['analytics-overview'],
    queryFn: getAnalyticsOverview,
    staleTime: 60_000,
  })

  const reportQuery = useQuery({
    queryKey: ['analytics-report'],
    queryFn: runAnalyticsSample,
    staleTime: 60_000,
  })

  return {
    overview: overviewQuery.data,
    report: reportQuery.data,
    isLoading: overviewQuery.isLoading || reportQuery.isLoading,
    isFetching: overviewQuery.isFetching || reportQuery.isFetching,
    error: overviewQuery.error ?? reportQuery.error,
    refetch: async () => {
      await Promise.all([overviewQuery.refetch(), reportQuery.refetch()])
    },
  }
}
