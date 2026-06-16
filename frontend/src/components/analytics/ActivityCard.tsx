import { memo } from 'react'
import { Activity } from 'lucide-react'
import { TimelineSkeleton } from '@/components/design-system/LoadingSkeleton'
import { EmptyState } from '@/components/design-system/EmptyState'
import { DASHBOARD_EMPTY } from '@/lib/dashboard-empty-messages'
import { cn } from '@/lib/cn'
import { formatRelativeTime } from '@/lib/formatters'
import type { ActivityEvent, ActivityIconKey } from '@/types/dashboard'
import {
  BarChart3,
  Calendar,
  Circle,
  Database,
  LogIn,
  RefreshCw,
  Upload,
} from 'lucide-react'

const ACTIVITY_ICONS: Record<ActivityIconKey, React.ComponentType<{ className?: string }>> = {
  refresh: RefreshCw,
  upload: Upload,
  calendar: Calendar,
  chart: BarChart3,
  database: Database,
  login: LogIn,
  default: Circle,
}

interface ActivityCardProps {
  activity: ActivityEvent
  isLast?: boolean
  className?: string
}

export function ActivityCard({ activity, isLast, className }: ActivityCardProps) {
  const Icon = ACTIVITY_ICONS[activity.icon ?? 'default']

  return (
    <article className={cn('relative flex gap-4 pb-6', className)} aria-label={activity.title}>
      {!isLast && (
        <span
          className="absolute left-[11px] top-4 h-full w-px bg-border"
          aria-hidden="true"
        />
      )}
      <div className="relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background text-primary">
        <Icon className="h-3 w-3" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-sm font-semibold text-foreground">{activity.title}</h4>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            {activity.category}
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{activity.description}</p>
        <time className="mt-2 block text-xs text-muted-foreground" dateTime={activity.timestamp}>
          {formatRelativeTime(activity.timestamp)}
        </time>
      </div>
    </article>
  )
}

interface ActivityFeedProps {
  activities: ActivityEvent[]
  loading?: boolean
  className?: string
}

export function ActivityFeed({ activities, loading, className }: ActivityFeedProps) {
  if (loading) {
    return <TimelineSkeleton className={className} />
  }

  if (activities.length === 0) {
    return (
      <EmptyState
        icon={Activity}
        title={DASHBOARD_EMPTY.activity.title}
        description={DASHBOARD_EMPTY.activity.description}
        compact
      />
    )
  }

  return (
    <div className={cn('pt-1', className)} role="feed" aria-label="Recent activity">
      {activities.map((activity, index) => (
        <ActivityCard
          key={activity.id}
          activity={activity}
          isLast={index === activities.length - 1}
        />
      ))}
    </div>
  )
}

interface ActivityTimelineProps {
  activities: ActivityEvent[]
  loading?: boolean
  className?: string
}

export const ActivityTimeline = memo(function ActivityTimeline({
  activities,
  loading,
  className,
}: ActivityTimelineProps) {
  return <ActivityFeed activities={activities} loading={loading} className={className} />
})
