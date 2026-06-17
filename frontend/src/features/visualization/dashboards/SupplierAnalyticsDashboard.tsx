import { ErrorState } from '@/components/design-system'
import { EnterpriseBarChart, EnterpriseDonutChart, EnterpriseLineChart } from '../charts'
import { ComparisonChartCard, DistributionChartCard } from '../containers'
import { AnalyticsDashboardLayout, ChartGrid, ChartSection, InsightSummaryPanel } from '../dashboard'
import { useInteractiveDashboardData } from '../hooks/useInteractiveDashboardData'
import type { DashboardViewProps } from './types'

export function SupplierAnalyticsDashboard({
  title = 'Supplier Analytics Dashboard',
  breadcrumb = 'Supplier Analytics',
}: DashboardViewProps = {}) {
  const { data, isLoading, isFetching, error, refetch } = useInteractiveDashboardData()
  const supplier = data?.supplier

  if (error) {
    return <ErrorState title="Supplier dashboard unavailable" message={String(error)} onRetry={() => refetch()} />
  }

  return (
    <AnalyticsDashboardLayout
      title={title}
      description="Reliability, risk ranking, contribution, and delivery performance."
      badge={{ status: 'in-progress', label: 'Sprint 6.2' }}
      breadcrumb={breadcrumb}
      loading={isLoading}
      onRefresh={() => refetch()}
      refreshing={isFetching}
      insight={
        supplier ? (
          <InsightSummaryPanel summary="Supplier reliability scores, risk rankings, and contribution analysis." tags={['Suppliers', 'Supply Chain']} />
        ) : undefined
      }
    >
      {supplier && (
        <>
          <ChartSection title="Supplier Performance">
            <ChartGrid>
              <ComparisonChartCard title="Supplier Reliability" data={supplier.reliability}>
                <EnterpriseBarChart data={supplier.reliability} valueFormat="percent" horizontal />
              </ComparisonChartCard>
              <ComparisonChartCard title="Supplier Risk Ranking" data={supplier.riskRanking}>
                <EnterpriseBarChart data={supplier.riskRanking} horizontal />
              </ComparisonChartCard>
              <ComparisonChartCard title="Revenue Contribution" data={supplier.contribution}>
                <EnterpriseDonutChart data={supplier.contribution} valueFormat="percent" />
              </ComparisonChartCard>
              <ComparisonChartCard title="Product Count by Supplier" data={supplier.productCount}>
                <EnterpriseBarChart data={supplier.productCount} />
              </ComparisonChartCard>
            </ChartGrid>
          </ChartSection>
          <ChartSection title="Regional & Delivery">
            <ChartGrid>
              <DistributionChartCard title="Supplier Region Distribution" data={supplier.regionDistribution}>
                <EnterpriseDonutChart data={supplier.regionDistribution} valueFormat="currency" />
              </DistributionChartCard>
              <ComparisonChartCard title="Delivery Delay (placeholder)" data={supplier.deliveryDelay}>
                <EnterpriseLineChart data={supplier.deliveryDelay} />
              </ComparisonChartCard>
            </ChartGrid>
          </ChartSection>
        </>
      )}
    </AnalyticsDashboardLayout>
  )
}
