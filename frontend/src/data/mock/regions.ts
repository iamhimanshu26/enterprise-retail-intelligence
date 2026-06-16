import type { RegionPerformanceRow } from '@/types/dashboard'

export const BASE_REGION_PERFORMANCE: RegionPerformanceRow[] = [
  {
    id: 'r1',
    rank: 1,
    region: 'Tokyo',
    revenue: 39_900_000,
    orders: 142_800,
    growth: 18.4,
    profit: 11_240_000,
    performanceScore: 96,
    trend: 'up',
  },
  {
    id: 'r2',
    rank: 2,
    region: 'Osaka',
    revenue: 24_600_000,
    orders: 98_400,
    growth: 14.2,
    profit: 6_880_000,
    performanceScore: 91,
    trend: 'up',
  },
  {
    id: 'r3',
    rank: 3,
    region: 'Kanagawa',
    revenue: 18_200_000,
    orders: 72_100,
    growth: 11.8,
    profit: 5_020_000,
    performanceScore: 87,
    trend: 'up',
  },
  {
    id: 'r4',
    rank: 4,
    region: 'Hokkaido',
    revenue: 12_400_000,
    orders: 48_600,
    growth: 8.6,
    profit: 3_180_000,
    performanceScore: 82,
    trend: 'up',
  },
  {
    id: 'r5',
    rank: 5,
    region: 'Fukuoka',
    revenue: 9_800_000,
    orders: 38_200,
    growth: -4.2,
    profit: 2_420_000,
    performanceScore: 71,
    trend: 'down',
  },
]

export function buildRegionPerformance(multiplier: number): RegionPerformanceRow[] {
  return BASE_REGION_PERFORMANCE.map((row) => ({
    ...row,
    revenue: Math.round(row.revenue * multiplier),
    orders: Math.round(row.orders * multiplier),
    profit: Math.round(row.profit * multiplier),
  }))
}
