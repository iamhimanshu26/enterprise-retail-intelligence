import { useQuery } from '@tanstack/react-query'
import { runMonitoringSample } from '@/lib/dataServiceApi'
import { buildOperationsCenterBundle } from '../adapters/operationsAdapter'
import { MONITORING_MOCK_REPORT } from '../mock/monitoringMock'

export function useOperationsData() {
  return useQuery({
    queryKey: ['operations-center'],
    queryFn: async () => {
      try {
        const report = await runMonitoringSample()
        return buildOperationsCenterBundle(report, 'api')
      } catch {
        return buildOperationsCenterBundle(MONITORING_MOCK_REPORT, 'mock')
      }
    },
    staleTime: 60_000,
    retry: 0,
  })
}
