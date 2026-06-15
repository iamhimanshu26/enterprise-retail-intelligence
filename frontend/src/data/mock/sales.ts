import type { ChartDataPoint } from '@/types/dashboard'

export const BASE_REVENUE_TREND: ChartDataPoint[] = [
  { label: 'Jan', value: 8.2 },
  { label: 'Feb', value: 8.6 },
  { label: 'Mar', value: 9.1 },
  { label: 'Apr', value: 9.4 },
  { label: 'May', value: 10.2 },
  { label: 'Jun', value: 10.8 },
  { label: 'Jul', value: 11.1 },
  { label: 'Aug', value: 11.6 },
  { label: 'Sep', value: 12.0 },
  { label: 'Oct', value: 12.4 },
  { label: 'Nov', value: 13.1 },
  { label: 'Dec', value: 14.2 },
]

export const BASE_MONTHLY_SALES: ChartDataPoint[] = [
  { label: 'W1', value: 2.8, secondary: 2.4 },
  { label: 'W2', value: 3.1, secondary: 2.7 },
  { label: 'W3', value: 3.4, secondary: 2.9 },
  { label: 'W4', value: 3.9, secondary: 3.2 },
]

export const BASE_TOP_CATEGORIES: ChartDataPoint[] = [
  { label: 'Electronics', value: 34.2 },
  { label: 'Apparel', value: 22.8 },
  { label: 'Home & Garden', value: 16.5 },
  { label: 'Grocery', value: 14.1 },
  { label: 'Health & Beauty', value: 12.4 },
]

export const BASE_REVENUE_BY_REGION: ChartDataPoint[] = [
  { label: 'Tokyo', value: 32.0 },
  { label: 'North America', value: 28.4 },
  { label: 'Europe', value: 21.6 },
  { label: 'Southeast Asia', value: 11.2 },
  { label: 'Other', value: 6.8 },
]

export function scaleChartData(data: ChartDataPoint[], multiplier: number): ChartDataPoint[] {
  return data.map((point) => ({
    ...point,
    value: Number((point.value * multiplier).toFixed(2)),
    secondary: point.secondary ? Number((point.secondary * multiplier).toFixed(2)) : undefined,
  }))
}
