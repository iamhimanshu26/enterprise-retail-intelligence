import { memo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  DollarSign,
  Package,
  Percent,
  ShoppingCart,
  Sparkles,
  Store,
  TrendingUp,
  Users,
  Warehouse,
} from 'lucide-react'
import {
  Breadcrumb,
  ErrorState,
  SectionContainer,
  StatusBadge,
  SystemHealthWidget,
} from '@/components/design-system'
import {
  ActivityFeed,
  AlertPanel,
  ExecutiveSummaryCard,
  FilterToolbar,
  KpiCard,
  RankingTable,
} from '@/components/analytics'
import { useExecutiveDashboard } from '@/hooks/useExecutiveDashboard'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatters'
import type { ProductRow, StoreRow } from '@/types/dashboard'
import {
  BusinessSummaryGrid,
  QuickActionsBar,
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
  const { data, isLoading, isFetching, error, refetch } = useExecutiveDashboard()
  const loading = isLoading || isFetching

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
      {/* Top Header */}
      <motion.header
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/8 via-card to-accent/5 p-8 shadow-sm"
      >
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-accent/5 blur-2xl" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Phase 1 — Executive Dashboard
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Executive Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Real-time business overview for retail executives — {workspace.label} workspace.
              Mock enterprise data; API integration in Phase 2.
            </p>
          </div>
          <QuickActionsBar actions={data?.quickActions ?? []} />
        </div>
      </motion.header>

      <Breadcrumb items={[{ label: 'Executive Dashboard' }]} />

      <FilterToolbar />

      {/* Global KPI Section */}
      <SectionContainer
        title="Global KPIs"
        description="Enterprise-wide performance metrics with period-over-period comparison."
      >
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
        </div>
      </SectionContainer>

      {/* Business Summary Cards */}
      <SectionContainer
        title="Business Summary"
        description="Operational metrics supporting executive decision-making."
      >
        {data && <BusinessSummaryGrid items={data.businessSummary} />}
      </SectionContainer>

      {/* Executive Summary Panel */}
      {data && (
        <ExecutiveSummaryCard
          title="Executive Summary"
          summary={data.executiveSummary.summary}
          highlights={data.executiveSummary.highlights}
        />
      )}

      {/* Charts Section */}
      <SectionContainer
        title="Analytics Overview"
        description="Interactive charts powered by mock data — ready for API integration."
      >
        {data && (
          <div className="grid gap-6 xl:grid-cols-2">
            <RevenueTrendChart data={data.revenueTrend} />
            <MonthlySalesChart data={data.monthlySales} />
            <TopCategoriesChart data={data.topCategories} />
            <StorePerformanceChart data={data.storePerformance} />
            <CustomerGrowthChart data={data.customerGrowth} />
            <RevenueByRegionChart data={data.revenueByRegion} />
            <InventoryDistributionChart data={data.inventoryDistribution} />
          </div>
        )}
      </SectionContainer>

      {/* Regional Performance */}
      <SectionContainer
        title="Regional Performance"
        description="Key regional rankings and growth indicators."
      >
        {data && <RegionalPerformanceGrid highlights={data.regionalHighlights} />}
      </SectionContainer>

      {/* Top Products + Store Ranking */}
      <div className="grid gap-6 xl:grid-cols-2">
        <SectionContainer
          title="Top Products"
          description="Best-performing products with sorting and filtering."
        >
          {data && (
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
          )}
        </SectionContainer>

        <SectionContainer title="Store Rankings" description="Top 10 stores by revenue performance.">
          {data && (
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
          )}
        </SectionContainer>
      </div>

      {/* Insights Section — Business Alerts */}
      <SectionContainer
        title="Business Alerts"
        description="Operational alerts requiring executive attention."
      >
        {data && <AlertPanel alerts={data.alerts} />}
      </SectionContainer>

      {/* Recent Activity */}
      <SectionContainer
        title="Recent Activity"
        description="Enterprise events across reporting, operations, and pipelines."
      >
        {data && <ActivityFeed activities={data.activities} />}
      </SectionContainer>

      {/* System Status */}
      <SectionContainer title="System Status" description="Platform services and module availability.">
        <SystemHealthWidget />
      </SectionContainer>

      {/* Footer note — AppFooter is in AppShell */}
      <p className="text-center text-xs text-muted-foreground">
        Dashboard data is mock-sourced for Phase 1.{' '}
        <Link to="/engineering" className="font-medium text-primary hover:underline">
          View architecture
        </Link>{' '}
        for API integration timeline.
      </p>
    </div>
  )
})
