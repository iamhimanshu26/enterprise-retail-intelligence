import { BASE_INVENTORY_DISTRIBUTION } from './products'
import { BASE_CUSTOMER_GROWTH } from './customers'
import {
  BASE_MONTHLY_SALES,
  BASE_REVENUE_BY_REGION,
  BASE_REVENUE_TREND,
  BASE_TOP_CATEGORIES,
  scaleChartData,
} from './sales'
import { BASE_STORE_PERFORMANCE } from './stores'

export function buildChartDatasets(multiplier: number) {
  return {
    revenueTrend: scaleChartData(BASE_REVENUE_TREND, multiplier),
    monthlySales: scaleChartData(BASE_MONTHLY_SALES, multiplier),
    topCategories: scaleChartData(BASE_TOP_CATEGORIES, multiplier),
    storePerformance: scaleChartData(BASE_STORE_PERFORMANCE, multiplier),
    customerGrowth: scaleChartData(BASE_CUSTOMER_GROWTH, multiplier),
    revenueByRegion: BASE_REVENUE_BY_REGION,
    inventoryDistribution: BASE_INVENTORY_DISTRIBUTION,
  }
}

export type ChartDatasets = ReturnType<typeof buildChartDatasets>

export { scaleChartData, BASE_REVENUE_TREND, BASE_MONTHLY_SALES, BASE_TOP_CATEGORIES }
