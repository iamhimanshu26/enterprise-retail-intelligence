import { GeneratorCard } from '@/features/generator/components/GeneratorCard'

interface StatsMetricCardProps {
  label: string
  value: string | number
  description?: string
}

export function StatsMetricCard({ label, value, description }: StatsMetricCardProps) {
  return (
    <div className="rounded-xl border border-border/80 bg-card p-4 shadow-sm">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold tracking-tight tabular-nums">{value}</p>
      {description && <p className="mt-1 text-xs text-muted-foreground">{description}</p>}
    </div>
  )
}

interface StatsMetricGridProps {
  title: string
  description?: string
  metrics: StatsMetricCardProps[]
}

export function StatsMetricGrid({ title, description, metrics }: StatsMetricGridProps) {
  return (
    <GeneratorCard title={title} description={description}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((m) => (
          <StatsMetricCard key={m.label} {...m} />
        ))}
      </div>
    </GeneratorCard>
  )
}
