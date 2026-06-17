import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { DashboardSection } from '@/components/analytics'
import { MetricCard, SectionContainer } from '@/components/design-system'
import { getAnalyticsKpis } from '@/lib/dataServiceApi'
import { KPI_BASE_VALUES } from '@/data/mock/kpis'

export function BusinessAnalyticsSection() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['executive-analytics-kpis'],
    queryFn: getAnalyticsKpis,
    staleTime: 60_000,
    retry: 1,
  })

  const fallbackRevenue = KPI_BASE_VALUES.revenue.value
  const fallbackMargin = KPI_BASE_VALUES.margin.value

  const revenueMetric = data?.metrics.find((m) => m.id === 'total_revenue')
  const marginMetric = data?.metrics.find((m) => m.id === 'gross_margin')
  const ordersMetric = data?.metrics.find((m) => m.id === 'total_orders')
  const growthMetric = data?.metrics.find((m) => m.id === 'sales_growth')

  return (
    <DashboardSection
      title="Business Analytics Engine"
      description="Live KPIs from Sprint 5.2 analytics service — falls back to mock when API is offline."
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Revenue"
          value={
            revenueMetric
              ? `¥${revenueMetric.value.toLocaleString()}`
              : `¥${fallbackRevenue.toLocaleString()}`
          }
        />
        <MetricCard
          label="Gross Margin"
          value={
            marginMetric ? `${marginMetric.value.toFixed(1)}%` : `${fallbackMargin.toFixed(1)}%`
          }
        />
        <MetricCard
          label="Total Orders"
          value={ordersMetric ? String(Math.round(ordersMetric.value)) : String(KPI_BASE_VALUES.orders.value)}
        />
        <MetricCard
          label="Sales Growth"
          value={
            growthMetric
              ? `${growthMetric.value.toFixed(1)}%`
              : `${KPI_BASE_VALUES.growth.value.toFixed(1)}%`
          }
        />
      </div>

      <SectionContainer
        title="Analytics Modules"
        description={
          isError
            ? 'Data service offline — using executive mock KPIs. Start the Python service for live analytics.'
            : isLoading
              ? 'Loading analytics KPIs…'
              : 'Connected to /api/v1/analytics/kpis'
        }
      >
        <div className="flex flex-wrap gap-3 text-sm">
          {['Sales', 'Stores', 'Products', 'Customers', 'Inventory', 'Suppliers', 'Promotions'].map(
            (module) => (
              <span
                key={module}
                className="rounded-md border border-border/80 bg-muted/30 px-3 py-1.5 font-medium"
              >
                {module}
              </span>
            ),
          )}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Explore full analytics in{' '}
          <Link to="/sales" className="font-medium text-primary hover:underline">
            Sales Intelligence
          </Link>
          ,{' '}
          <Link to="/inventory" className="font-medium text-primary hover:underline">
            Inventory
          </Link>
          , and related modules.
        </p>
      </SectionContainer>
    </DashboardSection>
  )
}
