import { cn } from '@/lib/cn'
import { Calendar } from 'lucide-react'

interface DateRangeSelectorProps {
  className?: string
  label?: string
}

export function DateRangeSelector({
  className,
  label = 'Last 30 days',
}: DateRangeSelectorProps) {
  return (
    <button
      type="button"
      disabled
      className={cn(
        'inline-flex items-center gap-2 rounded-lg border border-input bg-background px-3 py-2 text-sm text-muted-foreground transition-colors',
        className,
      )}
    >
      <Calendar className="h-4 w-4" />
      {label}
    </button>
  )
}
