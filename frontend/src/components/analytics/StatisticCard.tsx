import { cn } from '@/lib/cn'

interface StatisticCardProps {
  test: string
  statistic?: string
  pValue?: string
  className?: string
}

export function StatisticCard({
  test,
  statistic = '—',
  pValue = '—',
  className,
}: StatisticCardProps) {
  return (
    <div className={cn('rounded-xl border border-border/80 bg-card p-5 shadow-sm', className)}>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{test}</p>
      <p className="mt-2 text-xl font-semibold">{statistic}</p>
      <p className="mt-1 text-xs text-muted-foreground">p-value: {pValue}</p>
    </div>
  )
}
