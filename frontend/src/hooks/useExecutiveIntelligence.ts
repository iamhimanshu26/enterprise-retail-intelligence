import { useQuery } from '@tanstack/react-query'
import { runExecutiveIntelligenceSample } from '@/lib/dataServiceApi'

export function useExecutiveIntelligence() {
  return useQuery({
    queryKey: ['executive-intelligence'],
    queryFn: runExecutiveIntelligenceSample,
    staleTime: 60_000,
    retry: 1,
  })
}
