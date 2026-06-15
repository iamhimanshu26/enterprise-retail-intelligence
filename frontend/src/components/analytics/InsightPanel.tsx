import { cn } from '@/lib/cn'
import { Lightbulb } from 'lucide-react'

interface InsightPanelProps {
  title?: string
  insight?: string
  className?: string
}

export function InsightPanel({
  title = 'Business Insight',
  insight = 'AI-generated insights will appear here in a future phase.',
  className,
}: InsightPanelProps) {
  return (
    <div className={cn('rounded-xl border border-border/80 bg-card p-5 shadow-sm', className)}>
      <div className="flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold">{title}</h3>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{insight}</p>
    </div>
  )
}
