import type { LucideIcon } from 'lucide-react'
import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/cn'

export interface SummaryCardProps {
  title: string
  summary: string
  highlights?: string[]
  tags?: string[]
  recommendation?: string
  icon?: LucideIcon
  className?: string
}

export function SummaryCard({
  title,
  summary,
  highlights = [],
  tags = [],
  recommendation,
  icon: Icon = Sparkles,
  className,
}: SummaryCardProps) {
  return (
    <article
      className={cn(
        'rounded-xl border border-border/80 bg-gradient-to-br from-primary/5 to-card p-6 shadow-sm',
        className,
      )}
      aria-label={title}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold tracking-tight">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{summary}</p>
        </div>
      </div>

      {tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2" role="list" aria-label="Summary tags">
          {tags.map((tag) => (
            <span
              key={tag}
              role="listitem"
              className="rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {highlights.length > 0 && (
        <ul className="mt-4 space-y-1.5">
          {highlights.map((item) => (
            <li key={item} className="flex items-start gap-2 text-xs text-foreground">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary" />
              {item}
            </li>
          ))}
        </ul>
      )}

      {recommendation && (
        <div className="mt-4 rounded-lg border border-primary/15 bg-primary/5 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">Recommendation</p>
          <p className="mt-1 text-sm leading-relaxed text-foreground">{recommendation}</p>
        </div>
      )}
    </article>
  )
}
