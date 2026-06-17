import { Loader2, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Breadcrumb, ErrorState, PageHeader, TableSkeleton } from '@/components/design-system'
import {
  EnterpriseAreaChart,
  EnterpriseBarChart,
  EnterpriseDonutChart,
  EnterpriseHeatMap,
  EnterpriseLineChart,
  EnterprisePieChart,
  EnterpriseScatterPlot,
  EnterpriseStackedBarChart,
} from '../charts'
import {
  ComparisonChartCard,
  DistributionChartCard,
  MetricChartCard,
  TrendChartCard,
  VisualizationSection,
} from '../containers'
import { useChartData } from '../hooks/useChartData'
import { formatChartValue } from '../utils/chartFormatter'

export function VisualizationStudio() {
  const { data, isLoading, isFetching, error, refetch } = useChartData()

  if (error) {
    return (
      <ErrorState
        title="Visualization data unavailable"
        message={error instanceof Error ? error.message : 'Failed to load chart data'}
        onRetry={() => refetch()}
      />
    )
  }

  const totalRevenue = data?.revenue.monthly.reduce((sum, p) => sum + p.value, 0) ?? 0

  return (
    <div className="space-y-10">
      <PageHeader
        title="Visualization Studio"
        description="Enterprise chart framework — reusable visualization components"
        badge={{ status: 'completed', label: 'Sprint 6.1' }}
      />
      <Breadcrumb items={[{ label: 'Visualization Studio' }]} />

      <div className="flex flex-wrap items-center gap-3">
        <Link
          to="/executive-visualization"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Executive Visualization Studio
        </Link>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          Refresh charts
        </button>
        <span className="text-xs text-muted-foreground">
          Data source: {data?.source === 'live' ? 'Analytics + Statistics APIs' : 'Loading…'}
        </span>
      </div>

      {isLoading || !data ? (
        <TableSkeleton rows={6} />
      ) : (
        <>
          <VisualizationSection title="Revenue Charts" description="Sales breakdowns from business analytics.">
            <TrendChartCard title="Daily Revenue" data={data.revenue.daily} onRefresh={() => refetch()}>
              <EnterpriseAreaChart data={data.revenue.daily} valueFormat="currency" />
            </TrendChartCard>
            <ComparisonChartCard title="Revenue by Store" data={data.revenue.byStore}>
              <EnterpriseBarChart data={data.revenue.byStore.slice(0, 8)} valueFormat="currency" horizontal />
            </ComparisonChartCard>
          </VisualizationSection>

          <VisualizationSection title="Customer Charts" description="Segmentation and membership distribution.">
            <DistributionChartCard title="Customer Segments" data={data.customer.segments}>
              <EnterpriseDonutChart data={data.customer.segments} valueFormat="currency" />
            </DistributionChartCard>
            <DistributionChartCard title="Membership Tiers" data={data.customer.membership}>
              <EnterprisePieChart data={data.customer.membership} valueFormat="percent" />
            </DistributionChartCard>
          </VisualizationSection>

          <VisualizationSection title="Product Charts" description="Product and category performance.">
            <ComparisonChartCard title="Top Products by Revenue" data={data.product.topRevenue}>
              <EnterpriseBarChart data={data.product.topRevenue.slice(0, 8)} valueFormat="currency" />
            </ComparisonChartCard>
            <DistributionChartCard title="Category Performance" data={data.product.categoryPerformance}>
              <EnterpriseStackedBarChart data={data.product.categoryPerformance.slice(0, 6)} valueFormat="currency" />
            </DistributionChartCard>
          </VisualizationSection>

          <VisualizationSection title="Inventory Charts" description="Stock risk and category exposure.">
            <MetricChartCard
              title="Inventory Risk Heat Map"
              metricLabel="Reorder candidates"
              metricValue={String(data.inventory.reorderHeatmap.length)}
              data={data.inventory.reorderHeatmap}
            >
              <EnterpriseHeatMap data={data.inventory.reorderHeatmap.slice(0, 8)} />
            </MetricChartCard>
            <ComparisonChartCard title="Category Stock Exposure" data={data.inventory.categoryExposure}>
              <EnterpriseScatterPlot data={data.inventory.categoryExposure} valueFormat="currency" />
            </ComparisonChartCard>
          </VisualizationSection>

          <VisualizationSection title="Regional Charts" description="Regional revenue contribution.">
            <DistributionChartCard title="Revenue by Region" data={data.regional}>
              <EnterpriseDonutChart data={data.regional} valueFormat="currency" />
            </DistributionChartCard>
            <ComparisonChartCard title="Regional Comparison" data={data.regional}>
              <EnterpriseBarChart data={data.regional} valueFormat="currency" />
            </ComparisonChartCard>
          </VisualizationSection>

          <VisualizationSection title="Time-Series Charts" description="Statistics engine time-series outputs.">
            <TrendChartCard title="Monthly Revenue Trend" data={data.timeSeries.monthly}>
              <EnterpriseLineChart data={data.timeSeries.monthly} valueFormat="currency" />
            </TrendChartCard>
            <TrendChartCard title="Quarterly Revenue" data={data.timeSeries.quarterly}>
              <EnterpriseAreaChart data={data.timeSeries.quarterly} valueFormat="currency" />
            </TrendChartCard>
          </VisualizationSection>

          <VisualizationSection title="KPI Charts" description="Enterprise KPI overview.">
            <MetricChartCard
              title="KPI Overview"
              metricLabel="Total monthly revenue (sample)"
              metricValue={formatChartValue(totalRevenue, 'currency')}
              data={data.kpi}
            >
              <EnterpriseBarChart data={data.kpi.slice(0, 8)} horizontal />
            </MetricChartCard>
            <ComparisonChartCard title="KPI Comparison" data={data.kpi.slice(0, 6)}>
              <EnterpriseBarChart data={data.kpi.slice(0, 6)} showLegend />
            </ComparisonChartCard>
          </VisualizationSection>
        </>
      )}
    </div>
  )
}
