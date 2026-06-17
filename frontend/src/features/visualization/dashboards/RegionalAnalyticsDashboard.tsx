import { ErrorState } from '@/components/design-system'
import { EnterpriseAreaChart, EnterpriseBarChart, EnterpriseDonutChart, EnterpriseLineChart } from '../charts'
import { ComparisonChartCard, DistributionChartCard, TrendChartCard } from '../containers'
import { AnalyticsDashboardLayout, ChartGrid, ChartSection, InsightSummaryPanel } from '../dashboard'
import { useInteractiveDashboardData } from '../hooks/useInteractiveDashboardData'
import type { DashboardViewProps } from './types'

export function RegionalAnalyticsDashboard({
  title = 'Regional Analytics Dashboard',
  breadcrumb = 'Regional Analytics',
}: DashboardViewProps = {}) {
  const { data, isLoading, isFetching, error, refetch } = useInteractiveDashboardData()
  const regional = data?.regional

  if (error) {
    return <ErrorState title="Regional dashboard unavailable" message={String(error)} onRetry={() => refetch()} />
  }

  return (
    <AnalyticsDashboardLayout
      title={title}
      description="Japanese regional performance — revenue, orders, profit, and store comparison."
      badge={{ status: 'in-progress', label: 'Sprint 6.2' }}
      breadcrumb={breadcrumb}
      loading={isLoading}
      onRefresh={() => refetch()}
      refreshing={isFetching}
      insight={
        regional ? (
          <InsightSummaryPanel summary="Regional revenue, order volume, customer distribution, and growth comparison across Japan." tags={['Regional', 'Japan']} />
        ) : undefined
      }
    >
      {regional && (
        <>
          <ChartSection title="Regional Revenue & Orders">
            <ChartGrid>
              <DistributionChartCard title="Revenue by Region" data={regional.revenue}>
                <EnterpriseDonutChart data={regional.revenue} valueFormat="currency" />
              </DistributionChartCard>
              <ComparisonChartCard title="Orders by Region" data={regional.orders}>
                <EnterpriseBarChart data={regional.orders} />
              </ComparisonChartCard>
              <ComparisonChartCard title="Profit by Region" data={regional.profit}>
                <EnterpriseBarChart data={regional.profit} valueFormat="currency" />
              </ComparisonChartCard>
              <ComparisonChartCard title="Customers by Region" data={regional.customers}>
                <EnterpriseAreaChart data={regional.customers} />
              </ComparisonChartCard>
            </ChartGrid>
          </ChartSection>
          <ChartSection title="Store & Growth">
            <ChartGrid>
              <ComparisonChartCard title="Store Performance by Region" data={regional.storePerformance}>
                <EnterpriseBarChart data={regional.storePerformance} valueFormat="currency" horizontal />
              </ComparisonChartCard>
              <TrendChartCard title="Regional Growth Comparison" data={regional.growthComparison}>
                <EnterpriseLineChart data={regional.growthComparison} valueFormat="currency" />
              </TrendChartCard>
            </ChartGrid>
          </ChartSection>
        </>
      )}
    </AnalyticsDashboardLayout>
  )
}
