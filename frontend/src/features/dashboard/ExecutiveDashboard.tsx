import { lazy, memo, Suspense, useMemo } from 'react'
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
import { DashboardChartsSkeleton, ErrorState, SystemHealthWidget } from '@/components/design-system'
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
import { resolveDashboardErrorType } from '@/lib/dashboard-errors'
import { useExecutiveDashboard } from '@/hooks/useExecutiveDashboard'
import { useWorkspaceStore } from '@/stores/workspaceStore'
import { DashboardPageHeader } from './components/DashboardPageHeader'

const BusinessIntelligenceModules = lazy(() =>
  import('./components/BusinessIntelligenceModules').then((module) => ({
    default: module.BusinessIntelligenceModules,
  })),
)

const DashboardChartsSection = lazy(() =>
  import('./components/DashboardChartsSection').then((module) => ({
    default: module.DashboardChartsSection,
  })),
)

const KPI_ICONS: Record<string, React.ReactNode> = {
  revenue: <DollarSign className="h-4 w-4" aria-hidden="true" />,
  orders: <ShoppingCart className="h-4 w-4" aria-hidden="true" />,
  customers: <Users className="h-4 w-4" aria-hidden="true" />,
  stores: <Store className="h-4 w-4" aria-hidden="true" />,
  products: <Package className="h-4 w-4" aria-hidden="true" />,
  margin: <Percent className="h-4 w-4" aria-hidden="true" />,
  inventory: <Warehouse className="h-4 w-4" aria-hidden="true" />,
  growth: <TrendingUp className="h-4 w-4" aria-hidden="true" />,
}

const KPI_PLACEHOLDERS = Array.from({ length: 8 }, (_, i) => i)

export const ExecutiveDashboard = memo(function ExecutiveDashboard() {
  const workspace = useWorkspaceStore((s) => s.getCurrentWorkspace())
  const { data, isLoading, isFetching, error, refetch, dataUpdatedAt } = useExecutiveDashboard()
  const initialLoading = isLoading && !data
  const refreshing = isFetching && !initialLoading

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
        errorType={resolveDashboardErrorType(error)}
        onRetry={() => refetch()}
      />
    )
  }

  return (
    <div className="space-y-8 md:space-y-10">
      <DashboardPageHeader
        title="Executive Dashboard"
        description={`Enterprise business intelligence for retail executives — ${workspace.label} workspace.`}
        badge="Sprint 1.3 — Release Readiness"
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
          {data?.kpis
            ? data.kpis.map((metric, i) => (
                <motion.div
                  key={metric.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <KpiCard metric={metric} icon={KPI_ICONS[metric.id]} loading={refreshing} />
                </motion.div>
              ))
            : KPI_PLACEHOLDERS.map((i) => (
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
              ))}
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

      {data && (
        <Suspense
          fallback={
            <div className="space-y-6" aria-hidden="true">
              <DashboardGrid columns={3}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <KpiCard
                    key={i}
                    metric={{
                      id: `bi-sk-${i}`,
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
                ))}
              </DashboardGrid>
            </div>
          }
        >
          <BusinessIntelligenceModules data={data} loading={refreshing} />
        </Suspense>
      )}

      <DashboardSection
        title="Analytics Overview"
        description="Chart framework with reusable containers — API-ready visualization layer."
      >
        {data ? (
          <Suspense fallback={<DashboardChartsSkeleton count={7} />}>
            <DashboardChartsSection data={data} />
          </Suspense>
        ) : (
          <DashboardChartsSkeleton count={7} />
        )}
      </DashboardSection>

      <DashboardSection title="Quick Actions" description="Navigate to platform modules.">
        {data ? <QuickActionPanel actions={data.quickActions} /> : null}
      </DashboardSection>

      <DashboardSection title="Business Alert Center" description="Priority-filtered operational alerts.">
        <AlertCenter alerts={data?.alerts ?? []} loading={initialLoading} />
      </DashboardSection>

      <DashboardSection title="Activity Center" description="Enterprise events with icons and timestamps.">
        <ActivityTimeline activities={data?.activities ?? []} loading={initialLoading} />
      </DashboardSection>

      <DashboardSection title="System Health" description="Platform services and future module availability.">
        <SystemHealthWidget />
      </DashboardSection>

      <p className="text-center text-xs text-muted-foreground">
        Sprint 1.3 enterprise polish — mock data via{' '}
        <code className="text-foreground">src/data/mock/</code>.{' '}
        <Link to="/engineering" className="font-medium text-primary hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
          View architecture
        </Link>
      </p>
    </div>
  )
})
