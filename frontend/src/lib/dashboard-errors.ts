export type DashboardErrorType =
  | 'network'
  | 'empty'
  | 'unauthorized'
  | 'unavailable'
  | 'generic'

export interface DashboardErrorPreset {
  title: string
  message: string
}

export const DASHBOARD_ERROR_PRESETS: Record<DashboardErrorType, DashboardErrorPreset> = {
  network: {
    title: 'Network error',
    message: 'Unable to reach the analytics service. Check your connection and try again.',
  },
  empty: {
    title: 'No dashboard data',
    message: 'The response was empty. Start the data service or run ETL sample data. Analytics and intelligence APIs are live from Phase 5.',
  },
  unauthorized: {
    title: 'Unauthorized',
    message: 'You do not have permission to view this dashboard. Contact your administrator.',
  },
  unavailable: {
    title: 'Service unavailable',
    message: 'The analytics service is temporarily unavailable. Please retry in a few moments.',
  },
  generic: {
    title: 'Unable to load dashboard',
    message: 'Executive dashboard data could not be retrieved. Please try again.',
  },
}

export function resolveDashboardErrorType(error: unknown): DashboardErrorType {
  if (error instanceof Error) {
    const message = error.message.toLowerCase()
    if (message.includes('unauthorized') || message.includes('401')) return 'unauthorized'
    if (message.includes('network') || message.includes('fetch')) return 'network'
    if (message.includes('503') || message.includes('unavailable')) return 'unavailable'
    if (message.includes('empty') || message.includes('no data')) return 'empty'
  }
  return 'generic'
}
