import type { ActivityEvent } from '@/types/dashboard'

/** Sprint 1.1 foundation timeline placeholders — API-ready event feed. */
export const FOUNDATION_ACTIVITY_EVENTS: ActivityEvent[] = [
  {
    id: 'foundation-1',
    title: 'Dashboard framework created',
    description: 'Executive dashboard layout, KPI grid, and reusable section components initialized.',
    category: 'Platform',
    timestamp: new Date(Date.now() - 2 * 24 * 3600_000).toISOString(),
  },
  {
    id: 'foundation-2',
    title: 'Architecture documentation updated',
    description: 'Engineering Architecture module synchronized with enterprise roadmap.',
    category: 'Architecture',
    timestamp: new Date(Date.now() - 3 * 24 * 3600_000).toISOString(),
  },
  {
    id: 'foundation-3',
    title: 'Data generation pending',
    description: 'Synthetic retail data generator module scheduled for Phase 2.',
    category: 'Data',
    timestamp: new Date(Date.now() - 4 * 24 * 3600_000).toISOString(),
  },
  {
    id: 'foundation-4',
    title: 'ETL pipeline pending',
    description: 'Python ETL workflows will connect when Phase 3 is delivered.',
    category: 'ETL',
    timestamp: new Date(Date.now() - 5 * 24 * 3600_000).toISOString(),
  },
  {
    id: 'foundation-5',
    title: 'Forecast module pending',
    description: 'Forecasting Center awaits predictive analytics in Phase 6.',
    category: 'Forecasting',
    timestamp: new Date(Date.now() - 6 * 24 * 3600_000).toISOString(),
  },
]

export const OPERATIONAL_ACTIVITY_EVENTS: ActivityEvent[] = [
  {
    id: 'act1',
    title: 'Sales report generated',
    description: 'Weekly executive sales summary exported to PDF.',
    category: 'Reporting',
    timestamp: new Date(Date.now() - 20 * 60_000).toISOString(),
  },
  {
    id: 'act2',
    title: 'New store added',
    description: 'Singapore Marina Bay location activated in APAC workspace.',
    category: 'Operations',
    timestamp: new Date(Date.now() - 3 * 3600_000).toISOString(),
  },
  {
    id: 'act3',
    title: 'Forecast completed',
    description: 'Q1 demand forecast model run completed with 94.2% accuracy.',
    category: 'Forecasting',
    timestamp: new Date(Date.now() - 6 * 3600_000).toISOString(),
  },
  {
    id: 'act4',
    title: 'Pipeline executed',
    description: 'Daily ETL pipeline ingested 2.4M transaction records.',
    category: 'ETL',
    timestamp: new Date(Date.now() - 12 * 3600_000).toISOString(),
  },
  {
    id: 'act5',
    title: 'Inventory updated',
    description: 'Stock levels synchronized across 847 active stores.',
    category: 'Inventory',
    timestamp: new Date(Date.now() - 18 * 3600_000).toISOString(),
  },
]

export function getActivityEvents(): ActivityEvent[] {
  return [...OPERATIONAL_ACTIVITY_EVENTS, ...FOUNDATION_ACTIVITY_EVENTS]
}
