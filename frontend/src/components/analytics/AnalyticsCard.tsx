import { cn } from '@/lib/cn'
import type { LucideIcon } from 'lucide-react'

interface AnalyticsCardProps {
  title: string
  metric?: string
  change?: string
  icon?: LucideIcon
  className?: string
}

export function AnalyticsCard({ title, metric = '—', change, icon: Icon, className }: AnalyticsCardProps) {
  return (
    <div className={cn('rounded-xl border border-border/80 bg-card p-5 shadow-sm', className)}>
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight">{metric}</p>
      {change && <p className="mt-1 text-xs text-muted-foreground">{change}</p>}
    </div>
  )
}
