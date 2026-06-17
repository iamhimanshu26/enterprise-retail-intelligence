import { ErrorState } from '@/components/design-system'
import { EnterpriseBarChart, EnterpriseDonutChart, EnterpriseScatterPlot, EnterpriseStackedBarChart } from '../charts'
import { ComparisonChartCard, DistributionChartCard } from '../containers'
import { AnalyticsDashboardLayout, ChartGrid, ChartSection, InsightSummaryPanel } from '../dashboard'
import { useInteractiveDashboardData } from '../hooks/useInteractiveDashboardData'
import type { DashboardViewProps } from './types'

export function ProductAnalyticsDashboard({
  title = 'Product Analytics Dashboard',
  breadcrumb = 'Product Analytics',
}: DashboardViewProps = {}) {
  const { data, isLoading, isFetching, error, refetch } = useInteractiveDashboardData()
  const product = data?.product

  if (error) {
    return <ErrorState title="Product dashboard unavailable" message={String(error)} onRetry={() => refetch()} />
  }

  return (
    <AnalyticsDashboardLayout
      title={title}
      description="Top products, category contribution, returns, and profit distribution."
      badge={{ status: 'in-progress', label: 'Sprint 6.2' }}
      breadcrumb={breadcrumb}
      loading={isLoading}
      onRefresh={() => refetch()}
      refreshing={isFetching}
      insight={
        product ? (
          <InsightSummaryPanel summary="Product revenue rankings, brand performance, and slow-moving SKU analysis." tags={['Products', 'Merchandising']} />
        ) : undefined
      }
    >
      {product && (
        <>
          <ChartSection title="Product Rankings">
            <ChartGrid>
              <ComparisonChartCard title="Top Products by Revenue" data={product.topByRevenue}>
                <EnterpriseBarChart data={product.topByRevenue.slice(0, 8)} valueFormat="currency" horizontal />
              </ComparisonChartCard>
              <ComparisonChartCard title="Top Products by Units Sold" data={product.topByUnits}>
                <EnterpriseBarChart data={product.topByUnits.slice(0, 8)} horizontal />
              </ComparisonChartCard>
            </ChartGrid>
          </ChartSection>
          <ChartSection title="Category & Brand">
            <ChartGrid>
              <DistributionChartCard title="Category Contribution" data={product.categoryContribution}>
                <EnterpriseDonutChart data={product.categoryContribution} valueFormat="currency" />
              </DistributionChartCard>
              <ComparisonChartCard title="Brand Performance" data={product.brandPerformance}>
                <EnterpriseStackedBarChart data={product.brandPerformance.slice(0, 6)} valueFormat="currency" />
              </ComparisonChartCard>
            </ChartGrid>
          </ChartSection>
          <ChartSection title="Returns & Profit">
            <ChartGrid>
              <ComparisonChartCard title="High-Return Products" data={product.highReturn}>
                <EnterpriseBarChart data={product.highReturn} />
              </ComparisonChartCard>
              <ComparisonChartCard title="Slow-Moving Products" data={product.slowMoving}>
                <EnterpriseBarChart data={product.slowMoving} />
              </ComparisonChartCard>
              <ComparisonChartCard title="Profit Distribution" data={product.profitDistribution}>
                <EnterpriseScatterPlot data={product.profitDistribution} valueFormat="currency" />
              </ComparisonChartCard>
            </ChartGrid>
          </ChartSection>
        </>
      )}
    </AnalyticsDashboardLayout>
  )
}
