import { cn } from '@/lib/cn'
import { formatRelativeTime } from '@/lib/formatters'
import type { ActivityEvent } from '@/types/dashboard'
import { Circle } from 'lucide-react'

interface ActivityCardProps {
  activity: ActivityEvent
  isLast?: boolean
  className?: string
}

export function ActivityCard({ activity, isLast, className }: ActivityCardProps) {
  return (
    <article className={cn('relative flex gap-4 pb-6', className)} aria-label={activity.title}>
      {!isLast && (
        <span
          className="absolute left-[7px] top-4 h-full w-px bg-border"
          aria-hidden="true"
        />
      )}
      <div className="relative z-10 mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background">
        <Circle className="h-2 w-2 fill-primary text-primary" />
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
  className?: string
}

export function ActivityFeed({ activities, className }: ActivityFeedProps) {
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
