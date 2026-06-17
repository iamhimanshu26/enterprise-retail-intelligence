import { ErrorState } from '@/components/design-system'
import {
  EnterpriseAreaChart,
  EnterpriseBarChart,
  EnterpriseDonutChart,
  EnterpriseLineChart,
  EnterprisePieChart,
} from '../charts'
import { ComparisonChartCard, TrendChartCard } from '../containers'
import { AnalyticsDashboardLayout, ChartGrid, ChartSection, InsightSummaryPanel } from '../dashboard'
import { useInteractiveDashboardData } from '../hooks/useInteractiveDashboardData'
import type { DashboardViewProps } from './types'

export function SalesAnalyticsDashboard({
  title = 'Sales Analytics Dashboard',
  breadcrumb = 'Sales Analytics',
}: DashboardViewProps = {}) {
  const { data, isLoading, isFetching, error, refetch } = useInteractiveDashboardData()

  if (error) {
    return (
      <ErrorState
        title="Sales dashboard unavailable"
        message={error instanceof Error ? error.message : 'Failed to load sales dashboard'}
        onRetry={() => refetch()}
      />
    )
  }

  const sales = data?.sales

  return (
    <AnalyticsDashboardLayout
      title={title}
      description="Interactive revenue analytics — trends, regional breakdowns, and store comparisons."
      badge={{ status: 'in-progress', label: 'Sprint 6.2' }}
      breadcrumb={breadcrumb}
      loading={isLoading}
      onRefresh={() => refetch()}
      refreshing={isFetching}
      insight={
        sales ? (
          <InsightSummaryPanel
            summary="Revenue performance across regions, categories, and payment methods with trend and comparison charts."
            tags={['Sales', 'Revenue', data?.source === 'live' ? 'Live API' : 'Sample']}
          />
        ) : undefined
      }
    >
      {sales && (
        <>
          <ChartSection title="Revenue Trends" description="Daily and monthly revenue momentum">
            <ChartGrid>
              <TrendChartCard title="Revenue Trend" data={sales.revenueTrend} onRefresh={() => refetch()}>
                <EnterpriseAreaChart data={sales.revenueTrend} valueFormat="currency" />
              </TrendChartCard>
              <TrendChartCard title="Monthly Growth" data={sales.monthlyGrowth}>
                <EnterpriseLineChart data={sales.monthlyGrowth} valueFormat="currency" />
              </TrendChartCard>
            </ChartGrid>
          </ChartSection>

          <ChartSection title="Dimensional Breakdown" description="Region, category, and payment method">
            <ChartGrid>
              <ComparisonChartCard title="Sales by Region" data={sales.byRegion}>
                <EnterpriseDonutChart data={sales.byRegion} valueFormat="currency" />
              </ComparisonChartCard>
              <ComparisonChartCard title="Sales by Category" data={sales.byCategory}>
                <EnterpriseBarChart data={sales.byCategory} valueFormat="currency" horizontal />
              </ComparisonChartCard>
              <ComparisonChartCard title="Payment Method Distribution" data={sales.byPayment}>
                <EnterprisePieChart data={sales.byPayment} valueFormat="percent" />
              </ComparisonChartCard>
              <ComparisonChartCard title="Store Revenue Comparison" data={sales.storeComparison}>
                <EnterpriseBarChart data={sales.storeComparison} valueFormat="currency" />
              </ComparisonChartCard>
            </ChartGrid>
          </ChartSection>

          <ChartSection title="Sales Days Analysis">
            <ChartGrid>
              <ComparisonChartCard title="Top Sales Days" data={sales.topSalesDays}>
                <EnterpriseBarChart data={sales.topSalesDays} valueFormat="currency" />
              </ComparisonChartCard>
              <ComparisonChartCard title="Low Sales Days" data={sales.lowSalesDays}>
                <EnterpriseBarChart data={sales.lowSalesDays} valueFormat="currency" />
              </ComparisonChartCard>
            </ChartGrid>
          </ChartSection>
        </>
      )}
    </AnalyticsDashboardLayout>
  )
}
