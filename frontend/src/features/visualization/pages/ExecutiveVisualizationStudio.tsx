import { Breadcrumb, ErrorState, PageHeader, SectionContainer, TableSkeleton } from '@/components/design-system'
import { TrendChartCard } from '../containers/TrendChartCard'
import { EnterpriseAreaChart } from '../charts'
import { useExecutiveVisualizationData } from '../hooks/useExecutiveVisualizationData'
import {
  AnomalyVisualizationSection,
  BusinessHealthVisualization,
  DashboardGallery,
  ExecutiveVisualizationOverview,
  KpiPerformanceBoard,
  RecommendationImpactSection,
  TargetVsActualSection,
  VisualizationMethodologyPanel,
  VisualizationPresentationToolbar,
} from '../studio'

export function ExecutiveVisualizationStudio() {
  const { data, isLoading, isFetching, error, refetch } = useExecutiveVisualizationData()

  if (error) {
    return (
      <ErrorState
        title="Executive visualization unavailable"
        message={error instanceof Error ? error.message : 'Failed to load visualization data'}
        onRetry={() => refetch()}
      />
    )
  }

  return (
    <div className="space-y-10">
      <PageHeader
        title="Executive Visualization Studio"
        description="Premium BI experience — KPI performance, benchmarks, business health, anomalies, and enterprise dashboard gallery."
        badge={{ status: 'completed', label: 'Sprint 6.3 · Phase 6 Complete' }}
      />
      <Breadcrumb items={[{ label: 'Executive Visualization Studio' }]} />

      <VisualizationPresentationToolbar onRefresh={() => refetch()} refreshing={isFetching} />

      <ExecutiveVisualizationOverview />

      {isLoading || !data ? (
        <TableSkeleton rows={8} />
      ) : (
        <>
          <SectionContainer
            title="KPI Performance Board"
            description="Current value, target, achievement, status, and mini trend for core enterprise metrics."
          >
            <KpiPerformanceBoard items={data.kpiBoard} />
          </SectionContainer>

          <SectionContainer
            title="Target vs Actual"
            description="Benchmark comparison across revenue, profit, orders, customers, and return rate."
          >
            <TargetVsActualSection metrics={data.targetVsActual} />
          </SectionContainer>

          <SectionContainer
            title="Trend Comparison"
            description="Monthly revenue trend from statistics and analytics adapters."
          >
            <TrendChartCard title="Revenue Trend Comparison" data={data.trendComparison}>
              <EnterpriseAreaChart data={data.trendComparison} valueFormat="currency" />
            </TrendChartCard>
          </SectionContainer>

          <BusinessHealthVisualization health={data.businessHealth} />

          <AnomalyVisualizationSection anomalies={data.anomalies} />

          <RecommendationImpactSection recommendations={data.recommendations} />

          <DashboardGallery />

          <VisualizationMethodologyPanel />
        </>
      )}
    </div>
  )
}
