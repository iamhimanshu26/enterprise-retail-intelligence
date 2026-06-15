import {
  Breadcrumb,
  CardSkeleton,
  DataTable,
  DateRangeSelector,
  EmptyState,
  MetricCard,
  SectionContainer,
  StatusBadge,
} from '@/components/design-system'
import { DollarSign, Package, ShoppingCart, Sparkles, Users } from 'lucide-react'
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
    <div className="space-y-10">
      {/* Hero banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-primary/8 via-card to-accent/5 p-8 shadow-sm"
      >
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-accent/5 blur-2xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Phase 0 — Enterprise Foundation
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Executive Dashboard
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              High-level performance overview across all retail operations. Live analytics
              activate in Phase 1.
            </p>
          </div>
          <DateRangeSelector />
        </div>
      </motion.div>

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
        <SectionContainer title="Revenue Overview" description="Interactive charts coming in Phase 6.">
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
                render: () => <StatusBadge status="planned" label="Phase 1" />,
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
