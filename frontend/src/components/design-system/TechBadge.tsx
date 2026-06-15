import { cn } from '@/lib/cn'

interface TechBadgeProps {
  label: string
  className?: string
}

export function TechBadge({ label, className }: TechBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-md border border-border bg-muted/60 px-2 py-0.5 font-mono text-[10px] font-medium text-muted-foreground',
        className,
      )}
    >
      {label}
    </span>
  )
}
