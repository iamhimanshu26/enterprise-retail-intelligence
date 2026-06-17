import { ErrorState } from '@/components/design-system'
import { EnterpriseAreaChart, EnterpriseBarChart, EnterpriseDonutChart, EnterprisePieChart } from '../charts'
import { ComparisonChartCard, DistributionChartCard, TrendChartCard } from '../containers'
import { AnalyticsDashboardLayout, ChartGrid, ChartSection, InsightSummaryPanel } from '../dashboard'
import { useInteractiveDashboardData } from '../hooks/useInteractiveDashboardData'
import type { DashboardViewProps } from './types'

export function CustomerAnalyticsDashboard({
  title = 'Customer Analytics Dashboard',
  breadcrumb = 'Customer Analytics',
}: DashboardViewProps = {}) {
  const { data, isLoading, isFetching, error, refetch } = useInteractiveDashboardData()
  const customer = data?.customer

  if (error) {
    return <ErrorState title="Customer dashboard unavailable" message={String(error)} onRetry={() => refetch()} />
  }

  return (
    <AnalyticsDashboardLayout
      title={title}
      description="Growth, segmentation, membership tiers, and purchase behavior."
      badge={{ status: 'in-progress', label: 'Sprint 6.2' }}
      breadcrumb={breadcrumb}
      loading={isLoading}
      onRefresh={() => refetch()}
      refreshing={isFetching}
      insight={
        customer ? (
          <InsightSummaryPanel summary="Customer growth trends, segment spend, and regional distribution." tags={['Customers', 'Segmentation']} />
        ) : undefined
      }
    >
      {customer && (
        <>
          <ChartSection title="Customer Growth">
            <ChartGrid>
              <TrendChartCard title="Customer Growth Trend" data={customer.growthTrend}>
                <EnterpriseAreaChart data={customer.growthTrend} valueFormat="number" />
              </TrendChartCard>
              <DistributionChartCard title="New vs Returning" data={customer.newVsReturning}>
                <EnterpriseDonutChart data={customer.newVsReturning} />
              </DistributionChartCard>
            </ChartGrid>
          </ChartSection>
          <ChartSection title="Segmentation">
            <ChartGrid>
              <DistributionChartCard title="Membership Tiers" data={customer.membershipTiers}>
                <EnterprisePieChart data={customer.membershipTiers} valueFormat="percent" />
              </DistributionChartCard>
              <ComparisonChartCard title="Average Spend by Segment" data={customer.segmentSpend}>
                <EnterpriseBarChart data={customer.segmentSpend} valueFormat="currency" horizontal />
              </ComparisonChartCard>
              <ComparisonChartCard title="Purchase Frequency" data={customer.purchaseFrequency}>
                <EnterpriseBarChart data={customer.purchaseFrequency} />
              </ComparisonChartCard>
              <ComparisonChartCard title="Customer Region Distribution" data={customer.regionDistribution}>
                <EnterpriseBarChart data={customer.regionDistribution} valueFormat="currency" />
              </ComparisonChartCard>
            </ChartGrid>
          </ChartSection>
        </>
      )}
    </AnalyticsDashboardLayout>
  )
}
