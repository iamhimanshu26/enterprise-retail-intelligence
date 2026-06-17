import { ErrorState } from '@/components/design-system'
import { EnterpriseAreaChart, EnterpriseBarChart, EnterpriseLineChart, EnterpriseStackedBarChart } from '../charts'
import { ComparisonChartCard, DistributionChartCard, TrendChartCard } from '../containers'
import { AnalyticsDashboardLayout, ChartGrid, ChartSection, InsightSummaryPanel } from '../dashboard'
import { useInteractiveDashboardData } from '../hooks/useInteractiveDashboardData'
import type { DashboardViewProps } from './types'

export function EtlQualityDashboard({
  title = 'ETL Quality Dashboard',
  breadcrumb = 'ETL Quality',
}: DashboardViewProps = {}) {
  const { data, isLoading, isFetching, error, refetch } = useInteractiveDashboardData()
  const etl = data?.etlQuality

  if (error) {
    return <ErrorState title="ETL quality dashboard unavailable" message={String(error)} onRetry={() => refetch()} />
  }

  return (
    <AnalyticsDashboardLayout
      title={title}
      description="Data quality dimensions, pipeline execution, and lineage overview."
      badge={{ status: 'in-progress', label: 'Sprint 6.2' }}
      breadcrumb={breadcrumb}
      loading={isLoading}
      onRefresh={() => refetch()}
      refreshing={isFetching}
      insight={
        etl ? (
          <InsightSummaryPanel summary="Six quality dimensions, failed record trends, and pipeline execution duration." tags={['ETL', 'Data Quality']} />
        ) : undefined
      }
    >
      {etl && (
        <>
          <ChartSection title="Quality Dimensions">
            <ChartGrid>
              <DistributionChartCard title="Quality Score Dimensions" data={etl.dimensions}>
                <EnterpriseBarChart data={etl.dimensions} valueFormat="percent" />
              </DistributionChartCard>
              <TrendChartCard title="Quality Score Trend" data={etl.qualityTrend}>
                <EnterpriseAreaChart data={etl.qualityTrend} valueFormat="percent" />
              </TrendChartCard>
            </ChartGrid>
          </ChartSection>
          <ChartSection title="Pipeline Execution">
            <ChartGrid>
              <ComparisonChartCard title="Failed Records Trend" data={etl.failedRecordsTrend}>
                <EnterpriseStackedBarChart data={etl.failedRecordsTrend} />
              </ComparisonChartCard>
              <ComparisonChartCard title="Execution Duration" data={etl.executionDuration}>
                <EnterpriseLineChart data={etl.executionDuration} />
              </ComparisonChartCard>
              <ComparisonChartCard title="Data Lineage (placeholder)" data={etl.lineagePlaceholder}>
                <EnterpriseBarChart data={etl.lineagePlaceholder} valueFormat="percent" />
              </ComparisonChartCard>
            </ChartGrid>
          </ChartSection>
        </>
      )}
    </AnalyticsDashboardLayout>
  )
}
