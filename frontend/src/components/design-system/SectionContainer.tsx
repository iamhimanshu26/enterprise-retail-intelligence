import { cn } from '@/lib/cn'

interface SectionContainerProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  headerAction?: React.ReactNode
}

export function SectionContainer({
  title,
  description,
  children,
  className,
  headerAction,
}: SectionContainerProps) {
  return (
    <section className={cn('space-y-4', className)}>
      {(title || description || headerAction) && (
        <div className="flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="text-lg font-semibold text-foreground">{title}</h2>}
            {description && (
              <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {headerAction}
        </div>
      )}
      {children}
    </section>
  )
}
