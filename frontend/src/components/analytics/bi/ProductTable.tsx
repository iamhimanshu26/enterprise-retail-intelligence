import { memo } from 'react'
import { StatusBadge } from '@/components/design-system'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatters'
import type { ProductRow } from '@/types/dashboard'
import { AnalyticsTable } from './AnalyticsTable'

const PRODUCT_STATUS_MAP = {
  active: { status: 'completed' as const, label: 'Active' },
  'low-stock': { status: 'in-progress' as const, label: 'Low Stock' },
  discontinued: { status: 'planned' as const, label: 'Discontinued' },
  promoted: { status: 'foundation' as const, label: 'Promoted' },
}

export const ProductTable = memo(function ProductTable({ data }: { data: ProductRow[] }) {
  return (
    <AnalyticsTable<ProductRow>
      data={data}
      sortKey="revenue"
      searchKeys={['product', 'category']}
      searchPlaceholder="Filter products or categories..."
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
  )
})
