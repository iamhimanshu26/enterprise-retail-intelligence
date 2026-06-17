import { ErrorState } from '@/components/design-system'
import {
  EnterpriseAreaChart,
  EnterpriseBarChart,
  EnterpriseDonutChart,
  EnterpriseHeatMap,
  EnterprisePieChart,
} from '../charts'
import { ComparisonChartCard, DistributionChartCard, TrendChartCard } from '../containers'
import { AnalyticsDashboardLayout, ChartGrid, ChartSection, InsightSummaryPanel } from '../dashboard'
import { useInteractiveDashboardData } from '../hooks/useInteractiveDashboardData'
import type { DashboardViewProps } from './types'

export function InventoryAnalyticsDashboard({
  title = 'Inventory Analytics Dashboard',
  breadcrumb = 'Inventory Analytics',
}: DashboardViewProps = {}) {
  const { data, isLoading, isFetching, error, refetch } = useInteractiveDashboardData()
  const inventory = data?.inventory

  if (error) {
    return <ErrorState title="Inventory dashboard unavailable" message={String(error)} onRetry={() => refetch()} />
  }

  return (
    <AnalyticsDashboardLayout
      title={title}
      description="Stock risk, movement distribution, and reorder intelligence."
      badge={{ status: 'in-progress', label: 'Sprint 6.2' }}
      breadcrumb={breadcrumb}
      loading={isLoading}
      onRefresh={() => refetch()}
      refreshing={isFetching}
      insight={
        inventory ? (
          <InsightSummaryPanel summary="Inventory value trends, stock risk heatmap, and reorder candidate monitoring." tags={['Inventory', 'Stock Risk']} />
        ) : undefined
      }
    >
      {inventory && (
        <>
          <ChartSection title="Inventory Overview">
            <ChartGrid>
              <TrendChartCard title="Inventory Value Trend" data={inventory.inventoryValueTrend}>
                <EnterpriseAreaChart data={inventory.inventoryValueTrend} valueFormat="currency" />
              </TrendChartCard>
              <DistributionChartCard title="Inventory Status Breakdown" data={inventory.statusBreakdown}>
                <EnterpriseDonutChart data={inventory.statusBreakdown} />
              </DistributionChartCard>
            </ChartGrid>
          </ChartSection>
          <ChartSection title="Stock Risk">
            <ChartGrid>
              <ComparisonChartCard title="Low Stock" data={inventory.lowStock}>
                <EnterprisePieChart data={inventory.lowStock} showLegend={false} />
              </ComparisonChartCard>
              <ComparisonChartCard title="Overstock" data={inventory.overstock}>
                <EnterprisePieChart data={inventory.overstock} showLegend={false} />
              </ComparisonChartCard>
              <DistributionChartCard title="Product Movement" data={inventory.movementDistribution}>
                <EnterpriseBarChart data={inventory.movementDistribution} />
              </DistributionChartCard>
              <DistributionChartCard title="Stock Risk Heatmap" data={inventory.stockRiskHeatmap}>
                <EnterpriseHeatMap data={inventory.stockRiskHeatmap} />
              </DistributionChartCard>
            </ChartGrid>
          </ChartSection>
          {inventory.reorderTable.length > 0 && (
            <ChartSection title="Reorder Candidates" description="Products at or below reorder level">
              <div className="overflow-x-auto rounded-xl border border-border/80">
                <table className="w-full min-w-[480px] text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30 text-left text-xs uppercase text-muted-foreground">
                      <th className="px-4 py-3">Product</th>
                      <th className="px-4 py-3">On Hand</th>
                      <th className="px-4 py-3">Reorder Level</th>
                      <th className="px-4 py-3">Risk</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.reorderTable.map((row) => (
                      <tr key={row.product_code} className="border-b border-border/40">
                        <td className="px-4 py-3 font-medium">{row.product_code}</td>
                        <td className="px-4 py-3">{row.stock_on_hand}</td>
                        <td className="px-4 py-3">{row.reorder_level}</td>
                        <td className="px-4 py-3">{row.risk_score.toFixed(1)}</td>
                        <td className="px-4 py-3">{row.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ChartSection>
          )}
        </>
      )}
    </AnalyticsDashboardLayout>
  )
}
