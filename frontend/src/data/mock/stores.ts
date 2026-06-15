import type { ChartDataPoint, StoreRow } from '@/types/dashboard'

export const BASE_STORE_PERFORMANCE: ChartDataPoint[] = [
  { label: 'Flagship Tokyo', value: 4.8 },
  { label: 'Manhattan Central', value: 4.2 },
  { label: 'London West End', value: 3.9 },
  { label: 'Singapore Marina', value: 3.5 },
  { label: 'Paris Champs', value: 3.1 },
]

export const BASE_STORE_RANKINGS: StoreRow[] = [
  { id: 's1', rank: 1, storeName: 'Flagship Tokyo', region: 'APAC', revenue: 4_820_000, orders: 18_420, growth: 18.2, performance: 'excellent' },
  { id: 's2', rank: 2, storeName: 'Manhattan Central', region: 'North America', revenue: 4_210_000, orders: 16_890, growth: 14.6, performance: 'excellent' },
  { id: 's3', rank: 3, storeName: 'London West End', region: 'Europe', revenue: 3_940_000, orders: 15_120, growth: 11.8, performance: 'good' },
  { id: 's4', rank: 4, storeName: 'Singapore Marina', region: 'APAC', revenue: 3_520_000, orders: 13_640, growth: 16.4, performance: 'good' },
  { id: 's5', rank: 5, storeName: 'Paris Champs-Élysées', region: 'Europe', revenue: 3_180_000, orders: 12_410, growth: 9.2, performance: 'good' },
  { id: 's6', rank: 6, storeName: 'Chicago Loop', region: 'North America', revenue: 2_960_000, orders: 11_820, growth: 8.4, performance: 'average' },
  { id: 's7', rank: 7, storeName: 'Berlin Mitte', region: 'Europe', revenue: 2_740_000, orders: 10_960, growth: 7.1, performance: 'average' },
  { id: 's8', rank: 8, storeName: 'Osaka Shinsaibashi', region: 'APAC', revenue: 2_580_000, orders: 10_420, growth: 12.8, performance: 'good' },
  { id: 's9', rank: 9, storeName: 'Toronto Eaton', region: 'North America', revenue: 2_310_000, orders: 9_840, growth: 5.6, performance: 'average' },
  { id: 's10', rank: 10, storeName: 'Milan Duomo', region: 'Europe', revenue: 2_120_000, orders: 8_920, growth: 4.2, performance: 'underperforming' },
]

export const STORE_OPTIONS = [
  { value: 'all', label: 'All Stores' },
  { value: 'flagship-tokyo', label: 'Flagship Tokyo' },
  { value: 'manhattan-central', label: 'Manhattan Central' },
  { value: 'london-west-end', label: 'London West End' },
  { value: 'singapore-marina', label: 'Singapore Marina' },
]
