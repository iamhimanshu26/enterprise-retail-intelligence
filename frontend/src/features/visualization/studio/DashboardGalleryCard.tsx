import { Link } from 'react-router-dom'
import { ArrowRight, BarChart3, Clock, Database } from 'lucide-react'
import { StatusBadge } from '@/components/design-system'
import { cn } from '@/lib/cn'
import type { DashboardGalleryItem } from './dashboardGalleryConfig'

interface DashboardGalleryCardProps {
  item: DashboardGalleryItem
}

export function DashboardGalleryCard({ item }: DashboardGalleryCardProps) {
  const Icon = item.icon

  return (
    <article
      className={cn(
        'group flex flex-col rounded-xl border border-border/80 bg-card p-5 shadow-sm transition-all',
        'hover:border-primary/30 hover:shadow-md',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <StatusBadge status={item.status === 'completed' ? 'completed' : 'in-progress'} />
      </div>

      <h3 className="mt-4 text-base font-semibold tracking-tight text-foreground">{item.title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground line-clamp-2">{item.description}</p>

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <BarChart3 className="h-3.5 w-3.5" />
          {item.chartCount} charts
        </span>
        <span className="inline-flex items-center gap-1">
          <Database className="h-3.5 w-3.5" />
          {item.dataSource}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" />
          {item.lastUpdated}
        </span>
      </div>

      <Link
        to={item.path}
        className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        Open dashboard
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </article>
  )
}
