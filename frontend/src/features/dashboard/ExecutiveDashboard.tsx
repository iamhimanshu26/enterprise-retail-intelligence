import {
  Breadcrumb,
  CardSkeleton,
  DataTable,
  DateRangeSelector,
  EmptyState,
  MetricCard,
  PageHeader,
  SectionContainer,
  StatusBadge,
} from '@/components/design-system'
import { DollarSign, Package, ShoppingCart, Users } from 'lucide-react'
import { motion } from 'framer-motion'

const PLACEHOLDER_METRICS = [
  { label: 'Total Revenue', value: '—', change: '—', trend: 'neutral' as const, icon: <DollarSign className="h-4 w-4" /> },
  { label: 'Units Sold', value: '—', change: '—', trend: 'neutral' as const, icon: <ShoppingCart className="h-4 w-4" /> },
  { label: 'Active SKUs', value: '—', change: '—', trend: 'neutral' as const, icon: <Package className="h-4 w-4" /> },
  { label: 'Customer Reach', value: '—', change: '—', trend: 'neutral' as const, icon: <Users className="h-4 w-4" /> },
]

const PLACEHOLDER_TABLE = [
  { region: 'North America', revenue: '—', growth: '—', status: 'Pending' },
  { region: 'Europe', revenue: '—', growth: '—', status: 'Pending' },
  { region: 'Asia Pacific', revenue: '—', growth: '—', status: 'Pending' },
]

export function ExecutiveDashboard() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Executive Dashboard"
        description="High-level performance overview across all retail operations. Analytics available in Phase 2."
        badge={{ status: 'foundation', label: 'Phase 0' }}
        actions={<DateRangeSelector />}
      />

      <Breadcrumb items={[{ label: 'Executive Dashboard' }]} />

      <SectionContainer title="Key Performance Indicators" description="Metrics will populate after ETL and analytics phases.">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {PLACEHOLDER_METRICS.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <MetricCard {...metric} />
            </motion.div>
          ))}
        </div>
      </SectionContainer>

      <div className="grid gap-6 lg:grid-cols-2">
        <SectionContainer title="Revenue Overview" description="Interactive charts coming in Phase 2.">
          <EmptyState
            title="Analytics Not Yet Available"
            description="Revenue visualization will be enabled once the ETL pipeline and analytics engine are implemented in future phases."
          />
        </SectionContainer>

        <SectionContainer title="Regional Performance" description="Placeholder data structure for future integration.">
          <DataTable
            columns={[
              { key: 'region', header: 'Region' },
              { key: 'revenue', header: 'Revenue' },
              { key: 'growth', header: 'Growth' },
              {
                key: 'status',
                header: 'Status',
                render: () => <StatusBadge status="planned" label="Phase 2" />,
              },
            ]}
            data={PLACEHOLDER_TABLE}
          />
        </SectionContainer>
      </div>

      <SectionContainer title="System Status" description="Platform foundation services.">
        <div className="grid gap-4 sm:grid-cols-3">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </SectionContainer>
    </div>
  )
}
