import { memo } from 'react'
import { StatusBadge } from '@/components/design-system'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatters'
import type { StoreRow } from '@/types/dashboard'
import { AnalyticsTable } from './AnalyticsTable'

const STORE_PERFORMANCE_MAP = {
  excellent: { status: 'completed' as const, label: 'Excellent' },
  good: { status: 'foundation' as const, label: 'Good' },
  average: { status: 'in-progress' as const, label: 'Average' },
  underperforming: { status: 'planned' as const, label: 'Below Target' },
}

export const StoreTable = memo(function StoreTable({ data }: { data: StoreRow[] }) {
  return (
    <AnalyticsTable<StoreRow>
      data={data}
      sortKey="rank"
      searchKeys={['storeName', 'region']}
      searchPlaceholder="Filter stores..."
      columns={[
        { key: 'rank', header: 'Rank' },
        { key: 'storeName', header: 'Store Name' },
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
  )
})
