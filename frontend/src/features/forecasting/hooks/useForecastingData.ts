import { useQuery } from '@tanstack/react-query'
import { runForecastingSample } from '@/lib/dataServiceApi'
import { buildForecastingCenterBundle } from '../adapters/forecastingAdapter'
import { FORECASTING_MOCK_REPORT } from '../mock/forecastingMock'

export function useForecastingData() {
  return useQuery({
    queryKey: ['forecasting-center'],
    queryFn: async () => {
      try {
        const report = await runForecastingSample()
        return buildForecastingCenterBundle(report, 'api')
      } catch {
        return buildForecastingCenterBundle(FORECASTING_MOCK_REPORT, 'mock')
      }
    },
    staleTime: 60_000,
    retry: 0,
  })
}
