import { ActivityFeed } from './ActivityCard'

interface ActivityTimelineProps {
  activities: import('@/types/dashboard').ActivityEvent[]
  className?: string
}

export function ActivityTimeline({ activities, className }: ActivityTimelineProps) {
  return <ActivityFeed activities={activities} className={className} />
}
