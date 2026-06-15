import { cn } from '@/lib/cn'

interface ActionToolbarProps {
  children: React.ReactNode
  className?: string
}

export function ActionToolbar({ children, className }: ActionToolbarProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3',
        className,
      )}
    >
      {children}
    </div>
  )
}
