import { ShieldCheck } from 'lucide-react'
import { MetricCard } from '@/components/design-system'
import { GeneratorCard } from '@/features/generator/components/GeneratorCard'
import type { DatasetHealth } from '@/types/statistics'

interface DatasetHealthCardProps {
  health: DatasetHealth
}

export function DatasetHealthCard({ health }: DatasetHealthCardProps) {
  return (
    <GeneratorCard
      title="Dataset Health"
      description="Quality metrics aligned with Phase 4 ETL engine"
      icon={<ShieldCheck className="h-5 w-5" />}
    >
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <MetricCard label="Total records" value={health.total_records.toLocaleString()} />
        <MetricCard label="Valid records" value={health.valid_records.toLocaleString()} />
        <MetricCard label="Null %" value={`${health.null_percentage.toFixed(1)}%`} />
        <MetricCard label="Duplicate %" value={`${health.duplicate_percentage.toFixed(1)}%`} />
        <MetricCard label="Completeness" value={`${health.completeness_pct.toFixed(1)}%`} />
        <MetricCard label="Data Quality Index" value={`${health.data_quality_index.toFixed(1)}%`} />
      </div>
    </GeneratorCard>
  )
}
