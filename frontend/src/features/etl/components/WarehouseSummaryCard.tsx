import { Boxes } from 'lucide-react'
import { MetricCard } from '@/components/design-system'
import { GeneratorCard } from '@/features/generator/components/GeneratorCard'
import type { WarehouseSummary } from '@/types/etl'

interface WarehouseSummaryCardProps {
  summary: WarehouseSummary | null
}

export function WarehouseSummaryCard({ summary }: WarehouseSummaryCardProps) {
  const data = summary ?? {
    stores: 500,
    products: 120000,
    customers: 2000000,
    suppliers: 5000,
    sales: 15000000,
    returns: 120000,
    tables: {},
    loaded_tables: [],
  }

  const items = [
    { label: 'Stores', value: data.stores },
    { label: 'Products', value: data.products },
    { label: 'Customers', value: data.customers },
    { label: 'Sales', value: data.sales },
    { label: 'Returns', value: data.returns },
  ]

  return (
    <GeneratorCard
      title="Warehouse Summary"
      description="Analytics warehouse row counts"
      icon={<Boxes className="h-5 w-5" />}
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <MetricCard
            key={item.label}
            label={item.label}
            value={item.value.toLocaleString()}
          />
        ))}
      </div>
      {data.loaded_tables.length > 0 && (
        <p className="mt-3 text-xs text-muted-foreground">
          Loaded: {data.loaded_tables.join(', ')}
        </p>
      )}
    </GeneratorCard>
  )
}
