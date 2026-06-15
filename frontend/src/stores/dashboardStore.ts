import { create } from 'zustand'
import type { DashboardFilters, DateRangeKey } from '@/types/dashboard'

interface DashboardState extends DashboardFilters {
  setDateRange: (dateRange: DateRangeKey) => void
  setRegion: (region: string) => void
  setStore: (store: string) => void
  setCategory: (category: string) => void
  resetFilters: () => void
}

const DEFAULT_FILTERS: DashboardFilters = {
  dateRange: '30d',
  region: 'all',
  store: 'all',
  category: 'all',
}

export const useDashboardStore = create<DashboardState>()((set) => ({
  ...DEFAULT_FILTERS,
  setDateRange: (dateRange) => set({ dateRange }),
  setRegion: (region) => set({ region }),
  setStore: (store) => set({ store }),
  setCategory: (category) => set({ category }),
  resetFilters: () => set(DEFAULT_FILTERS),
}))

export const DATE_RANGE_OPTIONS: { value: DateRangeKey; label: string }[] = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: 'ytd', label: 'Year to date' },
]
