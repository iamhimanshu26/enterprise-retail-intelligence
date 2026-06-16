import { cn } from '@/lib/cn'

interface GeneratorCardProps {
  title: string
  description?: string
  children: React.ReactNode
  className?: string
  icon?: React.ReactNode
}

export function GeneratorCard({ title, description, children, className, icon }: GeneratorCardProps) {
  return (
    <div className={cn('rounded-xl border border-border/80 bg-card shadow-sm', className)}>
      <div className="border-b border-border/60 px-5 py-4">
        <div className="flex items-center gap-3">
          {icon && <div className="text-primary">{icon}</div>}
          <div>
            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
          </div>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  )
}
