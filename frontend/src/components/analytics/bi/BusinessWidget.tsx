import { memo } from 'react'
import { cn } from '@/lib/cn'
import type { ExecutiveWidget } from '@/types/dashboard'

interface BusinessWidgetProps {
  widget: ExecutiveWidget
  className?: string
}

export const BusinessWidget = memo(function BusinessWidget({ widget, className }: BusinessWidgetProps) {
  const maxValue = Math.max(...widget.items.map((i) => i.value), 1)

  return (
    <article
      className={cn(
        'rounded-xl border border-border/80 bg-card p-5 shadow-sm transition-all hover:border-primary/15 hover:shadow-md',
        className,
      )}
    >
      <h3 className="text-sm font-semibold text-foreground">{widget.title}</h3>
      <p className="mt-0.5 text-xs text-muted-foreground">{widget.description}</p>
      <ul className="mt-4 space-y-3" role="list">
        {widget.items.map((item) => (
          <li key={item.label} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-foreground">{item.label}</span>
              <span className="text-muted-foreground">{item.value}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </article>
  )
})

interface DistributionCardProps {
  title: string
  description?: string
  items: { label: string; value: number }[]
  className?: string
}

export const DistributionCard = memo(function DistributionCard({
  title,
  description,
  items,
  className,
}: DistributionCardProps) {
  return (
    <BusinessWidget
      widget={{ id: title, title, description: description ?? '', items }}
      className={className}
    />
  )
})
