import { cn } from '@/lib/cn'

interface ExecutiveSummaryCardProps {
  title: string
  summary: string
  highlights?: string[]
  className?: string
}

export function ExecutiveSummaryCard({
  title,
  summary,
  highlights = [],
  className,
}: ExecutiveSummaryCardProps) {
  return (
    <div className={cn('rounded-xl border border-border/80 bg-gradient-to-br from-primary/5 to-card p-6 shadow-sm', className)}>
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{summary}</p>
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
    </div>
  )
}
