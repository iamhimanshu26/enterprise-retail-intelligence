import type { BusinessAlert } from '@/types/dashboard'

export const MOCK_ALERTS: BusinessAlert[] = [
  {
    id: 'a1',
    title: 'Low inventory detected',
    message: 'Outdoor Patio Set stock below reorder threshold in 12 stores.',
    severity: 'warning',
    timestamp: new Date(Date.now() - 45 * 60_000).toISOString(),
  },
  {
    id: 'a2',
    title: 'Revenue decline in Kansai region',
    message: 'Kansai revenue down 4.2% week-over-week. Review local promotions.',
    severity: 'critical',
    timestamp: new Date(Date.now() - 2 * 3600_000).toISOString(),
  },
  {
    id: 'a3',
    title: 'Promotion ending tomorrow',
    message: 'SmartWatch Series X promotion campaign ends in 24 hours.',
    severity: 'info',
    timestamp: new Date(Date.now() - 5 * 3600_000).toISOString(),
  },
  {
    id: 'a4',
    title: 'Supplier delivery delayed',
    message: 'Premium Denim Collection shipment delayed by 48 hours from supplier #4421.',
    severity: 'warning',
    timestamp: new Date(Date.now() - 8 * 3600_000).toISOString(),
  },
  {
    id: 'a5',
    title: 'Q1 sales target achieved',
    message: 'North America workspace exceeded quarterly revenue target by 6.2%.',
    severity: 'success',
    timestamp: new Date(Date.now() - 24 * 3600_000).toISOString(),
  },
]
