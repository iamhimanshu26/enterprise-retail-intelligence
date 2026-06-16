import { cn } from '@/lib/cn'

interface SectionContainerProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  headerAction?: React.ReactNode
  titleId?: string
}

export function SectionContainer({
  title,
  description,
  children,
  className,
  headerAction,
  titleId,
}: SectionContainerProps) {
  return (
    <section className={cn('space-y-4', className)} aria-labelledby={titleId}>
      {(title || description || headerAction) && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title && (
              <h2 id={titleId} className="text-lg font-semibold text-foreground">
                {title}
              </h2>
            )}
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
