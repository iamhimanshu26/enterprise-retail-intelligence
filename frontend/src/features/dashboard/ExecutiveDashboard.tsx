import { memo, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  DollarSign,
  Package,
  Percent,
  ShoppingCart,
  Store,
  TrendingUp,
  Users,
  Warehouse,
} from 'lucide-react'
import { ErrorState, StatusBadge, SystemHealthWidget } from '@/components/design-system'
import {
  ActivityTimeline,
  AlertPanel,
  DashboardGrid,
  DashboardSection,
  FilterToolbar,
  KpiCard,
  QuickActionPanel,
  RankingTable,
  SummaryCard,
} from '@/components/analytics'
import { useExecutiveDashboard } from '@/hooks/useExecutiveDashboard'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatters'
import type { ProductRow, StoreRow } from '@/types/dashboard'
import { DashboardPageHeader } from './components/DashboardPageHeader'
import {
  BusinessSummaryGrid,
  RegionalPerformanceGrid,
} from './components/DashboardSections'
import {
  CustomerGrowthChart,
  InventoryDistributionChart,
  MonthlySalesChart,
  RevenueByRegionChart,
  RevenueTrendChart,
  StorePerformanceChart,
  TopCategoriesChart,
} from './components/DashboardCharts'

const KPI_ICONS: Record<string, React.ReactNode> = {
  revenue: <DollarSign className="h-4 w-4" />,
  orders: <ShoppingCart className="h-4 w-4" />,
  customers: <Users className="h-4 w-4" />,
  stores: <Store className="h-4 w-4" />,
  products: <Package className="h-4 w-4" />,
  margin: <Percent className="h-4 w-4" />,
  inventory: <Warehouse className="h-4 w-4" />,
  growth: <TrendingUp className="h-4 w-4" />,
}

const PRODUCT_STATUS_MAP = {
  active: { status: 'completed' as const, label: 'Active' },
  'low-stock': { status: 'in-progress' as const, label: 'Low Stock' },
  discontinued: { status: 'planned' as const, label: 'Discontinued' },
  promoted: { status: 'foundation' as const, label: 'Promoted' },
}

const STORE_PERFORMANCE_MAP = {
  excellent: { status: 'completed' as const, label: 'Excellent' },
  good: { status: 'foundation' as const, label: 'Good' },
  average: { status: 'in-progress' as const, label: 'Average' },
  underperforming: { status: 'planned' as const, label: 'Below Target' },
}

export const ExecutiveDashboard = memo(function ExecutiveDashboard() {
  const workspace = useWorkspaceStore((s) => s.getCurrentWorkspace())
  const { data, isLoading, isFetching, error, refetch, dataUpdatedAt } = useExecutiveDashboard()
  const loading = isLoading || isFetching

  const lastUpdated = useMemo(() => {
    if (!dataUpdatedAt) return undefined
    return new Date(dataUpdatedAt).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  }, [dataUpdatedAt])

  if (error) {
    return (
      <ErrorState
        title="Unable to load dashboard"
        message="Executive dashboard data could not be retrieved."
        onRetry={() => refetch()}
      />
    )
  }

  return (
    <div className="space-y-10">
      <DashboardPageHeader
        title="Executive Dashboard"
        description={`Enterprise business overview for retail executives — ${workspace.label} workspace. Modular dashboard framework with API-ready sections.`}
        lastUpdated={lastUpdated}
        onRefresh={() => refetch()}
        refreshing={isFetching}
      />

      <FilterToolbar />

      <DashboardSection
        title="Global KPIs"
        description="Enterprise-wide performance metrics with period-over-period comparison."
      >
        <DashboardGrid columns={4}>
          {(data?.kpis ?? Array.from({ length: 8 })).map((metric, i) =>
            data?.kpis ? (
              <motion.div
                key={metric.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <KpiCard metric={metric} icon={KPI_ICONS[metric.id]} loading={loading} />
              </motion.div>
            ) : (
              <KpiCard
                key={i}
                metric={{
                  id: `sk-${i}`,
                  label: 'Loading',
                  value: 0,
                  change: 0,
                  trend: 'neutral',
                  comparisonBadge: '',
                  tooltip: '',
                  format: 'number',
                }}
                icon={null}
                loading
              />
            ),
          )}
        </DashboardGrid>
      </DashboardSection>

      {data && (
        <SummaryCard
          title="Executive Summary"
          summary={data.executiveSummary.summary}
          highlights={data.executiveSummary.highlights}
          tags={data.executiveSummary.tags}
          recommendation={data.executiveSummary.recommendation}
        />
      )}

      <DashboardSection
        title="Analytics Overview"
        description="Chart framework with reusable containers — data layer ready for REST API swap."
      >
        {data && (
          <DashboardGrid columns={2}>
            <RevenueTrendChart data={data.revenueTrend} />
            <MonthlySalesChart data={data.monthlySales} />
            <TopCategoriesChart data={data.topCategories} />
            <StorePerformanceChart data={data.storePerformance} />
            <CustomerGrowthChart data={data.customerGrowth} />
            <RevenueByRegionChart data={data.revenueByRegion} />
            <InventoryDistributionChart data={data.inventoryDistribution} />
          </DashboardGrid>
        )}
      </DashboardSection>

      <DashboardSection
        title="Business Widgets"
        description="Operational summaries, regional performance, and ranking tables."
      >
        {data && (
          <div className="space-y-8">
            <BusinessSummaryGrid items={data.businessSummary} />
            <RegionalPerformanceGrid highlights={data.regionalHighlights} />
            <DashboardGrid columns={2}>
              <div>
                <h3 className="mb-4 text-sm font-semibold text-foreground">Top Products</h3>
                <RankingTable<ProductRow>
                  data={data.topProducts}
                  sortKey="revenue"
                  searchKeys={['product', 'category']}
                  searchPlaceholder="Search products or categories..."
                  columns={[
                    { key: 'product', header: 'Product' },
                    { key: 'category', header: 'Category' },
                    {
                      key: 'revenue',
                      header: 'Revenue',
                      render: (row) => formatCurrency(row.revenue, true),
                    },
                    {
                      key: 'unitsSold',
                      header: 'Units Sold',
                      render: (row) => formatNumber(row.unitsSold),
                    },
                    {
                      key: 'growth',
                      header: 'Growth',
                      render: (row) => (
                        <span className={row.growth >= 0 ? 'text-success' : 'text-destructive'}>
                          {formatPercent(row.growth)}
                        </span>
                      ),
                    },
                    {
                      key: 'status',
                      header: 'Status',
                      render: (row) => {
                        const config = PRODUCT_STATUS_MAP[row.status]
                        return <StatusBadge status={config.status} label={config.label} />
                      },
                    },
                  ]}
                />
              </div>
              <div>
                <h3 className="mb-4 text-sm font-semibold text-foreground">Store Rankings</h3>
                <RankingTable<StoreRow>
                  data={data.storeRankings}
                  sortKey="rank"
                  searchKeys={['storeName', 'region']}
                  searchPlaceholder="Search stores..."
                  columns={[
                    { key: 'rank', header: 'Rank' },
                    { key: 'storeName', header: 'Store Name' },
                    { key: 'region', header: 'Region' },
                    {
                      key: 'revenue',
                      header: 'Revenue',
                      render: (row) => formatCurrency(row.revenue, true),
                    },
                    {
                      key: 'orders',
                      header: 'Orders',
                      render: (row) => formatNumber(row.orders),
                    },
                    {
                      key: 'growth',
                      header: 'Growth',
                      render: (row) => (
                        <span className="text-success">{formatPercent(row.growth)}</span>
                      ),
                    },
                    {
                      key: 'performance',
                      header: 'Performance',
                      render: (row) => {
                        const config = STORE_PERFORMANCE_MAP[row.performance]
                        return <StatusBadge status={config.status} label={config.label} />
                      },
                    },
                  ]}
                />
              </div>
            </DashboardGrid>
          </div>
        )}
      </DashboardSection>

      <DashboardSection title="Quick Actions" description="Navigate to platform modules — actions only, no backend execution.">
        {data && <QuickActionPanel actions={data.quickActions} />}
      </DashboardSection>

      <DashboardSection title="Business Alerts" description="Operational alerts requiring executive attention.">
        {data && <AlertPanel alerts={data.alerts} />}
      </DashboardSection>

      <DashboardSection title="Recent Activity" description="Enterprise timeline — foundation and operational events.">
        {data && <ActivityTimeline activities={data.activities} />}
      </DashboardSection>

      <DashboardSection title="System Health" description="Platform services and future module availability.">
        <SystemHealthWidget />
      </DashboardSection>

      <p className="text-center text-xs text-muted-foreground">
        Sprint 1.1 dashboard framework — mock data via{' '}
        <code className="text-foreground">src/data/mock/</code>.{' '}
        <Link to="/engineering" className="font-medium text-primary hover:underline">
          View architecture
        </Link>
      </p>
    </div>
  )
})
