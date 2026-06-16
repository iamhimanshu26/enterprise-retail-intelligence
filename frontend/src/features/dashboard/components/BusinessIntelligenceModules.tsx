import { memo } from 'react'
import { DashboardGrid, DashboardSection } from '@/components/analytics'
import {
  BusinessWidget,
  MetricWidget,
  ProductTable,
  RegionCard,
  StoreTable,
} from '@/components/analytics/bi'
import { AnalyticsTable } from '@/components/analytics/bi/AnalyticsTable'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatters'
import type { ExecutiveDashboardData, RegionPerformanceRow } from '@/types/dashboard'

interface BusinessIntelligenceModulesProps {
  data: ExecutiveDashboardData
  loading?: boolean
}

export const BusinessIntelligenceModules = memo(function BusinessIntelligenceModules({
  data,
  loading,
}: BusinessIntelligenceModulesProps) {
  return (
    <div className="space-y-10">
      <DashboardSection
        title="Sales Intelligence"
        description="Revenue performance across daily, weekly, monthly, quarterly, and yearly horizons."
      >
        <DashboardGrid columns={3}>
          {data.salesRevenue.map((period) => (
            <MetricWidget
              key={period.id}
              label={period.label}
              value={period.revenue}
              change={period.growth}
              trend={period.trend}
              comparisonLabel={period.comparisonLabel}
              format="currency"
              loading={loading}
            />
          ))}
        </DashboardGrid>
      </DashboardSection>

      <DashboardSection
        title="Regional Performance"
        description="Japan regional rankings — revenue, orders, profit, and performance scores."
      >
        <DashboardGrid columns={3}>
          {data.regionPerformance.map((region) => (
            <RegionCard key={region.id} region={region} />
          ))}
        </DashboardGrid>
        <div className="mt-6">
          <AnalyticsTable<RegionPerformanceRow>
            data={data.regionPerformance}
            sortKey="rank"
            searchKeys={['region']}
            searchPlaceholder="Filter regions..."
            columns={[
              { key: 'rank', header: 'Rank' },
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
                key: 'profit',
                header: 'Profit',
                render: (row) => formatCurrency(row.profit, true),
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
              { key: 'performanceScore', header: 'Score' },
            ]}
          />
        </div>
      </DashboardSection>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardSection
          title="Customer Overview"
          description="Enterprise customer metrics from mock intelligence layer."
        >
          <DashboardGrid columns={2}>
            <MetricWidget
              label="Total Customers"
              value={data.customerOverview.totalCustomers}
              format="number"
              loading={loading}
            />
            <MetricWidget
              label="New Customers"
              value={data.customerOverview.newCustomers}
              format="number"
              loading={loading}
            />
            <MetricWidget
              label="Returning Customers"
              value={data.customerOverview.returningCustomers}
              format="number"
              loading={loading}
            />
            <MetricWidget
              label="Customer Growth"
              value={data.customerOverview.customerGrowth}
              trend="up"
              format="percent"
              loading={loading}
            />
            <MetricWidget
              label="Average Order Value"
              value={data.customerOverview.averageOrderValue}
              format="currency"
              loading={loading}
            />
            <MetricWidget
              label="Customer Retention"
              value={data.customerOverview.retentionRate}
              format="percent"
              loading={loading}
            />
          </DashboardGrid>
        </DashboardSection>

        <DashboardSection
          title="Inventory Overview"
          description="Inventory presentation layer — no inventory engine in this sprint."
        >
          <DashboardGrid columns={2}>
            <MetricWidget
              label="Inventory Value"
              value={data.inventoryOverview.inventoryValue}
              format="currency"
              loading={loading}
            />
            <MetricWidget
              label="Low Stock Count"
              value={data.inventoryOverview.lowStockCount}
              format="number"
              trend="down"
              loading={loading}
            />
            <MetricWidget
              label="Overstock Count"
              value={data.inventoryOverview.overstockCount}
              format="number"
              loading={loading}
            />
            <MetricWidget
              label="Out of Stock"
              value={data.inventoryOverview.outOfStockCount}
              format="number"
              trend="down"
              loading={loading}
            />
            <MetricWidget
              label="Fast Moving Products"
              value={data.inventoryOverview.fastMovingCount}
              format="number"
              trend="up"
              loading={loading}
            />
          </DashboardGrid>
        </DashboardSection>
      </div>

      <DashboardSection title="Product Intelligence" description="Top products with sorting and filtering.">
        <ProductTable data={data.topProducts} />
      </DashboardSection>

      <DashboardSection title="Store Performance" description="Top 10 stores by revenue and profit.">
        <StoreTable data={data.storeRankings} />
      </DashboardSection>

      <DashboardSection
        title="Executive Widgets"
        description="Distribution and ranking widgets powered by mock business intelligence data."
      >
        <DashboardGrid columns={3}>
          {data.executiveWidgets.map((widget) => (
            <BusinessWidget key={widget.id} widget={widget} />
          ))}
        </DashboardGrid>
      </DashboardSection>
    </div>
  )
})
