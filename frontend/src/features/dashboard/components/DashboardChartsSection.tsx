import { memo } from 'react'
import type { ExecutiveDashboardData } from '@/types/dashboard'
import { DashboardGrid } from '@/components/analytics'
import {
  CustomerGrowthChart,
  InventoryDistributionChart,
  MonthlySalesChart,
  RevenueByRegionChart,
  RevenueTrendChart,
  StorePerformanceChart,
  TopCategoriesChart,
} from './DashboardCharts'

interface DashboardChartsSectionProps {
  data: ExecutiveDashboardData
}

export const DashboardChartsSection = memo(function DashboardChartsSection({
  data,
}: DashboardChartsSectionProps) {
  return (
    <DashboardGrid columns={2}>
      <RevenueTrendChart data={data.revenueTrend} />
      <MonthlySalesChart data={data.monthlySales} />
      <TopCategoriesChart data={data.topCategories} />
      <StorePerformanceChart data={data.storePerformance} />
      <CustomerGrowthChart data={data.customerGrowth} />
      <RevenueByRegionChart data={data.revenueByRegion} />
      <InventoryDistributionChart data={data.inventoryDistribution} />
    </DashboardGrid>
  )
})
