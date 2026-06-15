import { cn } from '@/lib/cn'

interface ChartContainerProps {
  title: string
  description?: string
  height?: string
  className?: string
  children?: React.ReactNode
}

export function ChartContainer({
  title,
  description,
  height = 'h-64',
  className,
  children,
}: ChartContainerProps) {
  return (
    <div className={cn('rounded-xl border border-border/80 bg-card shadow-sm', className)}>
      <div className="border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      <div className={cn('flex items-center justify-center p-6', height)}>
        {children ?? (
          <p className="text-xs text-muted-foreground">Chart visualization — future phase</p>
        )}
      </div>
    </div>
  )
}
