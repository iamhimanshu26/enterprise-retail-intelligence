import { memo } from 'react'
import { cn } from '@/lib/cn'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatters'
import type { RegionPerformanceRow } from '@/types/dashboard'

interface RegionCardProps {
  region: RegionPerformanceRow
  className?: string
}

export const RegionCard = memo(function RegionCard({ region, className }: RegionCardProps) {
  return (
    <article
      className={cn(
        'rounded-xl border border-border/80 bg-card p-5 shadow-sm transition-all hover:border-primary/15',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Rank #{region.rank}
        </span>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
          Score {region.performanceScore}
        </span>
      </div>
      <h4 className="mt-2 text-lg font-semibold">{region.region}</h4>
      <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div>
          <dt className="text-muted-foreground">Revenue</dt>
          <dd className="font-semibold">{formatCurrency(region.revenue, true)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Orders</dt>
          <dd className="font-semibold">{formatNumber(region.orders)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Profit</dt>
          <dd className="font-semibold">{formatCurrency(region.profit, true)}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">Growth</dt>
          <dd className={cn('font-semibold', region.growth >= 0 ? 'text-success' : 'text-destructive')}>
            {formatPercent(region.growth)}
          </dd>
        </div>
      </dl>
    </article>
  )
})

interface RankingCardProps {
  rank: number
  title: string
  value: string
  subtitle?: string
  className?: string
}

export const RankingCard = memo(function RankingCard({
  rank,
  title,
  value,
  subtitle,
  className,
}: RankingCardProps) {
  return (
    <div
      className={cn(
        'flex items-center gap-4 rounded-xl border border-border/80 bg-card p-4 shadow-sm',
        className,
      )}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-sm font-bold">
        {rank}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{title}</p>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <span className="text-sm font-semibold text-primary">{value}</span>
    </div>
  )
})
