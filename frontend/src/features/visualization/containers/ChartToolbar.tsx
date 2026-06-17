import { Download, Maximize2, RefreshCw, Settings, SlidersHorizontal } from 'lucide-react'
import { showDashboardPlaceholder } from '@/stores/toastStore'
import { cn } from '@/lib/cn'

interface ChartToolbarProps {
  onRefresh?: () => void
  className?: string
}

export function ChartToolbar({ onRefresh, className }: ChartToolbarProps) {
  return (
    <div className={cn('flex flex-wrap items-center gap-1', className)}>
      <button
        type="button"
        onClick={() => onRefresh?.() ?? showDashboardPlaceholder('Chart refreshed', 'Live refresh connects in Sprint 6.2+')}
        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label="Refresh chart"
      >
        <RefreshCw className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => showDashboardPlaceholder('Export chart', 'Chart export placeholder — PNG/CSV in Sprint 6.2')}
        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label="Export chart"
      >
        <Download className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => showDashboardPlaceholder('Fullscreen', 'Fullscreen chart view planned for Sprint 6.2')}
        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label="Fullscreen"
      >
        <Maximize2 className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => showDashboardPlaceholder('Chart filters', 'Per-chart filters planned for Sprint 6.2')}
        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label="Filter chart"
      >
        <SlidersHorizontal className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => showDashboardPlaceholder('Chart settings', 'Chart settings panel planned for Sprint 6.2')}
        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
        aria-label="Chart settings"
      >
        <Settings className="h-4 w-4" />
      </button>
    </div>
  )
}
