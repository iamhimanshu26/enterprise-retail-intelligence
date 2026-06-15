import { cn } from '@/lib/cn'
import { Filter, Search } from 'lucide-react'

interface FilterBarProps {
  searchPlaceholder?: string
  children?: React.ReactNode
  className?: string
}

export function FilterBar({
  searchPlaceholder = 'Search...',
  children,
  className,
}: FilterBarProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-3 rounded-xl border border-border bg-card p-4',
        className,
      )}
    >
      <div className="relative min-w-[200px] flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          disabled
          className="w-full rounded-lg border border-input bg-background py-2 pl-10 pr-4 text-sm text-muted-foreground placeholder:text-muted-foreground/60"
        />
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span>Filters</span>
      </div>
      {children}
    </div>
  )
}
