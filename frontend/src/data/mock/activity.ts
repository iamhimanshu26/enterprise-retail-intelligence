import type { ActivityEvent } from '@/types/dashboard'

export const BI_ACTIVITY_EVENTS: ActivityEvent[] = [
  {
    id: 'bi-1',
    title: 'Dashboard refreshed',
    description: 'Executive dashboard metrics updated from mock intelligence layer.',
    category: 'Dashboard',
    timestamp: new Date(Date.now() - 8 * 60_000).toISOString(),
    icon: 'refresh',
  },
  {
    id: 'bi-2',
    title: 'Sales data imported',
    description: 'Weekly sales batch imported — 892K orders processed.',
    category: 'Sales',
    timestamp: new Date(Date.now() - 45 * 60_000).toISOString(),
    icon: 'upload',
  },
  {
    id: 'bi-3',
    title: 'ETL job scheduled',
    description: 'Nightly retail ETL pipeline scheduled for 02:00 UTC.',
    category: 'ETL',
    timestamp: new Date(Date.now() - 2 * 3600_000).toISOString(),
    icon: 'calendar',
  },
  {
    id: 'bi-4',
    title: 'Forecast requested',
    description: 'Q2 demand forecast run requested by executive workspace.',
    category: 'Forecasting',
    timestamp: new Date(Date.now() - 4 * 3600_000).toISOString(),
    icon: 'chart',
  },
  {
    id: 'bi-5',
    title: 'Data generation completed',
    description: 'Synthetic retail dataset batch completed for APAC region.',
    category: 'Data',
    timestamp: new Date(Date.now() - 10 * 3600_000).toISOString(),
    icon: 'database',
  },
  {
    id: 'bi-6',
    title: 'User login',
    description: 'Executive user authenticated via enterprise demo session.',
    category: 'Security',
    timestamp: new Date(Date.now() - 12 * 3600_000).toISOString(),
    icon: 'login',
  },
]

export const FOUNDATION_ACTIVITY_EVENTS: ActivityEvent[] = [
  {
    id: 'foundation-1',
    title: 'Dashboard framework created',
    description: 'Executive dashboard layout, KPI grid, and reusable section components initialized.',
    category: 'Platform',
    timestamp: new Date(Date.now() - 2 * 24 * 3600_000).toISOString(),
    icon: 'default',
  },
]

export const OPERATIONAL_ACTIVITY_EVENTS: ActivityEvent[] = [
  {
    id: 'act1',
    title: 'Sales report generated',
    description: 'Weekly executive sales summary exported to PDF.',
    category: 'Reporting',
    timestamp: new Date(Date.now() - 20 * 60_000).toISOString(),
    icon: 'chart',
  },
  {
    id: 'act5',
    title: 'Inventory updated',
    description: 'Stock levels synchronized across 847 active stores.',
    category: 'Inventory',
    timestamp: new Date(Date.now() - 18 * 3600_000).toISOString(),
    icon: 'database',
  },
]

export function getActivityEvents(): ActivityEvent[] {
  return [...BI_ACTIVITY_EVENTS, ...OPERATIONAL_ACTIVITY_EVENTS, ...FOUNDATION_ACTIVITY_EVENTS]
}
