import { Search, Command } from 'lucide-react'
import { cn } from '@/lib/cn'

interface GlobalSearchProps {
  className?: string
  onClick?: () => void
}

export function GlobalSearch({ className, onClick }: GlobalSearchProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-9 w-full max-w-sm items-center gap-2 rounded-lg border border-border bg-muted/40 px-3 text-sm text-muted-foreground transition-colors hover:bg-muted/60',
        className,
      )}
    >
      <Search className="h-4 w-4 shrink-0" />
      <span className="flex-1 text-left">Search modules, reports...</span>
      <kbd className="hidden items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-medium sm:inline-flex">
        <Command className="h-3 w-3" />K
      </kbd>
    </button>
  )
}
