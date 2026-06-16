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
import { ErrorState, SystemHealthWidget } from '@/components/design-system'
import {
  ActivityTimeline,
  DashboardGrid,
  DashboardSection,
  FilterToolbar,
  KpiCard,
  QuickActionPanel,
  SummaryCard,
} from '@/components/analytics'
import { AlertCenter } from '@/components/analytics/bi'
import { useExecutiveDashboard } from '@/hooks/useExecutiveDashboard'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { BusinessIntelligenceModules } from './components/BusinessIntelligenceModules'
import { DashboardPageHeader } from './components/DashboardPageHeader'
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
        description={`Enterprise business intelligence for retail executives — ${workspace.label} workspace.`}
        badge="Sprint 1.2 — Business Intelligence"
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

      {data && <BusinessIntelligenceModules data={data} loading={loading} />}

      <DashboardSection
        title="Analytics Overview"
        description="Chart framework with reusable containers — API-ready visualization layer."
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

      <DashboardSection title="Quick Actions" description="Navigate to platform modules.">
        {data && <QuickActionPanel actions={data.quickActions} />}
      </DashboardSection>

      <DashboardSection title="Business Alert Center" description="Priority-filtered operational alerts.">
        {data && <AlertCenter alerts={data.alerts} />}
      </DashboardSection>

      <DashboardSection title="Activity Center" description="Enterprise events with icons and timestamps.">
        {data && <ActivityTimeline activities={data.activities} />}
      </DashboardSection>

      <DashboardSection title="System Health" description="Platform services and future module availability.">
        <SystemHealthWidget />
      </DashboardSection>

      <p className="text-center text-xs text-muted-foreground">
        Sprint 1.2 business intelligence — mock data via{' '}
        <code className="text-foreground">src/data/mock/</code>.{' '}
        <Link to="/engineering" className="font-medium text-primary hover:underline">
          View architecture
        </Link>
      </p>
    </div>
  )
})
