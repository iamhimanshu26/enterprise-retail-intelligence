import { useQuery } from '@tanstack/react-query'
import {
  runAnalyticsSample,
  runExecutiveIntelligenceSample,
  runStatisticsSample,
} from '@/lib/dataServiceApi'
import { buildExecutiveVisualizationBundle } from '../studio/executiveStudioAdapters'

export function useExecutiveVisualizationData() {
  return useQuery({
    queryKey: ['executive-visualization-studio'],
    queryFn: async () => {
      const [analytics, statistics, intelligence] = await Promise.all([
        runAnalyticsSample(),
        runStatisticsSample(),
        runExecutiveIntelligenceSample(),
      ])
      return buildExecutiveVisualizationBundle(analytics, statistics, intelligence)
    },
    staleTime: 60_000,
    retry: 1,
  })
}
