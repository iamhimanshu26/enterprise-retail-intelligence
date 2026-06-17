import { ErrorState } from '@/components/design-system'
import { EnterpriseBarChart, EnterpriseDonutChart, EnterpriseStackedBarChart } from '../charts'
import { ComparisonChartCard, DistributionChartCard, MetricChartCard } from '../containers'
import { AnalyticsDashboardLayout, ChartGrid, ChartSection, InsightSummaryPanel } from '../dashboard'
import { useInteractiveDashboardData } from '../hooks/useInteractiveDashboardData'
import type { DashboardViewProps } from './types'

export function ExecutiveIntelligenceDashboardView({
  title = 'Executive Intelligence Dashboard',
  breadcrumb = 'Executive Intelligence',
}: DashboardViewProps = {}) {
  const { data, isLoading, isFetching, error, refetch } = useInteractiveDashboardData()
  const executive = data?.executive

  if (error) {
    return <ErrorState title="Executive dashboard unavailable" message={String(error)} onRetry={() => refetch()} />
  }

  const healthScore = executive?.businessHealth[0]?.value ?? 0

  return (
    <AnalyticsDashboardLayout
      title={title}
      description="Business health, KPI status, benchmarks, anomalies, and scorecard visualization."
      badge={{ status: 'in-progress', label: 'Sprint 6.2' }}
      breadcrumb={breadcrumb}
      loading={isLoading}
      onRefresh={() => refetch()}
      refreshing={isFetching}
      insight={
        executive ? (
          <InsightSummaryPanel summary="Executive intelligence outputs visualized for business health monitoring and decision support." tags={['Executive', 'Intelligence']} />
        ) : undefined
      }
    >
      {executive && (
        <>
          <ChartSection title="Business Health">
            <ChartGrid>
              <MetricChartCard
                title="Business Health Score"
                metricLabel="Overall Score"
                metricValue={`${healthScore.toFixed(0)} / 100`}
                data={executive.businessHealth}
              >
                <EnterpriseBarChart data={executive.businessHealth} valueFormat="percent" horizontal />
              </MetricChartCard>
              <DistributionChartCard title="KPI Status Distribution" data={executive.kpiStatusDistribution}>
                <EnterpriseDonutChart data={executive.kpiStatusDistribution} />
              </DistributionChartCard>
            </ChartGrid>
          </ChartSection>
          <ChartSection title="Benchmarks & Anomalies">
            <ChartGrid>
              <ComparisonChartCard title="Target vs Actual" data={executive.targetVsActual}>
                <EnterpriseStackedBarChart data={executive.targetVsActual} valueFormat="currency" />
              </ComparisonChartCard>
              <DistributionChartCard title="Anomaly Severity" data={executive.anomalySeverity}>
                <EnterpriseBarChart data={executive.anomalySeverity} />
              </DistributionChartCard>
            </ChartGrid>
          </ChartSection>
          <ChartSection title="Recommendations & Scorecard">
            <ChartGrid>
              <DistributionChartCard title="Recommendation Categories" data={executive.recommendationCategories}>
                <EnterpriseDonutChart data={executive.recommendationCategories} />
              </DistributionChartCard>
              <ComparisonChartCard title="Executive Scorecard" data={executive.scorecard}>
                <EnterpriseBarChart data={executive.scorecard} valueFormat="percent" horizontal />
              </ComparisonChartCard>
            </ChartGrid>
          </ChartSection>
        </>
      )}
    </AnalyticsDashboardLayout>
  )
}
