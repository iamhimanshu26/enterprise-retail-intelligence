import { Database } from 'lucide-react'
import { GeneratorCard } from '@/features/generator/components/GeneratorCard'
import type { EtlOverview } from '@/types/etl'

interface WarehouseCardProps {
  overview: EtlOverview
}

export function WarehouseCard({ overview }: WarehouseCardProps) {
  const tables = overview.warehouse_tables ?? []
  const strategies = overview.load_strategies ?? []

  return (
    <GeneratorCard
      title="Analytics Warehouse"
      description="Star schema tables — PostgreSQL and DuckDB targets"
      icon={<Database className="h-5 w-5" />}
    >
      <div className="space-y-3">
        <div className="flex flex-wrap gap-1.5">
          {tables.map((table) => (
            <span
              key={table}
              className="rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
            >
              {table}
            </span>
          ))}
        </div>
        <div className="rounded-lg bg-muted/30 px-3 py-2 text-sm">
          <p className="text-xs text-muted-foreground">Load strategies</p>
          <p className="mt-1 font-medium">{strategies.join(', ')}</p>
        </div>
        <p className="text-xs text-muted-foreground">
          Interfaces ready for Snowflake, BigQuery, Redshift, and Databricks integration.
        </p>
      </div>
    </GeneratorCard>
  )
}
